
import { createContext, useContext, useMemo } from "react";
import {io} from 'socket.io-client'

 const socketContext = createContext({});

 export const useSocket=()=>{
    const socket = useContext(socketContext);
    return socket;
 }

 export const SocketProvider = (props)=>{

    const socket = useMemo(()=> io("https://vid-io-api.onrender.com"),[]);
    


    return (
        <socketContext.Provider value={socket}>
            {props.children}
        </socketContext.Provider>
    )

 }