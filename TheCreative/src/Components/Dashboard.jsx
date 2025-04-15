import { useEffect, useState } from "react";
import styled from "styled-components";
import noContent from "../assets/emptyDashboard.svg";

const Dashboard = ({theme, backend, isAdmin, studentDashboard})=>{
    const [dashboard, setDashboard] = useState([]);
    
    useEffect(()=>{
        console.log(studentDashboard);
        if (!isAdmin) getDashboard();
        else if (isAdmin && studentDashboard) setDashboard(studentDashboard);
        else setDashboard([]);
    }, []);

    const timeStampToDate = (timeStamp)=>{
        const ts = new Date(timeStamp);
        return ts.toLocaleDateString();
    }

    const getDashboard = async()=>{
        await fetch(`${backend}/user/dashboard`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching user dashboard!");
        })
        .then((data)=>{
            setDashboard(data.dashboard);
        })
        .catch(error=>{
            console.log(error);
            notifyError("There something wrong with the system please logout and login again.");

        });
    }

    return(
        <Container theme={theme}>
            {dashboard.length>0?
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
                            <th>Description</th>
                            <th>Mark</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboard.map((item, index) => (
                            <tr key={index}>
                            <td>{item.number}</td>
                            <td>{item.unit==0?"ALL":(item.unit==-1?"SOME":item.unit)}</td>
                            <td>{item.field}</td>
                            <td>{item.grade}</td>
                            <td>{item.term}</td>
                            <td>{timeStampToDate(item.date)}</td>
                            <td>{item.explainDescribtion.length > 20?item.explainDescribtion.slice(0, 20)+'...':item.explainDescribtion}</td>
                            <td>{item.mark}</td>
                            </tr>
                        ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
        :   <>
                <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
                <h2 style={{color:theme=='light'?"black":"white", fontFamily:'sans-serif', textAlign: 'center'}}>{isAdmin?"NO DATA":"GO NOW AND EXPLORE NEW COURSES"}</h2>
            </>}
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
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