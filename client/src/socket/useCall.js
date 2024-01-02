import { useCallback } from "react";
import Peer from '../services/Peer';
import { useSocket } from '../context/SocketProvide';



function useCall(

  remoteSocketId,
  setRemoteSocketId,
  setRemoteStream,
  setRemoteUserName,
  setIncomingCall,
  setShowBar,
  setCalling,
  sendStreams,
  location
) {
  const socket = useSocket();

  
   
    const handleUserJoined = useCallback((data)=>{
         
      const {email,id} = data;
        setRemoteSocketId(id);
        setRemoteUserName(email);
        console.log(`email ${email} joined room`)
    },[setRemoteSocketId, setRemoteUserName])



    const handleCall = useCallback(async()=>{
      
      setCalling(true);
      const offer = await Peer.getOffer();
      socket.emit("user:call",{to:remoteSocketId, offer})
     
  },[remoteSocketId, setCalling, socket])


  const handleAcceptCall = useCallback(()=>{
    setShowBar(false)
    setIncomingCall(false)
    sendStreams();
    socket.emit('accepted:call:final',{to:remoteSocketId})
  },[remoteSocketId, sendStreams, setIncomingCall, setShowBar, socket])

  
  const handleRejectCall= useCallback(()=>{
    socket.emit("call:reject",{to:remoteSocketId,room:location.state.room})
    Peer.closeConnection();
    
        
    setRemoteStream(null);
   
    window.location.href = '/lobby';
   
  },[location.state.room, remoteSocketId, setRemoteStream, socket])

  const handleIncomingCall = useCallback(async({from,offer})=>{
    const ans = await Peer.getAnswer(offer)
    setRemoteSocketId(from);
    


 socket.emit("call:accepted",{to:from,ans})
 
 setIncomingCall(true)
 console.log('hello')
 


 },[setIncomingCall, setRemoteSocketId, socket])



 const handleAcceptedCall = useCallback(({from,ans})=>{
        Peer.setLocalDescription(ans);
        console.log('Call Accepted');
        sendStreams();
       //  socket.emit("sendStreams",{to:from})
        

 },[sendStreams])

 const handleRejectedCall =useCallback(()=>{
   Peer.closeConnection();
   
  
 setRemoteStream(null);

 socket.emit("leave:room",{room:location.state.room})


 window.location.href = '/lobby';

 },[location.state.room, setRemoteStream, socket])
    
  
    return {
      handleUserJoined,
      handleCall,
      handleAcceptCall,
      handleRejectCall,
      handleIncomingCall,
      handleAcceptedCall,
      handleRejectedCall
      
      
    };
  }

  export default useCall;
