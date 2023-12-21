import ReactPlayer from 'react-player'


const VideoPlayer = ({stream,mute,name}) => {
    return ( 
        <>
        
        <h1 className='font-bold text-l md:text-xl absolute bottom-2 left-2 text-white'>{name}</h1>
        <div>
        <ReactPlayer

         className="border-4 border-gray-500 rounded-lg"
          playing
          muted={mute}
          height="100%"
          width="100%"
          url={stream}
        />
        </div>
       
      </>
    );
}
 
export default VideoPlayer;