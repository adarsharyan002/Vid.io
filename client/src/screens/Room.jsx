import {useEffect,useCallback,useState, lazy, Suspense } from 'react';
import { useSocket } from '../context/SocketProvide';
import { FaVideo, FaMicrophone,FaVideoSlash,FaMicrophoneSlash  } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";
import { MdCallEnd } from "react-icons/md";
import Logo from '../assests/logomain2.png'

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
        <div className='bg-gradient-to-r from-gray-800 via-black to-blue-900 flex flex-col md:flex-row  justify-center w-full h-screen p-5 gap-4  '>
         
         {!showBar && <div className='fixed top-8 left-12 z-50 w-24'>
        <img src={Logo} alt='companyLogo'/>
       </div>}

          {/* sidebar starts */}
        {showBar &&
          <div className='bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100  p-2 w-full md:w-1/4'>
            <div className='flex gap-3 content-center items-center m-4'>
            <div className=' w-16'>
        <img src={Logo} alt='companyLogo'/>
       </div>
            <h1 className='text-lg text-white font-bold'>
              Vid.io
            </h1>
            </div>
            
           
            <div className=' flex flex-col justify-center items-center w-full text-md font-bold  bg-gradient-to-r from-customBlue to-customBlue-darker h-auto p-3 rounded-lg'>
              <>
            {remoteSocketId?<div className='flex justify-center content-center items-center gap-2 text-white'>
              
            <FaRegCircleUser className='text-4xl'/>
              <p className='text-white'>{remoteUserName}</p>
              <div className='w-3 h-3 bg-green-500 rounded-full '></div>

              
              </div>
              
              :<p className='text-white'>Room is Empty</p>
              
              }

            </>
              

            


            {!incomingCall 
            && remoteSocketId 
            && <button 
            className='w-full bg-gray-600 rounded-lg text-white h-10 mt-3' 
            onClick={()=>handleCall(remoteSocketId,setCalling,calling)} 
            disabled={calling}
            >
            {calling ? 'Calling...' : 'Call'}
              </button>
              
              }

{!calling 
    && !incomingCall 
    && !remoteStream 
    && <button 
    className=' w-full text-white font-bold py-2 px-3  bg-red-500 rounded-lg  mt-2'
     onClick={handleRejectCall}
     >Leave Room</button>}
            

             
            {incomingCall 
            && <div 
            className='flex flex-col gap-2 justify-center mt-2 w-full'>

              <button
               className='w-full h-9 bg-gray-600 rounded-lg text-white'
                onClick={handleAcceptCall}

              >Accept</button>


             <button
              className=' w-full h-9 bg-red-500 rounded-lg text-white '
               onClick={handleRejectCall}
               >Leave Room</button>
               
               </div>
               
               }

             </div>
             </div>
             
           }
           

         {/* sidebar ends */}

      {/* video player starts */}
             <div className={'w-full flex  flex-col justify-center items-center gap-5 '}>
              
            
            <div 
             className={!remoteStream?'relative':'relative lg:w-[60vw] md:w-[75vw] sm:w-full'}
            //  style={remoteStream?{width:'60vw'}:null}
             >
            
           {/* remoteVideo */}
             {
              !showBar && remoteStream && 
            
            
             <div className='relative'>
               <Suspense fallback={<div>Loading ...</div>}>
              <VideoPlayer stream={remoteStream}  mute={false} name={remoteUserName}/>
              </Suspense>
              
              </div>
              
              
             }

             {/* own video */}
              {myStream && (
                 
                 <div className={showBar?'w-full':'w-3/12 absolute right-3 bottom-3'} >
                   <Suspense fallback={<div>Loading ...</div>}>
                     <VideoPlayer  stream={myStream} mute={true} name={''}  />
                     </Suspense>
                 
                 </div>
             )}
             </div>

             {/* buttons start */}
             <div className='flex gap-3 md:absolute bottom-14'>
            {remoteStream && !incomingCall &&
              <button
              className= 'rounded-full p-2  hover:bg-opacity-75 bg-red-500 text-white '
              onClick={handleRejectCall}
              aria-label="End call"
            >
              <MdCallEnd className="w-5 h-5" />
            </button>
            }
            {myStream && (
        
        <button
        className='rounded-full p-2 bg-slate-600 text-white hover:bg-opacity-75'
        onClick={toggleVideo}
        aria-label="Toggle camera"
      >
        {isVideoEnabled ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
      </button>
      )}

      {myStream && (
      
         <button
         className='rounded-full p-2 bg-slate-500 text-white hover:bg-opacity-75'
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
        
    {/* {!calling 
    && !incomingCall 
    && !remoteStream 
    && <button 
    className=' fixed top-6 right-7 text-white font-bold py-2 px-3  bg-red-500 rounded-lg  '
     onClick={handleRejectCall}
     >Leave Room</button>} */}

        </div>
       
     );

};
 
export default Room;