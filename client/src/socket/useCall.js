import { useCallback } from "react";
import Peer from '../services/Peer';
import { useSocket } from '../context/SocketProvide';



function useCall() {
  const socket = useSocket();

  
   
    const handleUserJoined = useCallback((data,setRemoteSocketId,setRemoteUserName)=>{
         
      const {email,id} = data;
        setRemoteSocketId(id);
        setRemoteUserName(email);
        console.log(`email ${email} joined room`)
    },[])



    const handleCall = useCallback(async(remoteSocketId)=>{

      const offer = await Peer.getOffer();
      socket.emit("user:call",{to:remoteSocketId, offer})
     
  },[socket])


//   const handleIncomingCall = useCallback(async(data,setRemoteSocketId)=>{

//     const {from,offer} = data;
//     const ans = await Peer.getAnswer(offer)
//     setRemoteSocketId(from);

//  //    const stream = await navigator.mediaDevices.getUserMedia({
//  //     audio:true,
//  //     video:true
//  // })
//  // setStream(stream);
//  socket.emit("call:accepted",{to:from,ans})


//  },[socket])
  
  
    
  
    return {
      handleUserJoined,
      handleCall,
      // handleIncomingCall
      
    };
  }

  export default useCall;
