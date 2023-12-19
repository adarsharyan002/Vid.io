
const mapIdToEmail = new Map();
const mapEmailToId = new Map();

 const socketHandler =(io,socket)=>{
          

    

        socket.emit("me", socket.id);
    
        socket.on("room:join", ({email,room}) => {
            let roomSize
            
            if(io.of("/").adapter.rooms.has(room)){
                const rooms = io.of("/").adapter.rooms;
                roomSize = rooms.get(room).size

            }else roomSize =0
            



            
            
           
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
        socket.on("accepted:call:final",({to}) => {
             io.to(to).emit("accepted:call:final",{from:socket.id});
        })
        socket.on("peer:nego:needed", ({to,offer}) => {
            io.to(to).emit("peer:nego:needed", { from:socket.id,offer });
        });
        socket.on("peer:nego:done", ({to,ans}) => {
            io.to(to).emit("peer:nego:final", { from:socket.id,ans });
        });

        socket.on('video:toggle', ({ isEnabled }) => {
            // Broadcast to all other participants about video status change
            socket.broadcast.emit('video:toggle', { isEnabled });
          });
        
          socket.on('audio:toggle', ({ isEnabled }) => {
            // Broadcast to all other participants about audio status change
            socket.broadcast.emit('audio:toggle', { isEnabled });
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