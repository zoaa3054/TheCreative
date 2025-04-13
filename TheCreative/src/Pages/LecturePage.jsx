import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Map from "../Components/Map";
import Video from "../Components/Video";
import NoDataPage from "./NoDataPage";
import noContent from "../assets/noContent.svg";
import Card from "../Components/Card";
import { toast } from "react-toastify";

const LecturePage = ()=>{
    const location = useLocation();
    const { id } = useParams();
    const { backend, theme, isAdmin } = location.state || {};
    const [lecture, setLecture] = useState({});
    const [stage, setStage] = useState(1);
    const [isControllerOpen, setIsControllerOpen] = useState(true);
    const [backgroundImage, setBackgroundImage] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        fetchLecture();
        getBackgroundImage();
    }, []);

    const notifySuccess = (mssg)=>{
        toast.success(mssg);
    }

    const fetchLecture = async()=>{
        await fetch(`${backend}/lecture?id=${id}`, {
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else if (result.status == 404) throw Error("Lecture not found");
            else throw Error("Couldn't fetch lecture");
        })
        .then(data=>{
            setLecture(data);
            console.log(data);
        })
        .catch(error=>console.log(error));
    }

    const getBackgroundImage = async()=>{
        fetch(`${backend}/user/backgroundImage`, {
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        }) // API that returns raw image data
        .then((result) => {
            if (result.status == 200) return result.json();
            else throw Error("Couldn't fetch background image");
        }) 
        .then((data) => {
            setBackgroundImage(data.backgroundImage);
        })
        .catch((error) => console.error("Error fetching image:", error));
    }

    const incrementStage = ()=>{
        setStage((prev)=>prev+1);
    }

    const decrementStage = ()=>{
        setStage((prev)=>prev-1);
    }

    const submit = () =>{
        // to do
        notifySuccess("Lecture Submited Successfuly");
        navigate('/home');
    }

    return(
        <Container backgroundImage={backgroundImage}>
        {Object.keys(lecture).length!= 0?<>
            <Content theme={theme} backgroundImage={backgroundImage}>
                {stage==1&&
                <>
                    {!lecture.examId?
                        <>
                            <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
                            <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>ENJOY, NO EXAM TODAY </h2>
                        </>
                    :   <>
                            <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>Exam</h2>
                            {/* Exam component goes here */}
                        </>
                    }
                </>}
                {stage==2&&
                <>
                    <Video link={lecture.hwLink?lecture.hwLink:""}/>
                    <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>{lecture.hwDescribtion?"Description":""}</h2>
                    <p style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>{lecture.hwDescribtion}</p>
                </>}

                {stage==3&&
                <>
                    <Video link={lecture.explainationLink}/>
                    <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>{lecture.explainDescribtion?"Description":""}</h2>
                    <p style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>{lecture.explainDescribtion}</p>
                </>}
                {stage==4&&
                <>
                    {!lecture.hw?
                        <>
                            <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
                            <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif'}}>ENJOY, NO HW TODAY </h2>
                        </>   
                    :   <Card title="Homework" description={lecture.hw} variant="card1" onClickFunction={()=>{}}/>
                    }
                </>}
            </Content>
            <Controller isOpen={isControllerOpen} theme={theme}>
                <BackButton theme={theme} onClick={()=>setIsControllerOpen(prev=>!prev)}>...</BackButton>
                <div>
                    <Map stage={stage}/>
                    <Buttons>
                        <Button onClick={decrementStage} disabled={stage==1}>Back</Button>
                        <Button onClick={incrementStage} disabled={stage==4}>Next</Button>
                        <Button onClick={submit} style={{opacity:stage==4?"1":"0", display:isAdmin&&"none"}}>Submit</Button>
                    </Buttons>
                </div>
            </Controller></>
            :
            <NoDataPage/>
            }
        </Container>        
    );
};

export default LecturePage;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
    height: 100vh;
    background-color: ${({theme})=>theme=='whitesmoke'?"":"#181818"};
    
`;

const Content = styled.div`
    padding: 1rem;
    width: ${({isOpen})=>{
        if (isOpen && window.innerWidth<=500) return "5%";
        if (isOpen && window.innerWidth<=890) return "60%";
        if (isOpen) return "80%";
        if (!isOpen && window.innerWidth<=500) return "95%";
        else return "99%";
    }};
    height: 100%;
    overflow-y: scroll;
    ${({backgroundImage})=>!backgroundImage&&`background-color: ${({theme})=>theme=='light'?'white':'#181818'}`};
    
`;

const Controller = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    width: ${({isOpen})=>{
        if (isOpen && window.innerWidth<=500) return "95%";
        if (isOpen && window.innerWidth<=890) return "40%";
        if (isOpen) return "20%";
        if (!isOpen && window.innerWidth<=500) return "5%";
        else return "1%";
    }};
    height: 100%;
    overflow: hidden;
    cursor: pointer;
    background-color: ${({theme})=>theme=='light'?'aliceblue':'#3d3d3d'};
    color: ${({theme})=>theme=='light'?'black':'white'};
    transition:  width 0.5s;
`;


const Buttons = styled.div`

`;

const BackButton = styled.button`
    width: fit-content;
    padding: 0;
    margin: 0;
    height: 100%;
    background-color: transparent;
    cursor: pointer;
    border: none;
    writing-mode: vertical-rl; /* Text goes from top to bottom (right to left) */
    text-orientation: upright;
    font-size: large;
    font-weight: bold;
    color: ${({theme})=>theme=='light'?"black":"white"};

    &:hover{
        background-color: #6fb8f813;
    }
`

const Button = styled.button`
    padding: 1rem;
    border-radius: 25px;
    margin: 0.5rem;
    cursor: pointer;

    &:hover{
        scale: 1.1;
    }
`;