import {useEffect,useCallback,useState } from 'react';
import { useSocket } from '../context/SocketProvide';
import ReactPlayer from 'react-player'
import Peer from '../services/peer';

const Room = () => {

    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] =useState(null);
    const [myStream,setStream] = useState(null);
    const [remoteStream,setRemoteStream] = useState(null);




    const handleUserJoined = useCallback(({email,id})=>{
         
          setRemoteSocketId(id);
          console.log(`email ${email} joined room`)
    },[])

    const handleCall = useCallback(async()=>{

        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })

        const offer = await Peer.getOffer();
        socket.emit("user:call",{to:remoteSocketId, offer})
       setStream(stream);
    },[socket,remoteSocketId])

    const handleIncomingCall = useCallback(async({from,offer})=>{
       const ans = await Peer.getAnswer(offer)
       setRemoteSocketId(from);

       const stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
    })
    setStream(stream);
    socket.emit("call:accepted",{to:from,ans})

    },[socket])

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
          Peer.peer.addTrack(track, myStream);
        }
      }, [myStream]);

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
    socket.on("peer:nego:final", handleNegoNeedFinal);


        return ()=> {
            socket.off("user:joined",handleUserJoined)
            socket.off("incoming:call",handleIncomingCall);
            socket.off("call:accepted",handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);

        }
     },[socket, handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegoNeedIncomming, handleNegoNeedFinal])
    return (
        <div>
            <h1>Room</h1>
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
             {remoteSocketId?<h1>Connected</h1>:null}
             {remoteSocketId && <button onClick={handleCall}>Call</button>}
            {myStream && (
                 
                <div>
                    <h2>My video</h2>
                <ReactPlayer 
                playing
                muted
                height='200px'
                width='300px'
                url={myStream}/>
                </div>
            )}
             {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="200px"
            width="400px"
            url={remoteStream}
          />
        </>
      )}
        </div>
     );
}
 
export default Room;