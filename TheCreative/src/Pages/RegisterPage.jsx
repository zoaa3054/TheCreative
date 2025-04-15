
import styled, { keyframes } from "styled-components";
import { useEffect, useState, useRef } from "react";
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


const RegisterPage = ({ backend })=>{
    const locate = useLocation();
    const { desiredForm } = locate.state || {};
    const [usedForm, setUsedForm] = useState(desiredForm);
    const videoRef = useRef();
    
    useEffect(()=>{
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.25;
        }
    }, [])
  
    return (
        <Form usedForm={usedForm} setUsedForm={setUsedForm} backend={backend}/>

    );
}

export default RegisterPage;

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: end;

    @media (max-width: 500px) {
        align-items: center;
        justify-content: center;
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
