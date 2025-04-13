import styled from "styled-components";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { useState } from "react";

const AddLecture = ({backend, theme}) =>{
    const [formVariables, setFormVariables] = useState({});
    const [explainVideoSize, setExplainVideoSize] = useState(0);
    const [HWVideoSize, setHWVideoSize] = useState(0);
    const [examSize, setExamSize] = useState(0);
    const [explainationError, setExplainationError] = useState(null);
    const [HWError, setHWError] = useState(null);
    const [reload, setReload] = useState(0);
    const [isRevision, setIsRevision] = useState(false);

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }

    const notifyError = (mssg) =>{
        toast.error(mssg);
    }


    const addLecture = async(e)=>{
        e.preventDefault();
        if (explainationError){
            notifyError("Please resolve the error in the explaination video link");
            return;
        }
        if (HWError){
            notifyError("Please resolve the error in the hw video link");
            return;
        }
        await fetch(`${backend}/add/lecture`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({
                ...formVariables,
                date: Date.now(),
                size: explainVideoSize + HWVideoSize + examSize
            })
        })
        .then((result)=>{
            if(result.status == 201) {
                notifySuccess("Lecture added successfuly!");
                setFormVariables({});
            }
            else if(result.status == 409) {
                notifyError("Lecture already exists");
            }
            else throw Error ("Couldn't add Lecture");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Something went wrong, couldn't add lecture, please logout then login again");
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
        <Container theme={theme} onSubmit={addLecture}>
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
                }/>
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
            <input type="number" name="cost" min="0" step="1" placeholder="Enter cost" value={formVariables.cost == undefined || formVariables.cost == null?"":formVariables.cost} onChange={handleChange} required/>
            </div>

            {/* <div> */}
                <Button type="submit">Submit</Button>
            {/* </div> */}
        </Container>
    );
}

export default AddLecture;

const Container = styled.form`
    width: 98%;
    height: 100%;
    padding: 1rem;
    margin-left: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    color: ${({theme})=>theme=='light'?"black":"white"};
    overflow-y: scroll;
    overflow-x: hidden;
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

        &:nth-child(8){
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &:nth-child(11){
            display: flex;
            justify-content: center;
            align-items: center;
        }
            
    }
    /* transform: translateY(-10%); */
    
`;

const Button = styled.button`
    width: 100%;
    border: none;
    padding: 1rem;
    cursor: pointer;
    background-color: ${({theme})=>theme=='light'?"rgba(0,71,171,1)":"white"};
    color: ${({theme})=>theme=='light'?"white":"black"};
    /* margin-bottom: 50px; */

    &:hover{
        background-color: ${({theme})=>theme=='light'?"#00ab7b":"black"};
        color: white;
        
    }
        
`;


const Preveiw = styled.div`
    /* width: 100%; */
    /* align-self: center; */
    /* padding: 1rem; */
    width: fit-content;
`;

const videoOptions = {
    width: window.innerWidth<=500?"300rem":"500rem",
    height: "250rem"
  };