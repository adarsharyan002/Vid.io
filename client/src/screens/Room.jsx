import {useEffect,useCallback,useState, lazy, Suspense } from 'react';
import { useSocket } from '../context/SocketProvide';
import ReactPlayer from 'react-player'
import Peer from '../services/peer';
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
   




    
    console.log(remoteStream)
    console.log(myStream)

  


    const sendStreams = useCallback(() => {
      try {
        if (myStream && Peer.peer) {
          const existingSenders = Peer.peer.getSenders();
    
          for (const track of myStream.getTracks()) {
            let trackExists = false;
    
            for (const sender of existingSenders) {
              if (sender.track === track) {
                trackExists = true;
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



        return ()=> {
            socket.off("user:joined",(data)=>handleUserJoined(data,setRemoteSocketId,setRemoteUserName))
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.on("sendStreams", handleAcceptCall);

      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:reject", handleRejectedCall);


        }
     },[socket, handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegoNeedIncomming, handleNegoNeedFinal, handleRejectedCall, handleAcceptCall])
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
              

            <div className='flex justify-center content-center items-center gap-3'>
            {myStream && (
                 
                <div className='flex flex-col justify-center items-center  ' >
                    <h2 className='font-bold text-2xl'>My video</h2>
                    <div>
                <ReactPlayer 
                className='border-4 border-blue-400 rounded-lg'
                playing
                muted
                height='100%'
                width='100%'
                url={myStream}/>
                
                </div>
                
                </div>
            )}
            { !showBar && remoteStream && 
           
           
            <div className='flex flex-col justify-center items-center '>
              <Suspense fallback={<div>Loading ...</div>}>
             <VideoPlayer remoteStream={remoteStream}/>
             </Suspense>
             
             </div>
             
             
            }
            {remoteStream && !incomingCall && <button className='fixed bottom-10 w-20 h-9 bg-red-500 rounded-lg text-white ' onClick={handleRejectCall}>End Call</button>}
        </div>
        
{!calling && !incomingCall && !remoteStream && <button className=' w-1/12  justify-center content-center items-center w-45 h-9 bg-red-500 rounded-lg text-white ' onClick={handleRejectCall}>Leave Room</button>}
        </div>
        </div>
     );
}
 
export default Room;