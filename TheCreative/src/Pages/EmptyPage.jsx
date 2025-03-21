import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import notFound from "../assets/notFound.png";

const EmptyPage = () =>{
    const navigate = useNavigate()
    return(
        <PageContainer>
            <NotFoundImage src={notFound}/>
            <BackButton onClick={()=>navigate(-1)}>Go back</BackButton>
        </PageContainer>
    );
};
export default EmptyPage;

const PageContainer = styled.div`
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
    background-color: #e5e5f7;
    opacity: 1;
    background-image:  linear-gradient(30deg, #dedee2 12%, transparent 12.5%, transparent 87%, #dedee2 87.5%, #dedee2), linear-gradient(150deg, #dedee2 12%, transparent 12.5%, transparent 87%, #dedee2 87.5%, #dedee2), linear-gradient(30deg, #dedee2 12%, transparent 12.5%, transparent 87%, #dedee2 87.5%, #dedee2), linear-gradient(150deg, #dedee2 12%, transparent 12.5%, transparent 87%, #dedee2 87.5%, #dedee2), linear-gradient(60deg, #dedee277 25%, transparent 25.5%, transparent 75%, #dedee277 75%, #dedee277), linear-gradient(60deg, #dedee277 25%, transparent 25.5%, transparent 75%, #dedee277 75%, #dedee277);
    background-size: 38px 67px;
    background-position: 0 0, 0 0, 19px 33px, 19px 33px, 0 0, 19px 33px;
`;

const NotFoundImage = styled.img`
    width: 30rem;
    height: 30rem;
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

