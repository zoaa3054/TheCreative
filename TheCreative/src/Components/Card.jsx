import styled from "styled-components";


const Card = ({ title, description, variant, onClickFunction }) => {
  const getVariantProps = () => {
    switch (variant) {
      case "card1":
        return { bgColor: "#f2f8f9", hoverEffect: "scale", hoverTextColor: true };
      case "card2":
        return { bgColor: "#f2f8f9", border: true, hoverEffect: "shadow" };
      case "card3":
        return { bgColor: "#f2f8f9", border: true };
      case "card4":
        return { bgColor: "#fff", border: true };
      default:
        return { bgColor: "#f2f8f9" };
    }
  };

  return (
    <CardWrapper {...getVariantProps()} onClick={onClickFunction}>
      <Heading>{title}</Heading>
      <Description>{description}</Description>
      <GoCorner>
        <GoArrow>→</GoArrow>
      </GoCorner>
    </CardWrapper>
  );
};

export default Card;


const CardWrapper = styled.div`
  cursor: pointer;
  display: block;
  position: relative;
  max-width: 262px;
  background-color: ${(props) => props.bgColor || "#f2f8f9"};
  border-radius: 4px;
  padding: 32px 24px;
  margin: 12px;
  text-decoration: none;
  overflow: hidden;
  border: ${(props) => (props.border ? "1px solid #ccc" : "none")};
  transition: all 0.3s ease-out;

  &:hover {
    ${(props) =>
      props.hoverEffect === "scale"
        ? "transform: scale(1.05);"
        : props.hoverEffect === "shadow"
        ? "box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);"
        : ""}
  }
`;

const Heading = styled.p`
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
  color: #666;
  transition: color 0.3s ease-out;
  
  ${CardWrapper}:hover & {
    color: ${(props) => (props.hoverTextColor ? "#fff" : "#00838d")};
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
`;

const GoCorner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 32px;
  height: 32px;
  overflow: hidden;
  top: 0;
  right: 0;
  background-color: #00838d;
  border-radius: 0 4px 0 32px;
  transition: opacity 0.3s linear;

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const GoArrow = styled.div`
  color: white;
  font-family: courier, sans;
`;
