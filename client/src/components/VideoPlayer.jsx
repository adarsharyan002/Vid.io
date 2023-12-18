import ReactPlayer from 'react-player'


const VideoPlayer = ({remoteStream}) => {
    return ( 
        <>
        <h1 className='font-bold text-2xl'>Friend</h1>
        <div>
        <ReactPlayer

         className="border-4 border-blue-400 rounded-lg"
          playing
         
          height="100%"
          width="100%"
          url={remoteStream}
        />
        </div>
       
      </>
    );
}
 
export default VideoPlayer;