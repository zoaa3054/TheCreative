import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const WelcomePageLayout = ()=>{
    const navigate = useNavigate();
    return(
        <>
            <Container>
                <Logo>TheCreative</Logo>
                <IconsContainer>
                    <Icon>About</Icon>
                    <Icon onClick={()=>{window.location.href = "mailto:easymath85@gmail.com"}}>Contact</Icon>
                    <Icon onClick={()=>navigate('/register', {state:{desiredForm:'signup'}})}>SignUp</Icon>
                    <LoginButton onClick={()=>navigate('/register', {state:{desiredForm:'login'}})}>LogIn</LoginButton>
                </IconsContainer>
            </Container>
            <Outlet/>
        </>
    );
};

export default WelcomePageLayout;

const Container = styled.div`
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: fit-content;
    color: white;
    display: flex;
    font-family: Arial, Helvetica, sans-serif;
`;

const Logo = styled.h2`
    margin: 1rem;
    width: 50%;
    font-size: 2rem;
    height: fit-content;
    font-family: URW Chancery L, cursive;
`;

const IconsContainer = styled.div`
    margin: 1rem;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
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
