import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import walletLogo from "../assets/wallet.png";
import lightModeLogo from "../assets/lightMode.png";
import darkModeLogo from "../assets/darkMode.png";
import sideBarIcon from "../assets/sidebarIcon.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminContentOutlet from "../Outlets/AdminContentOutlet";

const StudentHomePageLayout = ({ backend })=>{
    const [selectedComponent, setSelectedComponent] = useState('addLecture');
    const [theme, setTheme] = useState(localStorage.getItem('TheCreativeTheme')?localStorage.getItem('TheCreativeTheme'):'light');
    const [isSideBarOpen, setIsSideBarOpen] = useState(window.innerWidth<400?false:true);
    const navigate = useNavigate();
    const [FAQNumber, setFAQNumber] = useState('+201557792361');

    const logout = ()=>{
        sessionStorage.removeItem("theCreativeAuthToken");
        navigate('/');
    }

    const notifyError = (mssg)=>{
        toast.error(mssg);
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
                    <p>TheCreative</p>
                </Head>
                <Body>
                    <Component theme={theme}
                        style={{ 
                            fontWeight: selectedComponent=='addLecture'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('addLecture')}>
                                Add Lecture
                    </Component>
                    <Component theme={theme}
                        style={{ 
                            fontWeight: selectedComponent=='courses'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('courses')}>
                                Courses
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='students'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('students')}>
                                Students
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='admins'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('admins')}>
                                Admins
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='logs'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('logs')}>
                                Logs
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='profile'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('profile')}>
                                Profile
                    </Component>
                    <Component theme={theme}
                        style={{
                            fontWeight: selectedComponent=='settings'?"bolder":"normal"}}
                            onClick={()=>setSelectedComponent('settings')}>
                                Settings
                    </Component>
                </Body>
                <Tail>
                    {/* <Links onClick={()=>window.open(`https://wa.me/${FAQNumber}?text=`)}>Contact us</Links> */}
                </Tail>
            </SideBar>
            <RightSpace theme={theme} isSideBarOpen={isSideBarOpen}>
                <NavBar theme={theme}>
                    <NavBarIcons>
                        <img src={sideBarIcon} alt="" style={{width:"2rem", height:"2rem", cursor:"pointer", margin: "1rem"}} onClick={toggleSideBar}/>
                    </NavBarIcons>
                    <NavBarIcons>
                        <ThemeButton src={theme=='dark'?lightModeLogo:darkModeLogo} onClick={switchTheme}/>
                        <LogoutButton onClick={logout}>LOG OUT</LogoutButton>
                    </NavBarIcons>
                </NavBar>
                <AdminContentOutlet theme={theme} isSideBarOpen={isSideBarOpen} backend={backend} selectedComponent={selectedComponent}/>
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
        ${({isOpen})=>isOpen&&"width: 8rem;"}
    }

`;

const RightSpace = styled.div`
    overflow-x: hidden;
    height: 100%;
    flex-grow: 1;
    flex-basis: 0;
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
`;

const Logo = styled.img`
   cursor: pointer;
    width: 6rem;
    height: 4.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Component = styled.p`
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