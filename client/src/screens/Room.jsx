import {useEffect,useCallback,useState } from 'react';
import { useSocket } from '../context/SocketProvide';
import ReactPlayer from 'react-player'
import Peer from '../services/Peer';
import useCall from '../socket/useCall'
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

const Room = () => {

    const socket = useSocket();
    const location = useLocation();
    
    
    
    
    const {handleUserJoined,handleCall} = useCall();
    const [remoteSocketId,setRemoteSocketId] =useState(null);
    const [myStream,setStream] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);
    const [remoteUserName,setRemoteUserName] =useState(null)
   




    
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
    
      sendStreams();
    },[sendStreams])

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
    
    // setIncomingCall(true)
    


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
          sendStreams()
          
        },
        [sendStreams, socket]
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
        {!remoteStream &&
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
              
              </div>:<p>Room is Empty</p> }

            </div>
            {remoteSocketId?<button className='w-full bg-blue-400 rounded-lg text-white h-10 mt-3' onClick={()=>handleCall(remoteSocketId)}>Call</button>:null}
            

             

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
                
                height='100%'
                width='100%'
                url={myStream}/>
                
                </div>
                
                </div>
            )}
            { remoteStream && 
           
           
            <div className='flex flex-col justify-center items-center '>
             <VideoPlayer remoteStream={remoteStream}/>
             
             </div>
             
             
            }
            {remoteStream && <button className='fixed bottom-10 w-20 h-9 bg-red-500 rounded-lg text-white ' onClick={handleRejectCall}>End Call</button>}
        </div>
        </div>
        </div>
     );
}
 
export default Room;