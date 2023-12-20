
import { useCallback } from "react";
import Peer from '../services/Peer';
import { useSocket } from '../context/SocketProvide';

function useNegotiations(remoteSocketId){


    const socket = useSocket();


    const handleNegoNeeded = useCallback(async () => {
        const offer = await Peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      }, [remoteSocketId, socket]);

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




    return {

        handleNegoNeeded,
        handleNegoNeedIncomming,
        handleNegoNeedFinal

    }
}

export default useNegotiations