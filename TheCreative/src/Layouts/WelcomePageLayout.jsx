import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import sideBarIcon from "../assets/sidebarIcon.png";
import { useState } from "react";
import Modal from "react-modal";
import facebookIcon from "../assets/facebookIcon.png";


const WelcomePageLayout = ()=>{
    const navigate = useNavigate();
    const [sideBarSwitch, setSideBarSwitch] = useState(false);
    const [aboutSwitch, setAboutSwitch] = useState(false);

    return(
        <div style={{display:"flex"}}>
            <SideBar sideBarSwitch={sideBarSwitch}>
                <Icon onClick={()=>setAboutSwitch(true)}>About</Icon>
                <Icon onClick={()=>{window.location.href = "mailto:easymath85@gmail.com"}}>Contact</Icon>
                <Icon onClick={()=>navigate('/register', {state:{desiredForm:'signup'}})}>SignUp</Icon>
                <Icon onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</Icon>
                <Icon onClick={()=>setSideBarSwitch(false)}>← </Icon>
            </SideBar>
            <div style={{width: "100%"}}>
            <Container sideBarSwitch={sideBarSwitch}>
                <div style={{display: 'flex', width: "100%"}}>
                    <SideBarButton>
                        <img src={sideBarIcon} alt="" style={{width:"2rem", height:"2rem", cursor:"pointer", margin: "1rem"}} onClick={()=>setSideBarSwitch(true)}/>
                    </SideBarButton>
                    <Logo>TheCreative</Logo>
                </div>
                <IconsContainer sideBarSwitch={sideBarSwitch}>
                    <Icon onClick={()=>setAboutSwitch(true)}>About</Icon>
                    <Icon onClick={()=>{window.location.href = "mailto:easymath85@gmail.com"}}>Contact</Icon>
                    <Icon onClick={()=>navigate('/register', {state:{desiredForm:'signup'}})}>SignUp</Icon>
                    <LoginButton onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</LoginButton>
                </IconsContainer>
            </Container>
            <Outlet/>
            </div>
            <Modal
                isOpen={aboutSwitch}
                onRequestClose={()=>setAboutSwitch(false)}
                style={aboutStyle}
            >
                <Button onClick={()=>setAboutSwitch(false)} style={{alignSelf:"end"}}>X</Button>
                <h2>Info about Mr. Alaa Mohey </h2>
                <Button onClick={()=>window.open('https://www.facebook.com/share/192tEXETrm/')} style={{justifySelf:"center"}}>
                    <img src={facebookIcon} alt=""/>
                </Button>
            </Modal>
        </div>
    );
};

export default WelcomePageLayout;

const Container = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: fit-content;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #262727a7;
    transition: width 0.5s;

`;

const SideBarButton = styled.button`
    background-color: transparent;
    border: none; 
    align-items: center;
    display: ${window.innerWidth<=500?"flex":"none"};
    /* position: fixed; */
    
    &:hover{
        scale: 1.2;
    }
`;

const SideBar = styled.div`
    transform: ${({sideBarSwitch})=>sideBarSwitch?"translateX(0%)":"translateX(-100%)"};
    transition: transform 0.5s;
    height: 100%;
    position: fixed;
    display: ${window.innerWidth<=500?"grid":"none"};
    grid-template-columns: 1fr;
    gap: 1rem;
    background-color: #262727a7;
    padding: 1rem;
    justify-content: start;
    ${({sideBarSwitch})=>sideBarSwitch&&"backdrop-filter: blur(10px)"};

    button{
        &:nth-child(5){
            grid-row-end: auto;
        }
    }
`;

const Logo = styled.h2`
    font-size: 2rem;
    height: fit-content;
    font-family: URW Chancery L, cursive;
    padding-left: 1rem;
`;

const IconsContainer = styled.div`
    /* margin: 1rem; */
    height: fit-content;
    display: ${window.innerWidth<=500?"none":"flex"};
    justify-content: space-between;
    align-items: center;
    width: 50%;
    padding-right: 1rem;
`;

const Icon = styled.button`
    color: white;
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    font-size: 1.5rem;
    cursor: pointer;
    &:hover{
        scale: 1.2;
        color: #81f5f5;
    }
`;

const LoginButton = styled.button`
    border-radius: 2rem;
    background-color: #81f5f5;
    color: black;
    margin: 0;

    padding: 1rem;
    font-size: 1.5rem;
    border: 1px solid white;
    cursor: pointer;
    &:hover{
        color: white;
        background-color: transparent;
    }
`;


const Button = styled.button`
    background-color: transparent;
    padding: 1rem;
    color: black;
    justify-self: center;
    cursor: pointer;
    font-weight: bolder;
    border: none;
    &:hover{
        background-color: #ffffff7f;
    }
`;

const aboutStyle = {
    content:{
        justifySelf:"center",
        width: "fit-content",
        height: "fit-content",
        display: "flex", 
        flexDirection: "column",
        borderRadius: "25px",
        alignSelf:"center",
        maxWidth: "300px"
    }
}
