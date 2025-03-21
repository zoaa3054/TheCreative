import styled from "styled-components";
import backgroundLogo from "../assets/backgroundLogo.jpg";
const WelcomePage = ()=>{

    return(
        <Container>
            <BackgroundImage src={backgroundLogo} alt="backgroundLogo"/> 
            <h1 style={{marginBottom:"2rem", fontFamily: "Arial, Helvetica, sans-serif", fontSize:"3rem"}}>Welcome to The Creative in Math</h1>
            <h6 style={{marginBottom:"2rem", fontFamily: "Arial, Helvetica, sans-serif", fontSize:"1rem"}}>This is the official website for Mr. Alaa Mohey's courses</h6>
            <Button>WATCH VIDEO</Button>
        </Container>
    );
};

export default WelcomePage;

const Container = styled.div`
    height: 100dvh;
    background-color: #353535c8;
    padding: 1rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const BackgroundImage = styled.img`
    position: fixed;
    z-index: -1;
`;

const Button = styled.button`
    border: 1px solid white;
    background-color: white;
    border-radius: 2rem;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 1rem;
    color: black;
    &:hover{
        color: white;
        background-color: transparent;
    }
`;
