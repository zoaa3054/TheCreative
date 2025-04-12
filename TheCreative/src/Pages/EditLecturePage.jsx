import styled from "styled-components";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

const EditLecturePage = () =>{
    const location = useLocation();
    const { backend, theme } = location.state || {};
    const { id } = useParams();
    const [formVariables, setFormVariables] = useState({});
    const [explainVideoSize, setExplainVideoSize] = useState(0);
    const [HWVideoSize, setHWVideoSize] = useState(0);
    const [examSize, setExamSize] = useState(0);
    const [explainationError, setExplainationError] = useState(null);
    const [HWError, setHWError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reload, setReload] = useState(0);
    const [isRevision, setIsRevision] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        fetchLecture();
    },[]);
    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }

    const notifyError = (mssg) =>{
        toast.error(mssg);
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
            setFormVariables(data);
            if(data.unit==0) setIsRevision(true);
        })
        .catch(error=>console.log(error));
    }

    const editLecture = async(e)=>{
        e.preventDefault();
        if (explainationError){
            notifyError("Please resolve the error in the explaination video link");
            return;
        }
        if (HWError){
            notifyError("Please resolve the error in the hw video link");
            return;
        }
        await fetch(`${backend}/edit/lecture`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({
                ...formVariables,
                size: explainVideoSize + HWVideoSize + examSize
            })
        })
        .then((result)=>{
            if(result.status == 200) {
                notifySuccess("Lecture edited successfuly!");
                navigate(-1);
            }
            
            else throw Error ("Couldn't edit Lecture");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Something went wrong, couldn't edit lecture");
        })
    }

    const deleteLecture = async()=>{
        await fetch(`${backend}/delete/lecture`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({
                _id: id
            })
        })
        .then((result)=>{
            if(result.status == 200) {
                notifySuccess("Lecture deleted successfuly!");
                navigate(-1);
            }
            
            else throw Error ("Couldn't delete Lecture");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Something went wrong, couldn't delete lecture");
        })
    }

    const addExplainVideoSize = (entry)=>{
        setExplainVideoSize(entry.target.getDuration());
    }

    const addHWVideoSize = (entry)=>{
        setHWVideoSize(entry.target.getDuration());
    }

    const extractYouTubeID = (type) => {
        let url;
        if (type == "explain" && formVariables.explainationLink) url = formVariables.explainationLink;
        else if (type == "hw" && formVariables.hwLink) url = formVariables.hwLink;
        else return null;

        const regex =
          /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        if (match) return match[1];
        else if (type=='explain'){
            setExplainationError("Link is not valid");
            return null;
        }
        else if (type=='hw'){
            setHWError("Link is not valid");
            return null;
        }
      };

    const handleChange = (entry)=>{
        setReload(prev=>prev+1);
        setExplainationError(null);
        setHWError(null);
        let name = entry.target.name;
        let value = entry.target.value;
        if (name == "unit") value = parseInt(value);
        if (name == "number") value = parseInt(value);
        if (name == "cost") value = parseInt(value);
        setFormVariables({...formVariables, [name]: value});
    }

    return(
        <Container theme={theme} onSubmit={editLecture}>
            <div>
            <label htmlFor="grade">Grade:</label>
            <select name="grade" value={formVariables.grade?formVariables.grade:""} onChange={handleChange} required>
                <option value="" disabled>Choose grade</option>
                <option value="M3">Middle 3</option>
                <option value="S1">Senior 1</option>
                <option value="S2">Senior 2</option>
            </select>
            </div>

            <div>
            <label htmlFor="term">Term:</label>
            <select name="term" value={formVariables.term?formVariables.term:""} onChange={handleChange} required>
                <option value="" disabled>Choose term</option>
                <option value="T1">Term 1</option>
                <option value="T2">Term 2</option>
            </select>
            </div>

            <div>
            <label htmlFor="field">Field:</label>
            <select name="field" value={formVariables.field?formVariables.field:""} onChange={handleChange} required>
                <option value="" disabled>Choose field</option>
                <option value="Algebra">Algebra</option>
                <option value="Geometry">Geometry</option>
                <option value="Trigonometry">Trigonometry</option>
            </select>
            </div>

            <div>
                <label htmlFor="isRevision">Final Revision</label>
                <input type="checkbox" value={isRevision} onChange={()=>
                    setIsRevision((prev)=>{
                        prev = !prev;
                        if(prev) setFormVariables({...formVariables, ['unit']: 0});
                        return prev;
                    })
                } checked={isRevision}/>
            </div>

            <div>
            <label htmlFor="unit">Unit:</label>
            <input type="number" disabled={isRevision} name="unit" min="1" placeholder="Enter unit" value={formVariables.unit?formVariables.unit:""} onChange={handleChange} required/>
            </div>

            <div>
            <label htmlFor="number">Lecture #:</label>
            <input type="number" name="number" min="1" placeholder="Enter lecture #" value={formVariables.number?formVariables.number:""} onChange={handleChange} required/>
            </div>

            <div>
            <label htmlFor="explainationLink">Explaination video link:</label>
            <input type="text" name="explainationLink" placeholder="Enter explaination video link" value={formVariables.explainationLink?formVariables.explainationLink:""} onChange={handleChange} required/>
            </div>

            <Preveiw>
                {!explainationError && formVariables.explainationLink? (
                    <YouTube key={reload} videoId={extractYouTubeID("explain")} onReady={addExplainVideoSize} opts={videoOptions}/>
                ) : (
                    <p style={{ color: "red" }}>{explainationError}</p>
                )}
            </Preveiw>

            <div>
            <label htmlFor="explainDescribtion">Explaination video description:</label>
            <input type="text" name="explainDescribtion" placeholder="Enter explaination video description" value={formVariables.explainDescribtion?formVariables.explainDescribtion:""} onChange={handleChange} />
            </div>

            <div>
            <label htmlFor="hwLink">HW video link:</label>
            <input type="text" name="hwLink" placeholder="Enter HW video link" value={formVariables.hwLink?formVariables.hwLink:""} onChange={handleChange}/>
            </div>

            <Preveiw>
                {!HWError && formVariables.hwLink? (
                    <YouTube key={reload} videoId={extractYouTubeID("hw")} onReady={addHWVideoSize} opts={videoOptions}/>
                ) : (
                    <p style={{ color: "red" }}>{HWError}</p>
                )}
            </Preveiw>

            <div>
            <label htmlFor="hwDescribtion">HW video  description:</label>
            <input type="text" name="hwDescribtion" placeholder="Enter HW video description" value={formVariables.hwDescribtion?formVariables.hwDescribtion:""} onChange={handleChange}/>
            </div>

            <div>
            <label htmlFor="hw">HW:</label>
            <input type="text" name="hw" placeholder="Enter HW" value={formVariables.hw?formVariables.hw:""} onChange={handleChange}/>
            </div>

            {/* Add an exam */}

            <div>
            <label htmlFor="cost">Cost:</label>
            <input type="number" name="cost" min="0" placeholder="Enter cost" value={formVariables.cost?formVariables.cost:""} onChange={handleChange} required/>
            </div>

            <div>
                <Button type="submit">Submit</Button>
                <Button onClick={(e)=>{
                    setIsDeleting(true);
                    e.preventDefault();
                }}>Delete</Button>
            </div>

            <Modal
                isOpen={isDeleting}
                onRequestClose={()=>setIsDeleting(false)}
                style={deleteConfermationStyle}
            >              
                <FormButton onClick={()=>setIsDeleting(false)} style={{alignSelf:"end"}} theme={theme}>X</FormButton>
                <p style={{fontSize:"larg"}}>You are about to delete the lecture, are you sure?</p>
                <FormButton onClick={deleteLecture} style={{justifySelf:"center"}} theme={theme}>Delete</FormButton>
            </Modal>
        </Container>
    );
}

export default EditLecturePage;

const Container = styled.form`
    height: 100vh;
    /* width: 100%; */
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    color: ${({theme})=>theme=='light'?"black":"white"};
    background-color: ${({theme})=>theme=='light'?"whitesmoke":"#181818"};
    overflow: scroll;

    div{
        display: grid;
        grid-template-columns: 1fr 1fr;
        
        input, select{
           padding: 1rem;
        }

        select{
            cursor: pointer;
        }

        &:nth-child(4){
            display: flex;
        }
            
    }
    
`;

const Button = styled.button`
    border: none;
    padding: 1rem;
    margin: 0.5rem;
    cursor: pointer;
    background-color: ${({theme})=>theme=='light'?"rgba(0,71,171,1)":"white"};
    color: ${({theme})=>theme=='light'?"white":"black"};

    &:hover{
        background-color: ${({theme})=>theme=='light'?"#00ab7b":"black"};
        color: white;
        
    }
        
`;


const Preveiw = styled.div`
    width: 100%;
    align-self: center;
`;


const deleteConfermationStyle = {
    content:{
        justifySelf:"center",
        alignSelf:"center",
        width: "fit-content",
        height: "fit-content",
        display: "flex", 
        flexDirection: "column",
        borderRadius: "25px",
        fontFamily: "Trebuchet MS, sans-serif"

    }
}

const FormButton = styled.button`
    background-color: ${({theme})=>theme=='light'?"rgba(0,71,171,1)":"black"};
    border-radius: 25px;
    padding: 1rem;
    color: white;
    border: 1px solid transparent;
    justify-self: center;
    margin-left: 1rem;
    cursor: pointer;

    &:hover{
        background-color: white;
        color: black;
        border: 1px solid black;
    }
`

const videoOptions = {
    width: window.innerWidth<=500?"360rem":"500rem",
    height: "250rem"
  };