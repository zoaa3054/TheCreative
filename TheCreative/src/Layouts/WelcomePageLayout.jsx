import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import facebookIcon from "../assets/facebookIcon.png";
import youtubeIcon from "../assets/youtubeIcon.png";
import swapeRightIcon from "../assets/swapeRightIcon.png";
import swapeLeftIcon from "../assets/swapeLeftIcon.png";


const WelcomePageLayout = ()=>{
    const navigate = useNavigate();
    const [sideBarSwitch, setSideBarSwitch] = useState(false);
    const [aboutSwitch, setAboutSwitch] = useState(false);
    const [videoTutorial, setVideoTutorial] = useState(false);
    const videoRef = useRef();

    useEffect(()=>{
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.25;
         }
    }, [])

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [isShortScreen, setIsShortScreen] = useState(false);

    useEffect(() => {
        setIsShortScreen(window.innerHeight <= 500);
    }, []);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        const diff = touchStartX.current - touchEndX.current;

        if (diff > 50 && window.innerWidth <= 500) {
            setSideBarSwitch(false); 
        } else if (diff < -50 && window.innerWidth <= 500) {
        setSideBarSwitch(true);
        }
    };

    const handleClick = () => {
        setSideBarSwitch(false);
    };
    return(
        <div style={{
            // position: "relative",
            // zIndex: "1",
            overflow: "hidden",
            height: "100vh",
            }}>
             <Video autoPlay muted loop playsInline useRef={videoRef}>
                <source src="https://cdn.pixabay.com/video/2022/04/09/113385-697718118_large.mp4" type="video/mp4" />
            </Video>
            <SideBar sideBarSwitch={sideBarSwitch}>
                <Icon onClick={()=>setAboutSwitch(true)}>About</Icon>
                <Icon onClick={()=>{window.location.href = "mailto:easymath85@gmail.com"}}>Contact</Icon>
                <Icon onClick={()=>navigate('/register', {state:{desiredForm:'signup'}})}>SignUp</Icon>
                <Icon onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</Icon>
                <Icon onClick={()=>setSideBarSwitch(false)}>← </Icon>
            </SideBar>
            <div style={{
                width: "100%",
                // position: "relative",
                // zIndex: "1",
                overflow: "hidden",
                height: "100vh",
                display:"flex", 
                flexDirection: "column",
                }}>
            <Container sideBarSwitch={sideBarSwitch}>
                <div style={{display: 'flex', width: "100%"}}>
                    <Logo>TheCreative</Logo>
                </div>
                <IconsContainer sideBarSwitch={sideBarSwitch}>
                    <Icon onClick={()=>setAboutSwitch(true)}>About</Icon>
                    <Icon onClick={()=>{window.location.href = "mailto:easymath85@gmail.com"}}>Contact</Icon>
                    <Icon onClick={()=>navigate('/register', {state:{desiredForm:'signup'}})}>SignUp</Icon>
                    <LoginButton onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</LoginButton>
                </IconsContainer>
            </Container>
            
            <WelcomeContainer
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    isShortScreen={isShortScreen}
                    >
                   
                    <WelcomeText>
                        {isShortScreen ? "Welcome Home" : "Welcome to The Creative in Math"}
                    </WelcomeText>
                    {!isShortScreen && <Describtion>The official website for Mr. Alaa Mohey</Describtion>}
                    <SwappingInfo>
                    {   sideBarSwitch?<>
                        <img src={swapeLeftIcon} alt="" style={{width:"2rem", height:"2rem", cursor:"pointer", margin: "1rem"}} onClick={()=>setSideBarSwitch(false)}/>
                        <p>Swap left for less</p>
                        </>:<> 
                        <img src={swapeRightIcon} alt="" style={{width:"2rem", height:"2rem", cursor:"pointer", margin: "1rem"}} onClick={()=>setSideBarSwitch(true)}/>
                        <p>Swap right for more</p></>
                    }
                    </SwappingInfo>
                    <ButtonWrapper>
                        <Button onClick={()=>{setVideoTutorial(true)}}>How To Use</Button>
                        <Button onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</Button>
                    </ButtonWrapper>
                    
                    
                    </WelcomeContainer>
            </div>
            <Modal
                isOpen={aboutSwitch}
                onRequestClose={()=>setAboutSwitch(false)}
                style={aboutStyle}
            >
                <ModalButton onClick={()=>setAboutSwitch(false)} style={{alignSelf:"end"}}>X</ModalButton>
                <h2>Mr. Alaa Mohey, Mathematics teacher in Elekbal National College in Alexandria, Egypt. Teaches from Middle 1 to Senior 2.</h2>
                <div style={{display: "flex", alignSelf:"center"}}>
                <ModalButton onClick={()=>window.open('https://www.facebook.com/share/192tEXETrm/')} style={{justifySelf:"center"}}>
                    <img src={facebookIcon} alt=""/>
                </ModalButton>
                <ModalButton onClick={()=>window.open('https://www.youtube.com/channel/UCpxwyheWurUnB4GluDMJ1Zw')} style={{justifySelf:"center", scale:"0.7"}}>
                    <img src={youtubeIcon} alt=""/>
                </ModalButton>
                </div>
            </Modal>
            <Modal
                isOpen={videoTutorial}
                onRequestClose={()=>setVideoTutorial(false)}
                style={aboutStyle}
            >
                <ModalButton onClick={()=>setVideoTutorial(false)} style={{alignSelf:"end"}}>X close</ModalButton>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/hZwqonx5XVI?si=qgwM-ocmUUL478_l" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>            
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
    transition: width 0.5s;
    

`;



const SideBar = styled.div`
    transform: ${({sideBarSwitch})=>sideBarSwitch?"translateX(0%)":"translateX(-100%)"};
    transition: transform 0.5s;
    height: 100vh;
    position: absolute;
    z-index: 2;
    display: none;
    grid-template-columns: 1fr;
    gap: 1rem;
    background-color: #262727a7;
    padding: 1rem;
    justify-content: start;
    ${({sideBarSwitch})=>sideBarSwitch&&"backdrop-filter: blur(10px)"};

    @media (max-width: 500px) {
        display: grid;
    }

    button{
        &:nth-child(5){
            grid-row-end: auto;
        }
    }
`;

const Logo = styled.h2`
    font-size: 1.5rem;
    height: fit-content;
    font-family: URW Chancery L, cursive;
    padding-left: 1rem;
`;

const IconsContainer = styled.div`
    /* margin: 1rem; */
    height: fit-content;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    padding-right: 1rem;
    display: flex;
    
    @media (max-width: 500px) {
        display: none;
    }
`;

const Icon = styled.button`
    color: white;
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    
    font-size: 1rem;
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


const ModalButton = styled.button`
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

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: -1;
`;

const aboutStyle = {
    content:{
        justifySelf:"center",
        width: "auto",
        height: "auto",
        display: "flex", 
        flexDirection: "column",
        borderRadius: "25px",
        alignSelf:"center",
        maxWidth: `${window.innerWidth<=500?"320px":"fit-content"}`,
        overflow:"scroll"
    }
}



const WelcomeContainer = styled.div`
    /* height: 100%; */
    flex-grow: 1;
    padding: 1rem;
    color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: start;
    overflow: hidden;
    /* position: relative;
    z-index: 1; */
`; 



const typing = keyframes`
    from{
        width: 0;
    }
`;

const cursor = keyframes`
    50%{
        border-color: transparent;
    }
`;

const fadeIn = keyframes`
    from{
        opacity: 0;
        transform: translateY(-2rem);
    }
    to{
        opacity: 1;
        transform: translateY(0);
    }
`;

const WelcomeText = styled.h1`
    margin-bottom: 2rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 3rem;
    animation: ${fadeIn} 1s ease-in-out; 
`;
const Describtion = styled.h6`
    margin-bottom: 2rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    display: ${window.innerHeight<=500&&"none"};
    border-right: 1px solid white;
    width: 19rem;
    white-space: nowrap;
    overflow: hidden;
    animation: ${typing} 2.5s steps(39), ${cursor} 0.4s step-end infinite alternate;
`;

const SwappingInfo = styled.div`
    display: none;
    flex-direction: row;
    font-size: 0.7rem;
    justify-content: center;
    align-items: center;
    /* z-index: 1;
    position: relative; */

    @media (max-width: 500px) {
        display: flex;
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
`;

const Button = styled.button`
    border: 1px solid white;
    background-color: white;
    border-radius: 2rem;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 1rem;
    color: black;
    width: 13rem;
    height: fit-content;

    &:hover{
        color: white;
        background-color: transparent;
    }

    &:nth-child(2){
        background-color: transparent;
        color: white;
        &:hover{
            background-color: white;
            color: black;
        }
    }
`;

