import { useCallback } from "react";

function useCall() {
  
   
    const handleUserJoined = useCallback((data,setRemoteSocketId)=>{
         
      const {email,id} = data;
        setRemoteSocketId(id);
        console.log(`email ${email} joined room`)
    },[])

  //   const handleCall = useCallback(async()=>{

       
  //     const offer = await Peer.getOffer();
  //     socket.emit("user:call",{to:remoteSocketId, offer})
     
  // },[socket,remoteSocketId])
  
  
    
  
    return {
      handleUserJoined
      
    };
  }

  export default useCall;
