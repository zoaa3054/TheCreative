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
    let r = match ? match[1] : null;
    return r;
  };

  const formatLink = (link)=>{
    let src = link;
    const embedLinkMatch = link.match(/^https:\/\/jumpshare\.com\/embed\/[a-zA-Z0-9]+(\?[^ ]*)?$/);
    if (embedLinkMatch) {
        src = embedLinkMatch[0];
        const url = new URL(src);
        const hideTitle = url.searchParams.get('hideTitle') === 'true';
        const disableDownload = url.searchParams.get('disableDownload') === 'true';

        if (!hideTitle) {
            url.searchParams.set('hideTitle', 'true');
        }
        if (!disableDownload) {
            url.searchParams.set('disableDownload', 'true');
        }
        return url.toString();  
    }
    return src;     
  }

  return (
    <div style={{width:"100%", display:"flex", flexDirection:"column", textAlign:"center", height: "100%"}}>
      {videoID ? (
        <div style={{ marginTop: "20px", width:"100%", height:"100%", textAlign:"start"}}>
          <YouTube videoId={videoID} opts={videoOptions}/>
          <h2 style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion?"Description":""}</h2>
          <p style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion?describtion:""}</p>
        </div>
      ):
      link?
      <div style={{width:"100%", height:"100%",  display:"flex", flexDirection:"column", alignItems: "start"}}>
        {/* <div style={{width:"100%", height:"5rem", position:"absolute", backgroundColor:theme=='light'?"white":"#181818"}}/> */}
        <iframe src={formatLink(link)} allow="fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen style={{border:"none", width:"100%", height:"100%", display:"flex"}}></iframe>
        {/* <video onContextMenu={(e) => e.preventDefault()} width={"100%"} height={"100%"} controls controlsList="nodownload">
            <source src={formatLink(link)} type="video/mp4"/>
            Your browser does not support the video tag.
        </video> */}
        <h2 style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion?"Description":""}</h2>
        <p style={{color:theme=='light'?"black":"white", fontFamily:'Roboto, Arial, sans-serif;'}}>{describtion?describtion:""}</p>
        
        </div>:
      <>
      <img src={noContent} alt="" style={{width:"100%", height:"50%", alignSelf:"center"}}/>
      <h2 style={{color:theme=="light"?"black":"white"}}>ENJOY, NO VIDEO HERE TODAY </h2>
      </>
      }
    </div>
  );
};

export default Video;