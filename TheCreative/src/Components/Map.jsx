const MapNode = ({ label, filled , onIt}) => {
    return (
      <div style={{ display: "flex", whiteSpace:'nowrap' }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: filled ? "#679EEA" : "white",
            border: "2px solid #679EEA",
            position: "relative",
            transition: "background-color 0.5s",
            transform: "translateX(-10px)"
          }}
        ></div>
        <span 
          style={{ 
            marginLeft: "10px", 
            fontSize: "20px", 
            color: onIt&&"#679EEA", 
            transition:"color 0.5s"
          }}
        >{label}</span>
      </div>
    );
  };
  
  const Map = ({ stage }) => {
    return (
      <div style={{ display: "flex", flexDirection: "column",padding: "20px" }}>
        {/* Exam */}
        <div style={{ position: "relative" }}>
          <MapNode label="Exam" filled={stage>=1} onIt={stage==1}/>
          <div
            style={{
              width: "2px",
              height: "10vh",
              backgroundColor: stage>1?"#679EEA":"black",
              transition: "background-color 0.5s"
            }}
          ></div>
        </div>
  
        {/* HW Check */}
        <div style={{ position: "relative" }}>
          <MapNode label="HW Check" filled={stage>=2} onIt={stage==2}/>
          <div
            style={{
              width: "2px",
              height: "10vh",
              backgroundColor: stage>2?"#679EEA":"black",
              transition: "background-color 0.5s"
            }}
          ></div>
        </div>
  
        {/* Lecture */}
        <div style={{ position: "relative" }}>
          <MapNode label="Lecture" filled={stage>=3} onIt={stage==3}/>
          <div
            style={{
              width: "2px",
              height: "10vh",
              backgroundColor: stage>3?"#679EEA":"black",
              transition: "background-color 0.5s"
            }}
          ></div>
        </div>
  
        {/* HW */}
        <MapNode label="HW" filled={stage==4} onIt={stage==4}/>
      </div>
    );
  };
  
  export default Map;