import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import walletLogo from "../assets/wallet.png";
import lightModeLogo from "../assets/lightMode.png";
import darkModeLogo from "../assets/darkMode.png";
import sideBarIcon from "../assets/sidebarIcon.png";
import enableNotificationsIcon from "../assets/enableNotifications.png";
import disableNotificationsIcon from "../assets/disableNotifications.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentContentOutlet from "../Outlets/StudentContentOutlet";

const StudentHomePageLayout = ({ backend })=>{
    const [selectedComponent, setSelectedComponent] = useState('dashboard');
    const [wallet, setWallet] = useState(0);
    const [theme, setTheme] = useState(localStorage.getItem('TheCreativeTheme')?localStorage.getItem('TheCreativeTheme'):'light');
    const [isSideBarOpen, setIsSideBarOpen] = useState(window.innerWidth<400?false:true);
    const navigate = useNavigate();
    const [buyingAlert, setBuyingAlert] = useState(0);
    const [FAQNumber, setFAQNumber] = useState('+201557792361');
    const [problemsReportNumber, setProblemsReportNumber] = useState('+201557792361');
    const [notifSwitch, setNotifSwitch] = useState(false);

    useEffect(()=>{
        getWallet();
        getFAQNumber();
        getProblemsReportNumber();
    }, [buyingAlert]);

    useEffect(()=>{
        notificationPermissionPrompt();
        getNotificationsToken()
        .then((token)=>{
            if(token) setNotifSwitch(true);
        })
    }, [])

    const logout = ()=>{
        sessionStorage.removeItem("theCreativeAuthToken");
        navigate('/');
    }

    const sendTokenToBackend = async(currentToken) => {
        await fetch(`${backend}/notifications/token`,{
            method:"POST",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            },
            body: JSON.stringify({token: currentToken})
        })
        .then((result)=>{
            if(result.status==200) console.log("Token sent successfuly");
            else throw Error("Something went wrong");
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const getNotificationsToken = async()=>{
        let supposedToken;
        await fetch(`${backend}/notifications/token`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>supposedToken = data.token)
        .catch((error)=>{
            console.log(error);
        })
        return supposedToken;
    }

    const deleteNotificationsToken = async()=>{
        await fetch(`${backend}/delete/notifications/token`,{
            method:"DELETE",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) console.log("Notifications token deleted successfuly");
            else throw Error("Something went wrong");
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const getWallet = async()=>{
        await fetch(`${backend}/user/wallet`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>setWallet(data.cash))
        .catch((error)=>{
            console.log(error);
            notifyError("Something went wrong with the system please logout and login again!");
        })
    }

    const getFAQNumber = async()=>{
        await fetch(`${backend}/faqNumber`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>setFAQNumber(data.faqNumber))
        .catch((error)=>{
            console.log(error);
        })
    }

    const getProblemsReportNumber = async()=>{
        await fetch(`${backend}/problemsReportNumber`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>setProblemsReportNumber(data.problemsReportNumber))
        .catch((error)=>{
            console.log(error);
        })
    }




    const notifyError = (mssg)=>{
        toast.error(mssg);
    }

    const goToWallet = ()=>{
        setSelectedComponent('wallet');
    }

    const toggleSideBar = ()=>{
        setIsSideBarOpen(prev=>!prev);
    }

    const switchTheme = ()=>{
        if (theme == 'light') {
            setTheme('dark');
            localStorage.setItem("TheCreativeTheme", 'dark');
        }
        else{
            setTheme('light');
            localStorage.setItem("TheCreativeTheme", 'light');
        }
    }

    const notificationPermissionPrompt = async()=>{
        if ('Notification' in window){
            Notification.requestPermission()
            .then(async(permission)=>{
                if(permission == 'granted'){
                    let serverPublicKey = urlBase64ToUint8Array('BBTd9hGJU7ni6tyP-kRiodUmyECgP9v8gBGKjCbi4OU_z6mOgXZVittndfOqXMKeIKVUhXJgzcboili0OUY1M04');
                    let sw = await navigator.serviceWorker.ready;
                    let push = await sw.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: serverPublicKey
                    })
                    
                    sendTokenToBackend(push);
                    setNotifSwitch(true);
                }
                else{
                    console.log("couldn't enable notifications");
                    notifyError("Something went wrong, couldn't enable notifications");
                }
            })
        }
        else alert('no notification')
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
      }

    const toggleNotifications = async()=>{
        if(notifSwitch){
            deleteNotificationsToken();
            setNotifSwitch(false);
        }
        else if ('Notification' in window){
            await Notification.requestPermission()
            .then(async(permission)=>{
                if(permission == 'granted'){
                    let serverPublicKey = urlBase64ToUint8Array('BBTd9hGJU7ni6tyP-kRiodUmyECgP9v8gBGKjCbi4OU_z6mOgXZVittndfOqXMKeIKVUhXJgzcboili0OUY1M04');
                    let sw = await navigator.serviceWorker.ready;
                    let push = await sw.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: serverPublicKey
                    })
                    
                    sendTokenToBackend(push);
                    setNotifSwitch(true);
                }
                else{
                    console.log("couldn't enable notifications");
                    notifyError("Something went wrong, couldn't enable notifications");
                }
            })
        }
        else notifyError('This window does not support notifications')
    }

    return(
        <Container>
            <SideBar theme={theme} isOpen={isSideBarOpen}>
                <Head theme={theme}>
                    <Logo src={logo} alt=""/>
                    <p>TheCreative</p>
                </Head>
                <Body>
                    <Component theme={theme}
                        style={{ 
                            fontWeight: selectedComponent=='dashboard'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('dashboard')}>
                                Dashboard
                    </Component>
                    <Component theme={theme}
                        style={{ 
                            fontWeight: selectedComponent=='courses'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('courses')}>
                                Courses
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='wallet'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('wallet')}>
                                Wallet
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='profile'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('profile')}>
                                Profile
                    </Component>
                </Body>
                <Tail>
                    <Links onClick={()=>window.open(`https://wa.me/${FAQNumber}?text=`)} style={{marginBottom:"5px"}}>Ask a question</Links>
                    <Links onClick={()=>window.open(`https://wa.me/${problemsReportNumber}?text=`)}>Report an error</Links>
                </Tail>
            </SideBar>
            <RightSpace theme={theme} isSideBarOpen={isSideBarOpen}>
                <NavBar theme={theme}>
                    <NavBarIcons>
                        <img src={sideBarIcon} alt="" style={{width:"2rem", height:"2rem", cursor:"pointer", margin: "1rem"}} onClick={toggleSideBar}/>
                    </NavBarIcons>
                    <NavBarIcons>
                        <ThemeButton src={theme=='dark'?lightModeLogo:darkModeLogo} onClick={switchTheme}/>
                            {notifSwitch?
                                <img src={enableNotificationsIcon} style={{cursor:"pointer", width:"2rem", height:"2rem", marginRight:"0.5rem"}} onClick={toggleNotifications} alt=""/>
                                :<img src={disableNotificationsIcon} style={{cursor:"pointer", width:"2rem", height:"2rem", marginRight:"0.5rem"}} onClick={toggleNotifications} alt=""/>    
                            }
                        <Wallet>
                            <img src={walletLogo} style={{cursor:"pointer", width:"2rem", height:"2rem", marginRight:"0.5rem"}} onClick={goToWallet} alt=""/>
                            <p>{wallet}LE</p>
                        </Wallet>
                        <LogoutButton onClick={logout}>LOG OUT</LogoutButton>
                    </NavBarIcons>
                </NavBar>
                <StudentContentOutlet setBuyingAlert={setBuyingAlert} theme={theme} isSideBarOpen={isSideBarOpen} backend={backend} selectedComponent={selectedComponent}/>
            </RightSpace>
        </Container>
    );
};

export default StudentHomePageLayout;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    font-family: Arial, Helvetica, sans-serif;
`;

const SideBar = styled.div`
    height: 100vh;
    flex-shrink: 0;
    width: ${({isOpen})=>{
        if (isOpen)
            return "13rem";
        else 
        return "0%";
    }};
    overflow-y: scroll;
    background-color:${({theme})=>theme=="light"?"white":"black"} ;
    display: flex;
    flex-direction: column;
    transition: background-color 0.5s ease-in-out, width 0.5s ease;

    @media (max-width: 450px) {
        ${({isOpen})=>isOpen&&"width: 7rem;"}
    }
`;

const RightSpace = styled.div`
    overflow-x: hidden;
    height: 100%;
    flex-grow: 1;
    background-color: ${({theme})=>theme=="light"?"aliceblue":"#181818"};
    transition: background-color 0.5s ease-in-out, width 0.5s ease;
    overflow-y: scroll;
`;

const NavBar = styled.div`
    height: 5rem;
    width: 100%;
    background-image: ${({theme})=>theme=="light"?"linear-gradient(180deg, rgba(0,71,171,1) 0%, rgba(28,169,201,1) 100%)":"radial-gradient(circle, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)"};
    display: flex;
    justify-content: space-between;
    align-items: start;
    transition: background-image 0.5s;
`;

const NavBarIcons = styled.div`
    width: fit-content;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const Head = styled.div`
    height: 11vh;
    width: 100%;
    border-bottom: 0.5px solid ${({theme})=>theme=="light"?"black":"white"};;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f582;
    p{
        cursor:pointer; 
        font-family: URW Chancery L, cursive;
        font-weight: bold;
        color: ${({theme})=>theme=="light"?"#181818": "white"};
        display: flex;
        @media (max-width: 690px) {
            display: none;
        }
    }
`;

const Body = styled.div`
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: column;
    @media(max-width: 500px){
        width: fit-content;
    }
`;

const Tail = styled.div`
    width: 100%;
    flex-grow: 1;
    justify-content: end;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    white-space: normal;
    word-wrap: break-word;
    align-items: start;
    padding-bottom: 5rem;
`;

const Logo = styled.img`
    cursor: pointer;
    width: 6rem;
    height: 4.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Component = styled.div`
    color: ${({theme})=>theme=="light"?"#181818":"white"};
    font-weight: normal;
    cursor: pointer;
    width: 100%;
    padding: 1rem;
    margin: 0;
    white-space: nowrap;
    overflow: visible;

    &:hover{
        background-color: #dbd9d99a;
    }

    
`;

const LogoutButton = styled.button`  
    outline: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
    /* margin: 1rem; */
    color: white;
    font-size: large;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    &:hover{
        scale: 1.2;
    }
`;

const Links = styled.a`
    text-decoration: none;
    color: ${({theme})=>theme=="light"?"#ff00bf":"#00d9ff"};
    cursor: pointer;

    &:hover{
        color: #4c7efe;
    }
`;

const Wallet = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 1rem;
    color: white;
    font-size: large;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

const ThemeButton = styled.img`
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1rem;
    cursor: pointer;

    &:hover{
        transform: rotate(90deg);
        transition-duration: 0.5s;
        
    }
    
`