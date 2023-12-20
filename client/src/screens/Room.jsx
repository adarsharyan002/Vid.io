import {useEffect,useCallback,useState, lazy, Suspense } from 'react';
import { useSocket } from '../context/SocketProvide';
import { FaVideo, FaMicrophone,FaVideoSlash,FaMicrophoneSlash } from 'react-icons/fa';
import { MdCallEnd } from "react-icons/md";

import Peer from '../services/Peer';
import useCall from '../socket/useCall'
import useNegotiations from '../socket/useNegotiations';
import { useLocation } from 'react-router-dom';
const VideoPlayer = lazy(()=> import('../components/VideoPlayer'))

const Room = () => {

    const socket = useSocket();
    const location = useLocation();
    
    
    
    
    
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


const { handleUserJoined,
  handleCall,
  handleAcceptCall,
  handleRejectCall,
  handleIncomingCall,
  handleAcceptedCall,
  handleRejectedCall
  } = useCall(

    remoteSocketId,
    setRemoteSocketId,
    setRemoteStream,
    setRemoteUserName,
    setIncomingCall,
    setShowBar,
    setCalling,
    sendStreams,
    location

  );

  const {
    handleNegoNeeded,
    handleNegoNeedIncomming,
    handleNegoNeedFinal
  } =useNegotiations(remoteSocketId)





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
      
      const remoteVideoElement = document.getElementById('remoteVideo'); 
      if (remoteVideoElement) {
        remoteVideoElement.srcObject.getVideoTracks()[0].enabled = isEnabled;
      }
    }, []);
  
    const handleRemoteAudioToggle = useCallback(({ isEnabled }) => {
     
      const remoteAudioElement = document.getElementById('remoteAudio'); 
      if (remoteAudioElement) {
        remoteAudioElement.srcObject.getAudioTracks()[0].enabled = isEnabled;
      }
    }, []);
  
    
    
    

      useEffect(() => {
        Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
          Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
      }, [handleNegoNeeded]);


      

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
        socket.on("user:joined",handleUserJoined);
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
            socket.off("user:joined",handleUserJoined)
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("sendStreams", handleAcceptCall);

            socket.off("peer:nego:final", handleNegoNeedFinal);
            socket.off("call:reject", handleRejectedCall);
            socket.off('video:toggle', handleRemoteVideoToggle);
            socket.off('audio:toggle', handleRemoteAudioToggle);


        }
     },[socket,
       handleUserJoined, 
       handleIncomingCall,
        handleAcceptedCall, 
        handleNegoNeedIncomming, 
        handleNegoNeedFinal, 
        handleRejectedCall, 
        handleAcceptCall, 
        handleRemoteVideoToggle, 
        handleRemoteAudioToggle]
        
        )


    return (
        <div className='flex flex-col md:flex-row  justify-center w-full h-screen p-5 bg-gray-600'>

          {/* sidebar starts */}
        {showBar &&
          <div className='bg-blue-100 rounded-lg p-2 w-full md:w-1/4'>
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


            {!incomingCall 
            && remoteSocketId 
            && <button 
            className='w-full bg-blue-400 rounded-lg text-white h-10 mt-3' 
            onClick={()=>handleCall(remoteSocketId,setCalling,calling)} 
            disabled={calling}
            >
            {calling ? 'Calling...' : 'Call'}
              </button>
              
              }
            

             
            {incomingCall 
            && <div 
            className='flex gap-2 justify-center mt-2'>

              <button
               className='w-1/2 h-9 bg-red-500 rounded-lg text-white'
                onClick={handleAcceptCall}

              >Accept</button>


             <button
              className=' w-1/2 h-9 bg-red-500 rounded-lg text-white '
               onClick={handleRejectCall}
               >Leave Room</button>
               
               </div>
               
               }
             </div>
             
           }

         {/* sidebar ends */}

      {/* video player starts */}
             <div className=' w-full  flex justify-center space-x-3 '>
              
            <div className='flex flex-col justify-center content-center items-center gap-3'>
            <div className='flex flex-col md:flex-row gap-2'>
            
           {/* remoteVideo */}
             {
              !showBar && remoteStream && 
            
            
             <div className='flex  flex-col justify-center items-center '>
               <Suspense fallback={<div>Loading ...</div>}>
              <VideoPlayer stream={remoteStream}  mute={false} name={remoteUserName}/>
              </Suspense>
              
              </div>
              
              
             }

             {/* own video */}
              {myStream && (
                 
                 <div className='flex  flex-col w-1/4 sm:w-auto absolute bottom-32 right-8 sm:static  justify-center items-center  ' >
                   <Suspense>
                     <VideoPlayer  stream={myStream} mute={true} name={'You'}  />
                     </Suspense>
                 
                 </div>
             )}
             </div>

             {/* buttons start */}
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
        className='rounded-full p-2 text-white hover:bg-opacity-75'
        onClick={toggleVideo}
        aria-label="Toggle camera"
      >
        {isVideoEnabled ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
      </button>
      )}

      {myStream && (
      
         <button
         className='rounded-full p-2 text-white hover:bg-opacity-75'
         onClick={toggleAudio}
         aria-label="Toggle microphone"
       >
         {isAudioEnabled ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
       </button>
      )}
      </div>
      {/* buttons end */}

        </div>

        {/* fixed leave room button */}
        
    {!calling 
    && !incomingCall 
    && !remoteStream 
    && <button 
    className=' fixed top-3 right-4 text-white font-bold py-2 px-4  bg-red-500 rounded-lg  '
     onClick={handleRejectCall}
     >Leave Room</button>}

        </div>
        </div>
     );

};
 
export default Room;