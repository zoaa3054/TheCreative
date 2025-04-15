import { ClipLoader } from "react-spinners";
import styled, { keyframes } from "styled-components";

const Loader = ({ size }) => {
  return (
    <Container>
        <AnimatedText viewBox="0 0 300 100" width="300" height="100">
            <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#973BED" />
                <stop offset="100%" stop-color="#007CFF" />
            </linearGradient>
            </defs>
            <Dash x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="40" stroke="url(#gradient)" stroke-width="1" fill="transparent">
            TheCreative
            </Dash>
        </AnimatedText>
    </Container>
  );
};

export default Loader;



const dashText = keyframes`
  0% {
    stroke-dasharray: 0 500;
  }
  50% {
    stroke-dasharray: 500 0;
  }
  100% {
    stroke-dasharray: 0 500;
  }

`;

const dashOffset = keyframes`
  0% {
    stroke-dashoffset: 500;
  }
  100% {
    stroke-dashoffset: 0;
  }

`;


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2em 0;
`;

const AnimatedText = styled.svg``;

const Dash = styled.text`
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: ${dashText} 2s ease-in-out infinite, ${dashOffset} 2s linear infinite;

`;
