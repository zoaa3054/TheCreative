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


const Students = ( { backend, theme, isSideBarOpen } )=>{
    const [sortDirection, setSortDirection] = useState(1);
    const [gradeFilter, setGradeFilter] = useState(gradesList[0]);
    const [cityFilter, setCityFilter] = useState(State.getStatesOfCountry('EG')[0].name);
    const [students, setStudents] = useState([]);
    const [viewedStudents, setViewedStudents] = useState([]);
    const [filterON, setFilterON] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const notifyError = (mssg) =>{
        toast.error(mssg);
    }

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }
    
    useEffect(()=>{
        setIsLoading(true);
        getAllStudnets();
        
    }, [sortDirection, gradeFilter, cityFilter, filterON]);

    const getAllStudnets = async()=>{
        const filterObject = getFilterList();
        const filterObjectEncoded = encodeURIComponent(JSON.stringify(filterObject));

        await fetch(`${backend}/students?filterBy=${filterObjectEncoded}&sortDirection=${sortDirection}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching students!"); 
        })
        .then((data)=>{
            console.log("All Students: ", data);
            setStudents(data);
            setViewedStudents(data);
        })
        .catch(error=>{
            notifyError("There something wrong with the system please logout and login again.")
            console.log(error);
        });
        setIsLoading(false);
    }


    const getFilterList = ()=>{
        let outputList = {};
        if (filterON){
            outputList.grade = gradeFilter;
            outputList.city = cityFilter;
        }
        return outputList;
    }

    const changeSortDirection = ()=>{
        if (sortDirection == 1) setSortDirection(-1);
        else setSortDirection(1);
    }

    const goToStudent = (student)=>{
        navigate(`/student/${student._id}`, {state:{backend: backend, theme: theme}});
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
        let studentsToBeShowen = [];
        students.forEach((student)=>{
            if(student.username.includes(searchKey)) studentsToBeShowen.push(student);
        })
        setViewedStudents(studentsToBeShowen);
    }

    return(
        <Container>
            <ControlBar isSideBarOpen={isSideBarOpen}>
                <FilterControl>
                    <div style={{display:"flex", alignItems:"center"}}>
                    <label htmlFor="filterON">Filter</label>
                    <input name="filterON" type="checkbox" onChange={(e)=>{setFilterON(prev=>!prev)}} style={{cursor:"pointer"}}/>
                    </div>
                    <Select title="filter by city" disabled={!filterON} theme={theme} value={cityFilter} onChange={(event)=>setCityFilter(event.target.value)}>
                        {State.getStatesOfCountry('EG').map((state, key)=>(
                            <option key={key} value={state.name}>{state.name}</option>
                        ))}
                    </Select>
                    <Select title="filter by grade" disabled={!filterON} theme={theme} value={gradeFilter} onChange={(event)=>setGradeFilter(event.target.value)}>
                        <option value="" disabled>Grade</option>
                        {gradesList.map((grade, key)=>(
                            <option value={grade} key={key}>
                                {grade}
                            </option>
                        ))}
                    </Select>
                    <SearchBar theme={theme} type="text" placeholder="Search" onChange={search}/>
                </FilterControl>
                <SortControl>
                    <SortButton 
                        title="sorting direction" 
                        src={sortDirection==1?ascSortIcon:descSortIcon}
                        onClick={changeSortDirection}
                    />
                </SortControl>
            </ControlBar>
            
            {isLoading?
            <Loader/>:students.length>0 && 
            <TableWrapper>
                <StyledTable theme={theme}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Grade</th>
                        <th>City</th>
                        <th>Student Phone</th>
                        <th>Parent Phone</th>
                        <th>date</th>
                        <th>Wallet</th>
                    </tr>
                    </thead>
                    <tbody>
                    {viewedStudents.map((item, index) => (
                        <tr key={index} onClick={()=>goToStudent(item)} >
                        <td><NewLabel isNew={checkModernity(item.date)}>{item.username}</NewLabel></td>
                        <td>{item.grade}</td>
                        <td>{item.city}</td>
                        <td>{item.studentPhone}</td>
                        <td>{item.parentPhone}</td>
                        <td>{timeStampToDate(item.date)}</td>
                        <td>{item.cash}</td>
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableWrapper>
            }
            {students.length==0 && <img src={noDataFound} alt="" style={{width:"50%", height:"80%"}}/>}
        </Container>
    );
};

export default Students;

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

    @media (max-width: 500px){
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

const SortButton = styled.img`
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

    @media (max-width: 500px){
        width: 5rem;
        margin: 0.2rem;
    }
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