//Server side
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
  origin:'http://localhost:3000',
  credentials:true,
  optionSuccessStatus:200 // For legacy browser support
}
const authRoutes = require('./routes/authRoutes');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

const http = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io')
const io = socketio(http);
const mongoDB = "mongodb+srv://satym:12345@cluster0.bsfak.mongodb.net/chat-database?retryWrites=true&w=majority";
mongoose.connect(mongoDB,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>console.log('connected')).catch(err=>console.log(err));
const {addUser,getUser, removeUser}= require('./helper');
const Message = require('./models/Message');
const PORT= process.env.PORT || 5000
const Room = require('./models/Room');

//setting cookies
app.get('/set-cookies',(req,res)=>{
  res.cookie('username','Tony');
  res.cookie('isAuthenticated',true,{maxAge: 24 * 60 * 60 * 1000 });
  res.send('cookies are set');
})
app.get('/get-cookies',(req,res)=>{
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
})
io.on('connection',(socket)=>{
    console.log(socket.id);
    Room.find().then(result=>{ //fetching data from mongoDB
      socket.emit('output-rooms',result);
    }) 
    socket.on('create-room',name =>{
        //console.log('Then room name recevied is ', name);//Receving Room name at server side 

        const room = new Room({name}); //Creating new room
        room.save().then(result=>{
          io.emit('room-created',result)
        }) //emiting result to all the client
    })
    socket.on('join',({name,room_id,user_id})=>{
      const {error,user}= addUser({
        socket_id:socket.id,
        name,
        room_id,
        user_id
      })
      socket.join(room_id);
      if(error){
        console.log('join error',error);
      }
      else{
        console.log('join user',user);
      }
    })
    socket.on('sendMessage',(message,room_id,callback)=>{
      const user = getUser(socket.id);
      const msgToStore = {
        name:user.name,
        user_id:user.user_id,
        room_id,
        text:message
      }
      //saving msg to server
      console.log('message',msgToStore);
      const msg = new Message(msgToStore);
      msg.save().then(result => { 

        io.to(room_id).emit('message',result); //emit these msg to all the users
        callback();
      })
    })
    socket.on('get-messages-history', room_id => {
      Message.find({ room_id }).then(result => {
          socket.emit('output-messages', result)
      })
  })
    socket.on('disconnect',()=>{
      const user = removeUser(socket.id);
    }) //whenever user disconnect browser it will remove user
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});