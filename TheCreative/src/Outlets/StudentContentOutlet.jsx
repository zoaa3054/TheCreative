import styled from "styled-components";
import Courses from "../Components/Courses";
import Dashboard from "../Components/Dashboard";
import Card from "../Components/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Profile from "../Components/Profile";

const StudentContentOutlet = ({ backend, theme, selectedComponent, isSideBarOpen, setBuyingAlert})=>{
    const [wallet, setWallet] = useState(-1);
    const [paymentNumber, setPaymentNumber] = useState("+201205912251");
    const [settingsChange, setSettingsChange] = useState(0);

    useEffect(()=>{
        getWallet();
        getPaymentNumber();
    }, [settingsChange]);

    const notifyError = (mssg)=>{
        toast.error(mssg);
    }

    const getWallet = async()=>{
        await fetch(`${backend}/user/wallet`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>setWallet(data.cash))
        .catch((error)=>{
            console.log(error);
            notifyError("Something went wrong with the system please logout and login again!");
        })
    }

    const getPaymentNumber = async()=>{
        await fetch(`${backend}/paymentNumber`,{
            method:"GET",
            headers:{
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('theCreativeAuthToken')}`
            }
        })
        .then((result)=>{
            if(result.status==200) return result.json();
            else throw Error("Something went wrong");
        })
        .then(data=>setPaymentNumber(data.paymentNumber))
        .catch((error)=>{
            console.log(error);
        })
    }

    const messageWhatsapp = ()=>{
        window.open(`https://wa.me/${paymentNumber}?text=`);
    }

    return(
        <Container>
            {
                selectedComponent == "dashboard" && <Dashboard backend={backend} theme={theme} isAdmin={false}/>
            }
            {
                selectedComponent == "courses" && <Courses backend={backend} theme={theme} isSideBarOpen={isSideBarOpen} setBuyingAlert={setBuyingAlert} isAdmin={false}/>
            }
            {
                selectedComponent == "wallet" &&  <Card 
                                                        title={`Ballance: ${wallet}`} 
                                                        description={paymentNumber?`To charge your wallet please pay on this number: ${paymentNumber} as Vodaphone Cash and then send a photo for the recept on the whatsapp of the same previous number.`:"Comming soon!"}
                                                        variant="card1"
                                                        onClickFunction={messageWhatsapp}/>

            }
            {
                selectedComponent == "profile" &&  <Profile backend={backend} theme={theme} isAdmin={false}/>

            }
            
            
        </Container>
    );
}

export default StudentContentOutlet;

const Container = styled.div`
    /* margin-top: 5rem; */
    /* height: 100%; */
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;

`;