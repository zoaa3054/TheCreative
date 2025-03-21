
import styled, { keyframes } from "styled-components";
import backgroundImage from "../assets/registrationBackground.jpg";
import { useEffect, useState } from "react";
import Form from "../Components/Form.jsx";
import { useLocation } from "react-router-dom";


const pop = keyframes`
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
`;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const RegisterPage = ({ backEnd })=>{
    const locate = useLocation();
    const { desiredForm } = locate.state || {};
    const [usedForm, setUsedForm] = useState(desiredForm);
    const [rightOpacity, setRightOpacity] = useState(0);
    const [leftOpacity, setLeftOpacity] = useState(1);
    const [tipsList, setTipsList] = useState([
        "Did you know that Math is fun.", 
        "Music, Art and Science are the building blocks of life."]
    );

    useEffect(()=>{
        fetchTipsList();
        if (usedForm == 'signup'){
            setLeftOpacity(1);
            setRightOpacity(0);
        }
        else{
            setRightOpacity(1);
            setLeftOpacity(0);
        }
    }, [usedForm]);

    const fetchTipsList = async()=>{
        await fetch(backEnd)
        .then(res=>res.status == 200?res.json():(()=>{throw Error("Error fetching tips list")}))
        .then(list=>setTipsList(list));
    }
    return (
        <Container>
            <FormWrapper>
                <LeftWelcomeText leftOpacity={leftOpacity} tipsList={tipsList}/>
                <Form usedForm={usedForm} setUsedForm={setUsedForm} backEnd={backEnd}/>
                <RightWelcomeText style={{transform:"translateX(50rem)"}} tipsList={tipsList} rightOpacity={rightOpacity}/>
            </FormWrapper>
        
        </Container>);
}

const GetATip = ({tipsList})=>{
    
    let randomIndex = getRandomInt(0, tipsList.length-1)
    return <h4 style={{fontWeight:"normal", fontFamily: "Arial, Helvetica, sans-serif"}}>{tipsList[randomIndex]}</h4>
}
const LeftWelcomeText = ({leftOpacity, tipsList})=>{
    return(
        <LeftText leftOpacity={leftOpacity}>
            {leftOpacity==0?<GetATip tipsList={tipsList}/>:<GetATip tipsList={tipsList}/>}
        </LeftText>
    )
}

const RightWelcomeText = ({rightOpacity, tipsList})=>{
    return(
        <RightText rightOpacity = {rightOpacity}>            
            {rightOpacity==0?<GetATip tipsList={tipsList}/>:<GetATip tipsList={tipsList}/>}
        </RightText>
    )
}
export default RegisterPage;

const Container = styled.div`
    height: 100dvh;
    background-image: url(${backgroundImage}); 
    background-size: cover;  
    background-repeat: no-repeat; 
    background-position: center; 
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const FormWrapper = styled.div`
    width: 50rem;
    height: fit-content;
    border: 1px solid black;
    display: flex;
    align-items: end;
    overflow: hidden;
    transition: height 1s ease-in-out;
    background-color: #01060a44;
    
`;

const LeftText = styled.div`
    opacity: ${({leftOpacity})=>leftOpacity};
    z-index: 0;
    padding: 1rem;
    height: 100%;
    max-width: 23rem;
    min-width: 23rem;
    align-content: end;
    word-wrap: break-word;
    color: white; 
    font-family: Arial, Helvetica, sans-serif;
    animation: ${pop} 1s ease-in-out;
    transition: opacity 0.5s ease-in-out;
`;

const RightText = styled.div`
    z-index: 0;
    opacity: ${({rightOpacity})=>rightOpacity};
    padding: 1rem;
    height: 100%;
    max-width: 23rem;
    min-width: 23rem;
    align-content: end;
    word-wrap: break-word;
    color: white; 
    font-family: Arial, Helvetica, sans-serif;
    transform: translateX(-25rem);
    animation: ${pop} 1s ease-in-out;
    transition: opacity 0.5s ease-in-out;

`;