import { useEffect,useState,useCallback } from "react";
import { useSocket } from "../context/SocketProvide";
import { useNavigate } from "react-router-dom";
import Logo from '../assests/logomain2.png'

const LobbyScreen = () => {

    const [email,setEmail] = useState('')
    const [room,setRoom] = useState('')
    const socket = useSocket();
    const navigate = useNavigate();
  

    const handleSubmitForm=useCallback((e)=>{
        e.preventDefault();
        socket.emit("room:join",{email,room});


    },[email,room,socket])
    const handleFullRoom=useCallback(({room})=>{

      console.log(`${room} is already full`)


    },[])

    const handleJoinRoom = useCallback(({room,remoteId,userName})=>{
       
         const data={remoteId,userName,room}
         navigate(`/room/${room}`,{state:data});
      

    },[navigate])

    const handleLogout =()=>{
      localStorage.clear();
      navigate('/')
    }

    //handling the event
    useEffect(()=>{
        socket.on("room:join",handleJoinRoom)
        socket.on("cannot:join",handleFullRoom)


        //deregister a register as we dont want multiple eventlisteners
        return ()=>{
            socket.off('room:join,handleJoinRoom')
            socket.on("cannot:join",handleFullRoom)

            
        }
    },[socket, handleJoinRoom, handleFullRoom])

    
    return ( 
  
<div className="bg-gradient-to-r from-gray-800 via-black to-blue-900 flex  min-h-screen items-center justify-center">
  <p onClick={handleLogout} className="fixed top-5 right-10 text-white cursor-pointer" >Logout</p>
<div className='fixed top-8 left-12 z-50 w-24'>
        <img src={Logo} alt='companyLogo'/>
       </div>
  <div className="relative flex flex-col rounded-xl p-4  bg-clip-border bg-transparent border-2 border-solid border-gray-600  text-white shadow-none">
    <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-white antialiased">
      Enter Details to Join Room
    </h4>
    
    <form onSubmit={handleSubmitForm} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
      <div className="mb-4 flex flex-col gap-6">
        <div className="relative h-11 w-full min-w-[200px]">
          <input
            className="peer h-full w-full rounded-md border border-gray-600 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=""
            type="text"
          
          // value={room}
          onChange={(e) => setRoom(e.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Room
          </label>
        </div>
        <div className="relative h-11 w-full min-w-[200px]">
          <input
            className="peer h-full w-full rounded-md border border-gray-600 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="text"
            
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Name
          </label>
        </div>
        
      </div>
     
      <button
        className="mt-6 block w-full select-none rounded-lg bg-buttonColor  py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white   transition-all hover:shadow-lg  focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        
        type="submit"
        data-ripple-light="true"
        
      >
        Join Room
      </button>
     
    </form>
   
  </div>
  
  
  
  
</div> 
    );
}
 
export default LobbyScreen;