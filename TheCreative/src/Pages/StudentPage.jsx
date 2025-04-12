import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import addToWalletIcon from "../assets/addToWalletIcon.png";
import deleteIcon from "../assets/deleteIcon.png";
import goBackIcon from "../assets/goBackIcon.png";
import noContent from "../assets/emptyDashboard.svg";
import Modal from "react-modal";

const StudentPage = ()=>{
    const { id } = useParams();
    const location = useLocation();
    const {backend, theme} = location.state || {};
    const [editedAlert, setEditedAlert] = useState(0);
    const [user, setUser] = useState({dashboard: []});
    const [walletEditAmount, setWalletEditAmount] = useState(NaN);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        getStudent();
    }, [editedAlert]);

    const notifySuccess = (mssg)=>{
        toast.success(mssg);
    }

    const notifyError = (mssg)=>{
        toast.error(mssg);
    }

    const getStudent = async()=>{
        console.log(backend)
        await fetch(`${backend}/student?id=${id}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Couldn't fetch user");
        })
        .then(data=>{
            setUser(data);
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Could't fetch user");
        })
    }

    const editWallet = async(e)=>{
        e.preventDefault();
        await fetch(`${backend}/edit/wallet`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({username: user.username, amount: walletEditAmount})
        })
        .then((result)=>{
            if (result.status == 200){
                setEditedAlert(prev=>prev+1);
                notifySuccess("User's Wallet edited Successfuly");
                setIsEditing(false);
            }
            else throw Error("Couldn't edit user's wallet");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Could't edit user's wallet");
        })
    }

    const deleteAccount = async()=>{
        await fetch(`${backend}/delete/user/account`, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({username: user.username})
        })
        .then((result)=>{
            if (result.status == 200){
                notifySuccess("Account deleted Successfuly");
                setIsDeleting(false);
                navigate(-1);
            }
            else throw Error("Couldn't delete account");
        })
        .catch((error)=>{
            console.log(error);
            notifyError("Could't delete account");
        })
    }

    const timeStampToDate = (timeStamp)=>{
        const ts = new Date(timeStamp);
        return ts.toLocaleDateString();
    }

    return(
        <Container theme={theme}>
            <Content>
                <p style={{fontWeight:"bold"}}>Username: {user.username}</p>
                <p>Grade: {user.grade}</p>
                <p>City: {user.city}</p>
                <p>Student Phone: {user.studentPhone}</p>
                <p>Parent Phone: {user.parentPhone}</p>
                <p>Wallet: {user.cash}</p>
                <p style={{fontSize:"1.5rem", fontWeight:"bolder"}}>Dashboard</p>
                <DashboardWrapper theme={theme}>
                {user.dashboard.length>0?
                    <TableContainer theme={theme}>
                        <StyledTable>
                            <thead>
                            <tr>
                                <th>Lecture</th>
                                <th>Unit</th>
                                <th>Field</th>
                                <th>Grade</th>
                                <th>Term</th>
                                <th>Date</th>
                                <th>Mark</th>
                            </tr>
                            </thead>
                            <tbody>
                            {user.dashboard.map((item, index) => (
                                <tr key={index}>
                                <td>{item.number}</td>
                                <td>{item.unit}</td>
                                <td>{item.field}</td>
                                <td>{item.grade}</td>
                                <td>{item.term}</td>
                                <td>{timeStampToDate(item.date)}</td>
                                <td>{item.mark}</td>
                                </tr>
                            ))}
                            </tbody>
                        </StyledTable>
                    </TableContainer>
            :   <>
                    <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
                    <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif', textAlign: 'center'}}>NO DATA</h2>
                </>}
            </DashboardWrapper>
            </Content>
            <Controller theme={theme}>
                <Button onClick={()=>setIsEditing(true)}><img src={addToWalletIcon}alt=""/></Button>
                <Button onClick={()=>setIsDeleting(true)}><img src={deleteIcon}alt=""/></Button>
                <Button onClick={()=>navigate(-1)}><img src={goBackIcon}alt=""/></Button>
            </Controller>
            <Modal
                isOpen={isEditing}
                onRequestClose={()=>setIsEditing(false)}
                style={editWalletFormStyle}
            >              
                <FormButton onClick={()=>setIsEditing(false)} style={{alignSelf:"end"}} theme={theme}>X</FormButton>
                <p style={{fontSize:"larg"}}>Enter the amount of money you want to charge/discharge the wallet of {user.username} with</p>
                <form onSubmit={editWallet} style={{width: "100%", display: "flex", justifyContent:"center"}}>
                    <input type="number" placeholder="Enter the amount " style={{borderRadius:"20px", padding: "1rem"}} value={walletEditAmount} onChange={(tag)=>setWalletEditAmount(tag.target.value)} required/>
                    <FormButton type="submit" style={{justifySelf:"center"}} theme={theme}>Add</FormButton>
                </form>
            </Modal>
            <Modal
                isOpen={isDeleting}
                onRequestClose={()=>setIsDeleting(false)}
                style={editWalletFormStyle}
            >              
                <FormButton onClick={()=>setIsDeleting(false)} style={{alignSelf:"end"}} theme={theme}>X</FormButton>
                <p style={{fontSize:"larg"}}>You are about to delete the account of {user.username}, are you sure?</p>
                    <FormButton onClick={deleteAccount} style={{justifySelf:"center"}} theme={theme}>Delete</FormButton>
            </Modal>
        </Container>
    )
};

export default StudentPage;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background-image: ${({theme})=>theme=="light"?"linear-gradient(159deg, rgba(0,71,171,1) 0%, rgba(28,169,201,1) 100%)":"radial-gradient(circle, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)"};
    color: white;
    font-family: 'Trebuchet MS', sans-serif;  
`;

const Content = styled.div`
    height: 100%;
    overflow: scroll;
    padding: 1rem;
    font-size: large;
    display: flex;
    flex-direction: column;
    justify-content: start;
    flex-grow: 1;

`;

const Controller = styled.div`
    width: fit-content;
    height: 100%;
    align-self: end;
    
    background-color: ${({theme})=>theme=="light"?"#2882d0":"black"};

`;

const Button = styled.div`
    background-color: transparent;
    width: 100%;
    border: none;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover{
        scale: 1.1;
    }
`;



const DashboardWrapper = styled.div`
    overflow: scroll;
    width: 82%;
    height: 100%;
    border-radius: 25px;
    background-color: ${({theme})=>theme=="light"?"#0e59c268":"#18181870"};
    transition: background-color 0.5s;
    padding: 1rem;
    
`;



const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  color: white;
`;

const StyledTable = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f27c;
  }

  tr:hover {
    background-color: #ddd;
    color: black;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
  }
`;

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