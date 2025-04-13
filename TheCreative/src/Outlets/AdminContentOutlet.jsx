import styled from "styled-components";
import Courses from "../Components/Courses";
import Dashboard from "../Components/Dashboard";
import Card from "../Components/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Profile from "../Components/Profile";
import Settings from "../Components/Settings";
import Students from "../Components/Students";
import AddLecture from "../Components/AddLecture";
import Logs from "../Components/Logs";
import Admins from "../Components/Admins";

const AdminContentOutlet = ({ backend, theme, selectedComponent, isSideBarOpen, setBuyingAlert})=>{
    const [settingsChange, setSettingsChange] = useState(0);

    const notifyError = (mssg)=>{
        toast.error(mssg);
    }

    return(
        <Container>
            {
                selectedComponent == "addLecture" && <AddLecture backend={backend} theme={theme}></AddLecture>
            }
            {
                selectedComponent == "courses" && <Courses backend={backend} theme={theme} isSideBarOpen={isSideBarOpen} setBuyingAlert={setBuyingAlert} isAdmin={true}/>
            }
            {
                selectedComponent == "students" &&  <Students backend={backend} theme={theme} isSideBarOpen={isSideBarOpen}/>

            }
            {
                selectedComponent == "admins" &&  <Admins  backend={backend} theme={theme} isSideBarOpen={isSideBarOpen}></Admins>

            }
            {
                selectedComponent == "logs" &&  <Logs backend={backend} theme={theme} isSideBarOpen={isSideBarOpen}></Logs>

            }
            {
                selectedComponent == "profile" &&  <Profile backend={backend} theme={theme} isAdmin={true}/>

            }
            {
                selectedComponent == "settings" &&  <Settings backend={backend} theme={theme} />

            }
            
        </Container>
    );
}

export default AdminContentOutlet;

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