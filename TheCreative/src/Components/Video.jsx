import YouTube from "react-youtube";
import { useState, useEffect } from "react";
import noContent from "../assets/noContent.svg";

const Video = ({ link, theme, describtion }) => {
  const [videoURL, setVideoURL] = useState("");
  const [videoID, setVideoID] = useState(null);

  const videoOptions = {
    width: "100%",
    height: "400rem",
    playerVars: {
      autoplay: 1,  // 0 = Manual Play, 1 = Auto Play
      controls: 1,  // Hide YouTube controls
      modestbranding: 0,  // Hide YouTube logo
      showinfo: 0,  // Hide title information
      rel: 0,  // Prevent related videos at the end
      disablekb: 0, // Disable keyboard shortcuts
      fs: 1, // Disable fullscreen button
    },
  };
  
  useEffect(()=>{
        setVideoID(extractYouTubeID(link));
  }, []);
  
  const extractYouTubeID = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };


  return (
    <div style={{width:"100%", display:"flex", flexDirection:"column", textAlign:"center", height: "100%"}}>
      {videoID ? (
        <div style={{ marginTop: "20px", width:"100%", height:"100%", textAlign:"start"}}>
          <YouTube videoId={videoID} opts={videoOptions}/>
          <h2 style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion?"Description":""}</h2>
          <p style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion}</p>
        </div>
      ):
      <>
      <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
      <h2 style={{color:theme=="light"?"black":"white"}}>ENJOY, NO VIDEO HERE TODAY </h2>
      </>
      }
    </div>
  );
};

export default Video;