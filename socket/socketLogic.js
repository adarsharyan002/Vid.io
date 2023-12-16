
const mapIdToEmail = new Map();
const mapEmailToId = new Map();

 const socketHandler =(io,socket)=>{
          

    

        socket.emit("me", socket.id);
    
        socket.on("room:join", ({email,room}) => {
            // roomSize = io.sockets.adapter.rooms[room]?.length;
            // roomSize=io.sockets.adapter.rooms.get(room)?.length
            const roomSize=mapEmailToId.size;
            console.log(roomSize)
           
          if(roomSize < 2) {
           mapEmailToId.set(email,socket.id);
           mapIdToEmail.set(socket.id,email);
           io.to(room).emit("user:joined",{email,id:socket.id})
           
            socket.join(room);
            

           let [remoteId] = mapIdToEmail.keys();
           let userName = mapIdToEmail.get(remoteId);

           if(remoteId == socket.id)remoteId=0; 
           
           io.to(socket.id).emit("room:join",{room,remoteId,userName});
        }
        else io.to(socket.id).emit("cannot:join",{room})
        
    
        });
    
        socket.on("user:call", ({ to,offer }) => {
            io.to(to).emit("incoming:call", { from:socket.id,offer });
        });
    
        socket.on("call:accepted", ({to,ans}) => {
            io.to(to).emit("call:accepted", { from:socket.id,ans });
        });
        socket.on("sendStreams",({to})=>{
            io.to(to).emit("sendStreams",{from:socket.id})
        });
        socket.on("peer:nego:needed", ({to,offer}) => {
            io.to(to).emit("peer:nego:needed", { from:socket.id,offer });
        });
        socket.on("peer:nego:done", ({to,ans}) => {
            io.to(to).emit("peer:nego:final", { from:socket.id,ans });
        });
        socket.on("call:reject", ({to,room}) => {
            socket.leave(room);
            mapEmailToId.clear();
            mapIdToEmail.clear();
           
            io.to(to).emit("call:reject", { from:socket.id });
        });
        socket.on("leave:room", ({room}) => {
            socket.leave(room);
           
        });
}

module.exports={
    socketHandler
}