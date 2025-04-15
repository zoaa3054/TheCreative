import styled from "styled-components";
import noDataFound from "../assets/noDataFound.svg";
import ascSortIcon from "../assets/ascSortIcon.png";
import descSortIcon from "../assets/descSortIcon.png";
import deleteIcon from "../assets/deleteIcon.png";
import addIcon from "../assets/addIcon.png";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Loader from "./Loader";
import Spinner from "./Spinner";

const Admins = ( { backend, theme, isSideBarOpen } )=>{
    const [sortDirection, setSortDirection] = useState(1);
    const [admins, setAdmins] = useState([]);
    const [viewedAdmins, setViewedAdmins] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingAdmin, setIsAddingAdmin] = useState(false);
    const [adminAboutToBeDeleted, setAdminAboutToBeDeleted] = useState({});
    const [formVariables, setFormVariables] = useState({});
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
   
    const notifyError = (mssg) =>{
        toast.error(mssg);
    }

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }
    
    useEffect(()=>{
        setIsLoading(true);
        getAllAdmins();
        
    }, [sortDirection, isDeleting, isAddingAdmin]);

    const getAllAdmins = async()=>{

        await fetch(`${backend}/admins?sortDirection=${sortDirection}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching admins!"); 
        })
        .then((data)=>{
            setAdmins(data);
            setViewedAdmins(data);
        })
        .catch(error=>{
            notifyError("There something wrong with the system please logout and login again.")
            console.log(error);
        });
        setIsLoading(false);

    }

    const deleteAdmin = async()=>{
        setIsUploading(true);
        await fetch(`${backend}/delete/admin/account`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({username: adminAboutToBeDeleted.username})
        })
        .then((result)=>{
            if (result.status == 200){
                notifySuccess("Account deleted Successfuly");
                setIsDeleting(false);
            }
            else throw Error("Couldn't delete account");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Could't delete account");
        })
        setIsUploading(false);
    }

    const addAdmin = async()=>{
        setIsUploading(true);
        if (checkInputVariables()){
            await fetch(`${backend}/add/admin`, {
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
                },
                body: JSON.stringify(formVariables)
            })
            .then((res)=>{
                if (res.status == 201){
                    notifySuccess("Account added successfuly");
                    setIsAddingAdmin(false);
                } 
                else if (res.status == 409) notifyError("Admin already exists");
                else notifyError("Something went wrong, Please contact the system's developer")
                return res.json();
            })
            .catch((error)=>console.log(error));
        }
        setIsUploading(false);
    }

    const checkInputVariables = ()=>{
        setError({});
        
        let allFine = true;
        let errorText = '';

        for (let index in Object.keys(formVariables)){
            let name = Object.keys(formVariables)[index];
            if(name == 'password' && formVariables[name].length<8){
                errorText = "Password must be at least 8 characters";
                setError({...error, [name]:errorText});
                notifyError(errorText);
                allFine = false;
            }
            else if(name == 'username' && !/^[^A-Z\s]+$/.test(formVariables[name])){
                errorText = "Username can not contain CAPITAL letters or spaces."
                setError({...error, [name]:errorText});
                notifyError(errorText);
                allFine = false;
            }
        }
        return allFine;
    }

    const changeSortDirection = ()=>{
        if (sortDirection == 1) setSortDirection(-1);
        else setSortDirection(1);
    }

    const timeStampToDate = (timeStamp)=>{
        const ts = new Date(timeStamp);
        return ts.toLocaleString();
    }

    const checkModernity = (timeStamp)=>{
        const currentTimeStamp = Date.now();
        
        return currentTimeStamp - timeStamp <= 604800000;
    }


    const search = (e)=>{
        const searchKey = e.target.value;
        let adminsToBeShowen = [];
        admins.forEach((admin)=>{
            if(admin.username.includes(searchKey)) adminsToBeShowen.push(admin);
        })
        setViewedAdmins(adminsToBeShowen);
    }

    const handleDeleting = (admin)=>{
        setIsDeleting(true);
        setAdminAboutToBeDeleted(admin);
    }

    const changeFormVariable = (variable)=>{
        const name = variable.target.name;
        const value = variable.target.value;

        setFormVariables({...formVariables, [name]: value});
    }

    return(
        <Container>
            <ControlBar isSideBarOpen={isSideBarOpen}>
                <FilterControl>
                    <SearchBar theme={theme} type="text" placeholder="Search" onChange={search}/>
                </FilterControl>
                <SortControl>
                    <Button 
                        title="sorting direction" 
                        src={sortDirection==1?ascSortIcon:descSortIcon}
                        onClick={changeSortDirection}
                    />
                    <Button 
                    title="add admin" 
                    src={addIcon}
                    onClick={()=>setIsAddingAdmin(true)}
                    />
                </SortControl>
            </ControlBar>
            
            {isLoading?
            <Loader/>:admins.length>0 && 
            <TableWrapper>
                <StyledTable theme={theme}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>date</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {viewedAdmins.map((item, index) => (
                        <tr key={index}>
                        <td><NewLabel isNew={checkModernity(item.date)} style={{color: item.disabled&&"green"}}>{item.username}</NewLabel></td>
                        <td>{timeStampToDate(item.date)}</td>
                        <td style={{backgroundColor:item.disabled?"":"#DC143C", textAlign:"center"}}>                
                            <Button 
                            title="delete account"
                            style={{display:item.disabled&&"none"}}
                            src={deleteIcon}
                            onClick={()=>handleDeleting(item)}
                            />
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableWrapper>
            }
            {admins.length==0 && !isLoading &&<img src={noDataFound} alt="" style={{width:"50%", height:"80%"}}/>}
            <Modal
                isOpen={isDeleting}
                onRequestClose={()=>setIsDeleting(false)}
                style={editWalletFormStyle}
            >              
                <FormButton onClick={()=>setIsDeleting(false)} disabled={isUploading} style={{alignSelf:"end"}} theme={theme}>X</FormButton>
                <p style={{fontSize:"larg"}}>You are about to delete the account of {adminAboutToBeDeleted.username}, are you sure?</p>
                <FormButton onClick={deleteAdmin} disabled={isUploading} style={{justifySelf:"center"}} theme={theme}>
                    {isUploading?<Spinner size={15}/>:"Delete"}    
                </FormButton>
            </Modal>
            <Modal
                isOpen={isAddingAdmin}
                onRequestClose={()=>setIsAddingAdmin(false)}
                style={editWalletFormStyle}
            >              
                <FormButton onClick={()=>setIsAddingAdmin(false)} disabled={isUploading} style={{alignSelf:"end"}} theme={theme}>X</FormButton>
                <p style={{fontSize:"1.5rem"}}>Add Admin</p>
                
                <label style={{marginTop:"1rem", marginBottom:"1rem",fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="username">USERNAME</label>
                <input style={{backgroundColor:"#a4a4a46a", border: error['username']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="text" value={formVariables.username} onChange={changeFormVariable} name="username" placeholder="Username" required/>
                
                <label style={{marginTop:"1rem", marginBottom:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="password">PASSWORD</label>
                <input style={{backgroundColor:"#a4a4a46a", marginBottom:"1rem", border: error['password']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="password" minLength='8' value={formVariables.password} onChange={changeFormVariable} name="password" placeholder="Password" required/>
                <FormButton onClick={addAdmin} disabled={isUploading} style={{justifySelf:"center"}} theme={theme}>
                    {isUploading?<Spinner size={15}/>:"Add"}    
                </FormButton>
            </Modal>
        </Container>
    );
};

export default Admins;

const Container = styled.div`
    width: 98%;
    height: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
`;


const ControlBar = styled.div`
    border-radius: 1rem;
    display: flex;
    width: 98%;
    height: 10%;
    justify-content: start;
    background-color: #acacac99;
    ${({isSideBarOpen})=>isSideBarOpen&&window.innerWidth<400?"opacity: 0;":"opacity: 1;"}
    transition: opacity 0.5s;
`;


const Select = styled.select`
    border-radius: 25px;
    border: 1px solid black;
    padding: 10px;
    margin: 1rem;
    background-color: transparent;
    color: black;
    cursor: pointer;

    @media (max-width: 400px){
        width: 3.5rem;
        margin: 0.2rem;
    }
`;



const FilterControl = styled.div`
    padding-left: 1rem;
    width: 100%;
    display: flex;
    justify-content: start;
`;

const SortControl = styled.div`
    width: 50%;
    display: flex;
    justify-content: end;
    align-items: center;
`;

const Button = styled.img`
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    margin-right: 1rem;
    &:hover{
        scale: 1.2;
    }
`;

const NewLabel = styled.span`
    &::after{
        ${({isNew})=>isNew&&`content: "NEW"`};
        ${({isNew})=>isNew&&`color: white`};
        ${({isNew})=>isNew&&`background-color: gold`};
        ${({isNew})=>isNew&&`margin-left: 0.5rem`};
        ${({isNew})=>isNew&&`padding: 0.5rem`};
        ${({isNew})=>isNew&&`border-radius: 20px`};
    }
`;


const SearchBar = styled.input`
    border-radius: 25px;
    border: 1px solid black;
    padding: 10px;
    margin: 1rem;
    background-color: transparent;
    color: black;
    width: 100%;
`;

const TableWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: scroll;
`

const editWalletFormStyle = {
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

const StyledTable = styled.table`
    width: 98%;
    height: 100%;
    margin-top: 1rem;
    border-radius: 25px;
    /* background-image: ${({theme})=>theme=="light"?"linear-gradient(159deg, rgba(0,71,171,1) 0%, rgba(28,169,201,1) 100%)":"radial-gradient(circle, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)"}; */
    transition: background-image 0.5s;
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: separate;
    border-spacing: 0 1rem;

  tr{
    border-bottom: 1px solid #4f51533b;
    border-radius: 25px;
  }

  th, td {
    padding: 8px;
    border: none; /* Removed border */
    cursor: pointer;
    padding-left: 1rem;
    max-height: 1rem;
    /* overflow: hidden; */
  }

  th{
    background-color: transparent;
  }

  td{
    background-color: #f2f2f2;
  }

  tbody tr:hover {
    background-color: #ddd;
    scale: 1.01;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    /* background-color: #04AA6D; */
    color: ${({theme})=>theme=='light'?"black": "white"};
  }

  tr td:first-child {
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  tr td:last-child {
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
`;

const FormButton = styled.button`
    background-color: ${({theme})=>theme=='light'?"rgba(0,71,171,1)":"rgba(28,169,201,1)"};
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