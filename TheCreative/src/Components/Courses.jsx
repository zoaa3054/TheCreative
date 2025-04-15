import styled, { keyframes } from "styled-components";
import ascSortIcon from "../assets/ascSortIcon.png";
import descSortIcon from "../assets/descSortIcon.png";
import noDataFound from "../assets/noDataFound.svg";

import Modal from "react-modal";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const filterCriteriaList = {
    Term: ['T1','T2'],
    Grade: ['M1','M2','M3','S1','S2'],
    Field: ['Algebra','Geometry','Trigonometry']
}

const sortCriteriaList = ["date", "size"];

const Courses = ( { backend, theme, isSideBarOpen, setBuyingAlert, isAdmin } )=>{
    const [sortDirection, setSortDirection] = useState(-1);
    const [termFilter, setTermFilter] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [fieldFilter, setFieldFilter] = useState(filterCriteriaList.Field[0]);
    const [sortCriteria, setSortCriteria] = useState(sortCriteriaList[0]);
    const [lectures, setLectures] = useState([]);
    const [boughtLectures, setBoughtLectures] = useState([]);
    const navigate = useNavigate();
    const [buyFormOpen, setBuyFormOpen] = useState(false);
    const [lectureAboutToBeBought, setLectureAboutToBeBought] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const notifyError = (mssg) =>{
        toast.error(mssg);
    }

    const notifySuccess = (mssg) =>{
        toast.success(mssg);
    }

    useEffect(()=>{
        setTermFilter(getTerm());

        if (!isAdmin){
            getUserGrade()
            .then((grade)=>{
                setGradeFilter(grade);
            });
        }else{
            setGradeFilter(filterCriteriaList.Grade[0]);
            
        }
    }, []);
    
    useEffect(()=>{
        setIsLoading(true);
        getAllLectures();
        if (!isAdmin) getBoughtLectures();
        
    }, [termFilter, gradeFilter, fieldFilter, sortCriteria, sortDirection]);

    const getAllLectures = async()=>{
        const filterObject = getFilterList();
        const filterObjectEncoded = encodeURIComponent(JSON.stringify(filterObject));
        console.log("filter: ", filterObject);

        await fetch(`${backend}/lectures?filterBy=${filterObjectEncoded}&sortBy=${sortCriteria}&sortDirection=${sortDirection}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching lectures!"); 
        })
        .then((data)=>{
            setLectures(data);
        })
        .catch(error=>{
            notifyError("There something wrong with the system please logout and login again.");
            console.log(error);
        });
        setIsLoading(false);

    }

    
    const getUserGrade = async()=>{
        let grade;
        await fetch(`${backend}/user/grade`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching user grade!");
        })
        .then((data)=>{
            grade = data.grade;
        })
        .catch(error=>console.log(error));
        return grade;
    }

    const getBoughtLectures = async()=>{
        await fetch(`${backend}/user/boughtLectures`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            }
        })
        .then((result)=>{
            if (result.status == 200) return result.json();
            else throw Error("Somethig went wrong while fetching user grade!");
        })
        .then((data)=>{
            setBoughtLectures(data.boughtLectures);
        })
        .catch(error=>console.log(error));
    }

    const buyLecture = async(lectureId)=>{
        await fetch(`${backend}/user/buy/lecture`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
            },
            body: JSON.stringify({lectureId: lectureId})
        })
        .then((result)=>{
            if (result.status == 201) return result.json();
            if (result.status == 402) {
                notifyError("Money in your wallet is not enough, Please add money to your wallet first!");
                throw Error("Insufficient funds");
            }
            else throw Error("Somethig went wrong while fetching user grade!");
        })
        .then((_)=>{
            notifySuccess("Lecture bought successfuly");
            setBuyingAlert(prev=>prev+1);
            setBuyFormOpen(false);
            getBoughtLectures();
            // navigate(0); // for reloading the page to update the wallet
        })
        .catch(error=>console.log(error));
    }

    const getFilterList = ()=>{
        let outputList = {};
        outputList.term = termFilter;
        outputList.grade = gradeFilter;
        outputList.field = fieldFilter;
        
        return outputList;
    }

    const getTerm = ()=>{
        const currentMonth = new Date().getMonth() + 1;
        if (currentMonth == 1 || currentMonth >= 8){
            return 'T1';
        }

        else{
            return 'T2';
        }
    }

    const changeSortDirection = ()=>{
        if (sortDirection == 1) setSortDirection(-1);
        else setSortDirection(1);
    }

    const timeStampToDate = (timeStamp)=>{
        const ts = new Date(timeStamp);
        return ts.toLocaleDateString();
    }

    const checkModernity = (timeStamp)=>{
        const currentTimeStamp = Date.now();
        
        return currentTimeStamp - timeStamp <= 604800000;
    }

    const goToLecture = (lecture)=>{
        // check if bought
        if (isAdmin){
            navigate(`/edit/lecture/${lecture._id}`, {state:{backend: backend, theme: theme}});
        }
        else if (boughtLectures.includes(lecture._id))
            navigate(`/lecture/${lecture._id}`, {state:{backend: backend, theme: theme, isAdmin: isAdmin}});
        else{
            setBuyFormOpen(true);
            setLectureAboutToBeBought(lecture);
        }
    }

    return(
        <Container>
            <ControlBar isSideBarOpen={isSideBarOpen}>
                <FilterControl>
                    <Select title="filter by field" theme={theme} value={fieldFilter} onChange={(event)=>setFieldFilter(event.target.value)}>
                        <option value="" disabled>Field</option>
                        {filterCriteriaList.Field.map((field, key)=>(
                            <option value={field} key={key}>
                                {field}
                            </option>
                        ))}
                    </Select>
                    <Select title="filter by grade" theme={theme} value={gradeFilter} onChange={(event)=>setGradeFilter(event.target.value)}>
                        <option value="" disabled>Grade</option>
                        {filterCriteriaList.Grade.map((grade, key)=>(
                            <option value={grade} key={key}>
                                {grade}
                            </option>
                        ))}
                    </Select>
                    <Select title="filter by term" theme={theme} value={termFilter} onChange={(event)=>setTermFilter(event.target.value)}>
                        <option value="" disabled>Term</option>
                        {filterCriteriaList.Term.map((term, key)=>(
                            <option value={term} key={key}>
                                {term}
                            </option>
                        ))}
                    </Select>
                </FilterControl>
                <SortControl>
                    <Select title="sort by" theme={theme} value={sortCriteria} onChange={(event)=>setSortCriteria(event.target.value)}>
                        <option value="" disabled>Sort by</option>
                        {sortCriteriaList.map((criteria, key)=>(
                            <option value={criteria} key={key}>
                                {criteria}
                            </option>
                        ))}
                    </Select>
                    <SortButton 
                        title="sorting direction" 
                        src={sortDirection==1?ascSortIcon:descSortIcon}
                        onClick={changeSortDirection}
                    />
                </SortControl>
            </ControlBar>
            
            {isLoading?
            <Loader/>:lectures.length>0 && 
            <TableWrapper>
                <StyledTable theme={theme}>
                    <thead>
                    <tr>
                        <th>Lecture</th>
                        <th>Unit</th>
                        <th>Field</th>
                        <th>Grade</th>
                        <th>Term</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Cost</th>
                        <th>Description</th>
                        <th>#Purchases</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lectures.map((item, index) => (
                        <tr key={index} onClick={()=>goToLecture(item)} >
                        <td><NewLabel isNew={checkModernity(item.date)}>{item.number}</NewLabel></td>
                        <td>{item.unit==0?"ALL":(item.unit==-1?"SOME":item.unit)}</td>
                        <td>{item.field}</td>
                        <td>{item.grade}</td>
                        <td>{item.term}</td>
                        <td>{timeStampToDate(item.date)}</td>
                        <td>{(item.size/3600).toFixed(2)}hr</td>
                        <td style={{color: boughtLectures.includes(item._id)&&"#05aa05", fontWeight:"bold"}}>{boughtLectures.includes(item._id)?"PAYED":`${item.cost} LE`}</td>
                        <td>{item.explainDescribtion&&item.explainDescribtion.length > 20?item.explainDescribtion.slice(0, 20)+'...':item.explainDescribtion}</td>
                        <td>{item.numOfPurchases}</td>
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableWrapper>
            }
            {lectures.length==0 && !isLoading &&<img src={noDataFound} alt="" style={{width:"50%", height:"80%"}}/>}
            <Modal
                isOpen={buyFormOpen}
                onRequestClose={()=>setBuyFormOpen(false)}
                style={buyFormStyle}
            >
                <Button onClick={()=>setBuyFormOpen(false)} style={{alignSelf:"end"}} theme={theme}>X</Button>
                <h2>You are about to buy: </h2>
                <h4>Lecture: {lectureAboutToBeBought.number}</h4>
                <h4>Unit: {lectureAboutToBeBought.unit==0?"ALL":lectureAboutToBeBought.unit}</h4>
                <h4>Field: {lectureAboutToBeBought.field}</h4>
                <h4>Grade: {lectureAboutToBeBought.grade}</h4>
                <h4>Term: {lectureAboutToBeBought.term}</h4>
                <h3>Click Confirm to complete the purchase.</h3>
                <Button onClick={()=>buyLecture(lectureAboutToBeBought._id)} style={{justifySelf:"center"}} theme={theme}>Confirm</Button>
            </Modal>
        </Container>
    );
};

export default Courses;

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
`
const buyFormStyle = {
    content:{
        justifySelf:"center",
        width: "fit-content",
        height: "fit-content",
        display: "flex", 
        flexDirection: "column",
        borderRadius: "25px",
        overflow: "scroll"
    }
}

const Button = styled.button`
    background-color: ${({theme})=>theme=='light'?"rgba(0,71,171,1)":"black"};
    border-radius: 25px;
    padding: 1rem;
    color: white;
    border: 1px solid transparent;
    justify-self: center;
    cursor: pointer;

    &:hover{
        background-color: white;
        color: black;
        border: 1px solid black;
    }
`

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