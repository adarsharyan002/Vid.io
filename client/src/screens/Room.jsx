import {useEffect,useCallback,useState } from 'react';
import { useSocket } from '../context/SocketProvide';
import ReactPlayer from 'react-player'
import peer from '../services/peer';

const Room = () => {

    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] =useState(null);
    const [myStream,setStream] = useState(null);


    const handleUserJoined = useCallback(({email,id})=>{
         
          setRemoteSocketId(id);
          console.log(`email ${email} joined room`)
    },[])

    const handleCall = useCallback(async()=>{

        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
   setStream(stream);
    },[])

     useEffect(()=>{
        socket.on("user:joined",handleUserJoined);

        return ()=> {
            socket.off("user:joined",handleUserJoined)
        }
     },[socket,handleUserJoined])
    return (
        <div>
            <h1>Room</h1>
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
        </div>
     );
}
 
export default Room;