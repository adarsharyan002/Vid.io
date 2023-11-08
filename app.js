const express = require('express')
const app = express();

const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});


//middlewares
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.send('Server is running')
})

//socket

//mapping
const mapIdToEmail = new Map();
const mapEmailToId = new Map();

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("room:join", (data) => {
	   const {email,room} =data;
	   mapEmailToId.set(email,socket.id);
	   mapIdToEmail.set(socket.id,email);
	   io.to(room).emit("user:joined",{email,id:socket.id})
	   socket.join(room);
	   io.to(socket.id).emit("room:join",data);
	

	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})