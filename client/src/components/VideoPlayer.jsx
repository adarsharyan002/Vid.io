import ReactPlayer from 'react-player'


const VideoPlayer = ({stream,mute,name}) => {
    return ( 
        <>
        <h1 className='font-bold text-2xl'>{name}</h1>
        <div>
        <ReactPlayer

         className="border-4 border-blue-400 rounded-lg"
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