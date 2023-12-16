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



    const handleCall = useCallback(async(remoteSocketId,setCalling,calling)=>{
      
      setCalling(true);
      const offer = await Peer.getOffer();
      socket.emit("user:call",{to:remoteSocketId, offer})
     
  },[socket])



  
    
  
    return {
      handleUserJoined,
      handleCall,
      
      
    };
  }

  export default useCall;
