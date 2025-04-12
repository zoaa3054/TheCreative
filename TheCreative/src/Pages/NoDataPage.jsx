import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import noDataFound from "../assets/noDataFound.svg";

const NoDataPage = () =>{
    const navigate = useNavigate()
    return(
        <PageContainer bgImage={noDataFound}>
            <BackButton onClick={()=>navigate(-1)}>Go back</BackButton>
        </PageContainer>
    );
};
export default NoDataPage;

const PageContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    background-image: url(${({bgImage})=>bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: scroll;
    align-items: start;
    justify-content: center;
    padding-top: 1rem;
`;

const BackButton = styled.button`
    color: white;
    font-size: 1.5rem;
    background-color: black;
    border: 0 transparent;
    border-radius: 20px;
    padding: 0.5rem;
    cursor: pointer;
    width: 8rem;

    &:hover{
        color: black;
        background-color: white;
    }
`;

