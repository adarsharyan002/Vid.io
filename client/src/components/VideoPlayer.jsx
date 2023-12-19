import ReactPlayer from 'react-player'


const VideoPlayer = ({stream,muted}) => {
    return ( 
        <>
        <h1 className='font-bold text-2xl'>Video</h1>
        <div>
        <ReactPlayer

         className="border-4 border-blue-400 rounded-lg"
          playing
          
          height="100%"
          width="100%"
          url={stream}
        />
        </div>
       
      </>
    );
}
 
export default VideoPlayer;