import styled, { keyframes } from "styled-components";
import ascSortIcon from "../assets/ascSortIcon.png";
import descSortIcon from "../assets/descSortIcon.png";
import noDataFound from "../assets/noDataFound.svg";

import Modal from "react-modal";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const methodFilterList = ['ADD', 'DELETE', 'UPDATE'];


const Logs = ( { backend, theme, isSideBarOpen} )=>{
    const [sortDirection, setSortDirection] = useState(-1);
    const [methodFilter, setMethodFilter] = useState('You');
    const [adminFilter, setAdminFilter] = useState('');
    const [logs, setLogs] = useState([]);
    const [adminList, setAdminList] = useState([]);
    const [filterON, setFilterON] = useState(false);
    

    const notifyError = (mssg) =>{
        toast.error(mssg);
    }

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }

    useEffect(()=>{
        getAdmins();
    }, []);
    
    useEffect(()=>{
        getLogs();
    }, [methodFilter, adminFilter, sortDirection, filterON]);

    const getLogs = async()=>{
        const filterObject = getFilterList();
        const filterObjectEncoded = encodeURIComponent(JSON.stringify(filterObject));
        console.log("filter: ", filterObject);

        await fetch(`${backend}/logs?filterBy=${filterObjectEncoded}&sortDirection=${sortDirection}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching logs!"); 
        })
        .then((data)=>{
            setLogs(data);
        })
        .catch(error=>{
            notifyError("There something wrong with the system please logout and login again.");
            console.log(error);
        });
    }

    
    const getAdmins = async()=>{
        await fetch(`${backend}/admins`, {
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
            setAdminList(data);
            setAdminFilter(data[0].username);
        })
        .catch((error)=>console.log(error));
    }

    const getFilterList = ()=>{
        let outputList = {};
        if (filterON){
            outputList.method = methodFilter;
            outputList.admin = adminFilter;
        }
        return outputList;
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


    return(
        <Container>
            <ControlBar isSideBarOpen={isSideBarOpen}>
                <FilterControl>
                    <div style={{display:"flex", alignItems:"center"}}>
                    <label htmlFor="filterON">Filter</label>
                    <input name="filterON" type="checkbox" onChange={(e)=>{setFilterON(prev=>!prev)}} style={{cursor:"pointer"}}/>
                    </div>
                    <Select title="filter by method" disabled={!filterON} theme={theme} value={methodFilter} onChange={(event)=>setMethodFilter(event.target.value)}>
                        <option value="" disabled>Method</option>
                        {methodFilterList.map((method, key)=>(
                            <option value={method} key={key}>
                                {method}
                            </option>
                        ))}
                    </Select>
                    <Select title="filter by admin" disabled={!filterON} theme={theme} value={adminFilter} onChange={(event)=>setAdminFilter(event.target.value)}>
                        <option value="" disabled>Admin</option>
                        {adminList.map((admin, key)=>(
                            <option value={admin.username} key={key}>
                                {admin.username}
                            </option>
                        ))}
                    </Select>
                </FilterControl>
                <SortControl>
                    <SortButton 
                        title="sorting direction" 
                        src={sortDirection==1?ascSortIcon:descSortIcon}
                        onClick={changeSortDirection}
                    />
                </SortControl>
            </ControlBar>
            
            {logs.length>0 && 
            <TableWrapper>
                <StyledTable theme={theme}>
                    <thead>
                    <tr>
                        <th>Admin</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((item, index) => (
                        <tr key={index}>
                        <td><NewLabel isNew={checkModernity(item.date)}>{item.admin}</NewLabel></td>
                        <td>{item.method}</td>
                        <td>{timeStampToDate(item.date)}</td>
                        <td>{item.text}</td>
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableWrapper>
            }
            {logs.length==0 && <img src={noDataFound} alt="" style={{width:"50%", height:"80%"}}/>}
        </Container>
    );
};

export default Logs;

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
    align-items: center;
    justify-content: space-evenly;
    background-color: #acacac99;
    ${({isSideBarOpen})=>isSideBarOpen&&window.innerWidth<400?"opacity: 0;":"opacity: 1;"}
    transition: opacity 0.5s;
`;


const Select = styled.select`
    border-radius: 25px;
    border: 1px solid black;
    padding: 1rem;
    margin: 1rem;
    background-color: transparent;
    color: black;
    cursor: pointer;

    @media (max-width: 400px){
        width: 3.5rem;
        margin: 0.2rem;
    }
`;

const SortButton = styled.img`
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    margin-right: 1rem;
    &:hover{
        scale: 1.2;
    }
`;

const SortControl = styled.div`
    width: 50%;
    display: flex;
    justify-content: end;
    align-items: center;
`;

const FilterControl = styled.div`
    padding-left: 1rem;
    width: 50%;
    display: flex;
    justify-content: start;
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


const TableWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: scroll;

`


const StyledTable = styled.table`
    width: 92%;
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