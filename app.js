require('dotenv').config();

const express = require('express')
const app = express();
const { socketHandler } = require('./socket/socketLogic');

const server = require("http").createServer(app);
const cors = require("cors");


//connect db
const connectDB = require('./db/connect')


//initializing socket
 const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});



//middlewares
app.use(cors());
app.use(express.json());


//routes

const port = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.send('Server is running')
})



const connectSocket = (socket)=>{
	socketHandler(io,socket)
}

io.on('connection',connectSocket);


const start = async () => {
	try {
	  await connectDB(process.env.MONGO_URI)
	  server.listen(port, () =>
		console.log(`Server is listening on port ${port}...`)
	  );
	} catch (error) {
	  console.log(error);
	}
  };
  
  start();
  

