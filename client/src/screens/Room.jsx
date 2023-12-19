import {useEffect,useCallback,useState, lazy, Suspense } from 'react';
import { useSocket } from '../context/SocketProvide';
import { FaVideo, FaMicrophone,FaVideoSlash,FaMicrophoneSlash } from 'react-icons/fa';
import { MdCallEnd } from "react-icons/md";

import Peer from '../services/Peer';
import useCall from '../socket/useCall'
import { useLocation } from 'react-router-dom';
const VideoPlayer = lazy(()=> import('../components/VideoPlayer'))

const Room = () => {

    const socket = useSocket();
    const location = useLocation();
    
    
    
    
    const {handleUserJoined,handleCall} = useCall();
    const [remoteSocketId,setRemoteSocketId] =useState(null);
    const [myStream,setStream] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);
    const [remoteUserName,setRemoteUserName] =useState(null)
    const [incomingCall,setIncomingCall]=useState(false)
    const [showBar,setShowBar] = useState(true)
    const [calling, setCalling] = useState(false);
    const [isVideoEnabled, setVideoEnabled] = useState(true);
const [isAudioEnabled, setAudioEnabled] = useState(true);







    const sendStreams = useCallback(() => {
      try {
        if (myStream && Peer.peer) {
          const existingSenders = Peer.peer.getSenders();
    
          for (const track of myStream.getTracks()) {
            let trackExists = false;
    
            for (const sender of existingSenders) {
              if (sender.track === track) {
                trackExists = true;
                sender.track.enabled = track.enabled; // Update track's enabled status
                break;
              }
            }
    
            if (!trackExists) {
              Peer.peer.addTrack(track, myStream);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, [myStream]);
    
    

    const handleAcceptCall = useCallback(()=>{
      setShowBar(false)
      setIncomingCall(false)
      sendStreams();
      socket.emit('accepted:call:final',{to:remoteSocketId})
    },[remoteSocketId, sendStreams, socket])

    const handleRejectCall= useCallback(()=>{
      socket.emit("call:reject",{to:remoteSocketId,room:location.state.room})
      Peer.closeConnection();
      
          
      setRemoteStream(null);

      // setIncomingCall(false)
      // window.location.reload();
      window.location.href = '/';
     

      
    },[location.state.room, remoteSocketId, socket])

    const handleIncomingCall = useCallback(async({from,offer})=>{
       const ans = await Peer.getAnswer(offer)
       setRemoteSocketId(from);
       

   
    socket.emit("call:accepted",{to:from,ans})
    
    setIncomingCall(true)
    


    },[socket])

  

    const handleAcceptedCall = useCallback(({from,ans})=>{
           Peer.setLocalDescription(ans);
           console.log('Call Accepted');
           sendStreams();
          //  socket.emit("sendStreams",{to:from})
           

    },[sendStreams])

    const handleRejectedCall =useCallback(()=>{
      Peer.closeConnection();
      
     
    setRemoteStream(null);
    // setIncomingCall(false);
    // window.location.reload();
    // await socket.leave(location.state.room)
    socket.emit("leave:room",{room:location.state.room})

    window.location.href = '/';

    },[location.state.room, socket])

    const toggleVideo = () => {
      if (myStream) {
        const videoTrack = myStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
  
        // Emit a signal to inform others about video status change
        socket.emit('video:toggle', { isEnabled: videoTrack.enabled });
      }
    };
  
    const toggleAudio = () => {
      if (myStream) {
        const audioTrack = myStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
  
        // Emit a signal to inform others about audio status change
        socket.emit('audio:toggle', { isEnabled: audioTrack.enabled });
      }
    };

    const handleRemoteVideoToggle = useCallback(({ isEnabled }) => {
      // Update UI or handle remote video toggling
      // For example, if using a video element:
      const remoteVideoElement = document.getElementById('remoteVideo'); // Replace with your video element ID
      if (remoteVideoElement) {
        remoteVideoElement.srcObject.getVideoTracks()[0].enabled = isEnabled;
      }
    }, []);
  
    const handleRemoteAudioToggle = useCallback(({ isEnabled }) => {
      // Update UI or handle remote audio toggling
      // For example, if using an audio element:
      const remoteAudioElement = document.getElementById('remoteAudio'); // Replace with your audio element ID
      if (remoteAudioElement) {
        remoteAudioElement.srcObject.getAudioTracks()[0].enabled = isEnabled;
      }
    }, []);
  
    
    const handleNegoNeeded = useCallback(async () => {
        const offer = await Peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      }, [remoteSocketId, socket]);
    

      useEffect(() => {
        Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
          Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
      }, [handleNegoNeeded]);


      const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
          
          const ans = await Peer.getAnswer(offer);
          socket.emit("peer:nego:done", { to: from, ans });
          // sendStreams()
          
        },
        [socket]
      );
    
      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await Peer.setLocalDescription(ans);
        // sendStreams()

      }, []);

      const videoSetter = async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
          audio:true,
          video:true
      })
      setStream(stream);

      }
    
      useEffect( ()=>{
      videoSetter();
      if(location.state.remoteId !== 0) {
        setRemoteUserName(location.state.userName)
        setRemoteSocketId(location.state.remoteId)};
      },[location.state.remoteId, location.state.userName])
     
    useEffect(() => {
        Peer.peer.addEventListener("track", async (ev) => {
          const remoteStream = ev.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remoteStream[0]);
        });
      }, []); 

     useEffect(()=>{
        socket.on("user:joined",(data)=>handleUserJoined(data,setRemoteSocketId,setRemoteUserName));
        socket.on("incoming:call",handleIncomingCall);
        socket.on("call:accepted",handleAcceptedCall);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("sendStreams", handleAcceptCall);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:reject", handleRejectedCall);
    socket.on("accepted:call:final",()=>setShowBar(false))
    socket.on('video:toggle', handleRemoteVideoToggle);
    socket.on('audio:toggle', handleRemoteAudioToggle);



        return ()=> {
            socket.off("user:joined",(data)=>handleUserJoined(data,setRemoteSocketId,setRemoteUserName))
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("sendStreams", handleAcceptCall);

      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:reject", handleRejectedCall);
      socket.off('video:toggle', handleRemoteVideoToggle);
    socket.off('audio:toggle', handleRemoteAudioToggle);


        }
     },[socket, handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegoNeedIncomming, handleNegoNeedFinal, handleRejectedCall, handleAcceptCall, handleRemoteVideoToggle, handleRemoteAudioToggle])
    return (
        <div className='flex justify-center w-full h-screen p-5'>
        {showBar &&
          <div className='bg-blue-100 rounded-lg p-2 w-1/4'>
            <div className='flex gap-3 content-center items-center m-4'>
              <button className='bg-blue-400 rounded-full w-16 h-16 text-2xl text-white' >V</button>
            <h1 className='text-lg font-bold'>
              Vid.io
            </h1>
            </div>
            <div className=' flex justify-center items-center w-full text-md font-bold  bg-white h-10 rounded-lg'>
            {remoteSocketId?<div className='flex justify-center content-center items-center gap-2'>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              <p>{remoteUserName}</p>
              
              </div>
              
              
              :<p>Room is Empty</p>
              
              }
              

            </div>
            {!incomingCall && remoteSocketId && <button className='w-full bg-blue-400 rounded-lg text-white h-10 mt-3' onClick={()=>handleCall(remoteSocketId,setCalling,calling)} disabled={calling}>
            {calling ? 'Calling...' : 'Call'}
              </button>}
            

             
            {incomingCall && <div className='flex gap-2 justify-center mt-2'><button className='w-1/2 h-9 bg-red-500 rounded-lg text-white' onClick={handleAcceptCall}>Accept</button>
        <button className=' w-1/2 h-9 bg-red-500 rounded-lg text-white ' onClick={handleRejectCall}>Leave Room</button></div>}
             </div>
             
}
             <div className=' w-full  flex justify-center space-x-3 '>
              

            <div className='flex flex-col justify-center content-center items-center gap-3'>
              <div className='flex gap-2'>
             
            {myStream && (
                 
                 <div className='flex flex-col justify-center items-center  ' >
                   <Suspense>
                     <VideoPlayer  stream={myStream}  />
                     </Suspense>
                 
                 </div>
             )}
             {
              !showBar && remoteStream && 
            
            
             <div className='flex flex-col justify-center items-center '>
               <Suspense fallback={<div>Loading ...</div>}>
              <VideoPlayer stream={remoteStream}   />
              </Suspense>
              
              </div>
              
              
             }
             </div>
             <div className='flex gap-3'>
            {remoteStream && !incomingCall &&
              <button
              className= 'rounded-full p-2  hover:bg-opacity-75 bg-red-500 text-white'
              onClick={handleRejectCall}
              aria-label="End call"
            >
              <MdCallEnd className="w-5 h-5" />
            </button>
            }
            {myStream && (
        
        <button
        className='rounded-full p-2 text-black hover:bg-opacity-75'
        onClick={toggleVideo}
        aria-label="Toggle camera"
      >
        {isVideoEnabled ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
      </button>
      )}

      {myStream && (
      
         <button
         className='rounded-full p-2 text-black hover:bg-opacity-75'
         onClick={toggleAudio}
         aria-label="Toggle microphone"
       >
         {isAudioEnabled ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
       </button>
      )}
      </div>
        </div>
        
{!calling && !incomingCall && !remoteStream && <button className=' fixed top-3 right-4 text-white font-bold py-2 px-4  bg-red-500 rounded-lg  ' onClick={handleRejectCall}>Leave Room</button>}
        </div>
        </div>
     );

};
 
export default Room;