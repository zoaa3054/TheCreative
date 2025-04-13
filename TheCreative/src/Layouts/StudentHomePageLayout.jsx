import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import walletLogo from "../assets/wallet.png";
import lightModeLogo from "../assets/lightMode.png";
import darkModeLogo from "../assets/darkMode.png";
import sideBarIcon from "../assets/sidebarIcon.png";
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

    useEffect(()=>{
        getWallet();
        getFAQNumber();
        getProblemsReportNumber();
    }, [buyingAlert]);

    const logout = ()=>{
        sessionStorage.removeItem("theCreativeAuthToken");
        navigate('/');
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

    return(
        <Container>
            <SideBar theme={theme} isOpen={isSideBarOpen}>
                <Head theme={theme}>
                    <Logo src={logo} alt=""/>
                    <p style={{cursor:"pointer", 
                        fontFamily:"URW Chancery L, cursive", 
                        fontWeight:"bold", 
                        color: theme=="light"?"#181818":"white",
                        display: window.innerWidth<400?"none":""
                        }}>TheCreative</p>
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
    font-family: Arial, Helvetica, sans-serif;
`;

const SideBar = styled.div`
    height: 100vh;
    width: ${({isOpen})=>{
        // if(isOpen && window.innerWidth<=500)
        //     return "40%";
        // if(isOpen && window.innerWidth<=890)
        //     return "48%";
        if (isOpen)
            return "fit-content";
        else 
        return "0%";
    }};
    overflow-y: scroll;
    background-color:${({theme})=>theme=="light"?"white":"black"} ;
    display: flex;
    flex-direction: column;
    transition: background-color 0.5s ease-in-out, width 0.5s ease;
`;

const RightSpace = styled.div`
    overflow-x: hidden;
    height: 100%;
    width: ${({isOpen})=>{
        if(isOpen && window.innerWidth<=500)
            return "60%";
        if(isOpen && window.innerWidth<=890)
            return "52%";
        else if (isOpen)
            return "85%";
        
        else 
        return "100%";
    }};
    background-color: ${({theme})=>theme=="light"?"aliceblue":"#181818"};
    transition: background-color 0.5s ease-in-out, width 0.5s ease;
    overflow-y: visible;
`;

const NavBar = styled.div`
    /* position: fixed; */
    height: 5rem;
    width: 100%;
    background-image: ${({theme})=>theme=="light"?"linear-gradient(159deg, rgba(0,71,171,1) 0%, rgba(28,169,201,1) 100%)":"radial-gradient(circle, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)"};
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
    height: 12vh;
    width: 100%;
    border-bottom: 0.5px solid ${({theme})=>theme=="light"?"black":"white"};;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Body = styled.div`
    height: 60vh;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Tail = styled.div`
    height: 10vh;
    width: fit-content;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    white-space: normal;
    word-wrap: break-word;
`;

const Logo = styled.img`
    cursor: pointer;
    /* border-radius: 50%; */
    width: 4rem;
    height: 2.5rem;
    margin-right: 0.5rem;
`;

const Component = styled.p`
    color: ${({theme})=>theme=="light"?"#181818":"white"};
    font-weight: normal;
    cursor: pointer;
    width: 100%;
    padding: 1rem;
    margin: 0;
    /* white-space: nowrap; */
    overflow: hidden;
    text-overflow: ellipsis;

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