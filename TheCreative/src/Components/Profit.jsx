import styled from "styled-components";
import noDataFound from "../assets/noDataFound.svg";
import ascSortIcon from "../assets/ascSortIcon.png";
import descSortIcon from "../assets/descSortIcon.png";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const gradesList = ['M1', 'M2', 'M3', 'S1', 'S2'];


const Profit = ( { backend, theme, isSideBarOpen } )=>{
    const [profit, setProfit] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const notifyError = (mssg) =>{
        toast.error(mssg);
    }

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }
    
    useEffect(()=>{
        getProfit();
    }, []);

    const getProfit = async()=>{
        await fetch(`${backend}/profit`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching profit!"); 
        })
        .then((data)=>{
            setProfit(data);
            getTotalAmount(data);
        })
        .catch(error=>{
            notifyError("There something wrong with the system please logout and login again.")
            console.log(error);
        });
        setIsLoading(false);
    }

    const getTotalAmount = (data)=>{
        let total = 0;
        data.forEach((item)=>{
            total += item.amount;
        });
        setTotalAmount(total);
    }

    return(
        <Container>
            {isLoading?
            <Loader/>: 
            <TableWrapper>
                <StyledTable theme={theme}>
                    <thead>
                    <tr>
                        <th>Month</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profit.map((item, index) => (
                        <tr key={index}>
                        <td>{item.month}</td>
                        <td>{item.amount}</td>
                        </tr>
                    ))}
                    {!isLoading&&
                        <tr>
                        <td style={{fontWeight:"bolder"}}>Total</td>
                        <td style={{fontWeight:"bold"}}>{totalAmount}</td>
                        </tr>
                    }
                    </tbody>
                </StyledTable>
            </TableWrapper>
            }
            {/* {profit.length==0 && !isLoading &&<img src={noDataFound} alt="" style={{width:"50%", height:"80%"}}/>} */}
        </Container>
    );
};

export default Profit;

const Container = styled.div`
    width: 98%;
    height: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
`;


const TableWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: scroll;
`


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