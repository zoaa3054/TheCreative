import styled, { keyframes } from "styled-components";
import backgroundLogo from "../assets/backgroundLogo.jpg";
const WelcomePage = ()=>{

    return(
        <Container backgroundLogo={backgroundLogo}>
            <WelcomeText>{window.innerHeight<=500?"Welcome Home":"Welcome to The Creative in Math"}</WelcomeText>
            <Describtion>This is the official website for Mr. Alaa Mohey's courses</Describtion>
            <Button>WATCH VIDEO</Button>
        </Container>
    );
};

export default WelcomePage;

const Container = styled.div`
    height: 100vh;
    padding: 1rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: ${window.innerHeight<=500?"start":"center"};
    flex-direction: column;
    background-image: url(${({backgroundLogo})=>backgroundLogo});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #262727a7;
    background-blend-mode: darken;
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
    width: ${window.innerWidth<=500?"21.8rem":"26.5rem"};
    white-space: nowrap;
    overflow: hidden;
    animation: ${typing} 2.5s steps(57), ${cursor} 0.4s step-end infinite alternate;
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
