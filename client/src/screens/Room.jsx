import {useEffect,useCallback,useState } from 'react';
import { useSocket } from '../context/SocketProvide';
import ReactPlayer from 'react-player'
import Peer from '../services/Peer';
import useCall from '../socket/useCall'
import { useLocation } from 'react-router-dom';

const Room = () => {

    const socket = useSocket();
    const location = useLocation();
    
    
    
    const {handleUserJoined,handleCall} = useCall();
    const [remoteSocketId,setRemoteSocketId] =useState(null);
    const [myStream,setStream] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);
    const [remoteUserName,setRemoteUserName] =useState(null)
    const [incomingCall,setIncomingCall]=useState(false)



    console.log(location.state)

    


    const sendStreams = useCallback(() => {
      for (const track of myStream.getTracks()) {
        Peer.peer.addTrack(track, myStream);
      }
    }, [myStream]);

    const handleAcceptCall = useCallback(()=>{
      setIncomingCall(false)
      sendStreams();
    },[sendStreams])

    // const handleRejectCall= useCallback(()=>{
    //   Peer.closeConnection();
    //   setRemoteStream(0);
    // },[])

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

    },[sendStreams])

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
          
        },
        [socket]
      );
    
      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await Peer.setLocalDescription(ans);
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
    socket.on("peer:nego:final", handleNegoNeedFinal);


        return ()=> {
            socket.off("user:joined",(data)=>handleUserJoined(data,setRemoteSocketId,setRemoteUserName))
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);

        }
     },[socket, handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegoNeedIncomming, handleNegoNeedFinal])
    return (
        <div className='flex justify-center w-full h-screen'>
          <div className='bg-blue-200 w-1/4'>
            <h1>Room</h1>
            {incomingCall && <button onClick={handleAcceptCall}>Accept Call</button>}
            {/* {incomingCall && <button onClick={handleRejectCall}>RejectCall</button>} */}

             {remoteSocketId?<h1>Connected</h1>:null}
             {remoteSocketId?<><button onClick={()=>handleCall(remoteSocketId)}>Call</button>:<p>{remoteUserName}</p></>:<p>Room is Empty</p> }
             </div>
             <div className='bg-gray-200 w-9/12  flex justify-center space-x-3 '>
            {myStream && (
                 
                <div className='flex flex-col justify-center items-center  border-4 divide-black' >
                    <h2 className='font-bold text-2xl'>My video</h2>
                <ReactPlayer 
                playing
                muted
                height='100%'
                width='100%'
                url={myStream}/>
                </div>
            )}
             {remoteStream && (
        <div className='flex flex-col justify-center items-center border-4'>
          <h1 className='font-bold text-2xl'>Friend</h1>
          <ReactPlayer
            playing
            muted
            height="100%"
            width="100%"
            url={remoteStream}
          />
        </div>
      )}
        </div>
        </div>
     );
}
 
export default Room;