require('dotenv').config();
require('express-async-errors')

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

//error handler
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const verifyToken = require('./middlewares/authentication')

//imort router
const authRouter = require('./routes/authRoutes');

//middlewares
app.use(cors());
app.use(express.json());


//routes


app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.use('/api/v1/auth',authRouter)




//connecting socket
const connectSocket = (socket)=>{
	socketHandler(io,socket)
}

io.on('connection',connectSocket);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
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
  

