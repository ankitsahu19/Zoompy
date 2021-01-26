
const express = require('express');
const app = express()

const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');

app.use(express.static('public'))


const {v4: uuidV4} = require('uuid');

app.get('/', (req,res) => {
    res.redirect(`/${uuidV4()}`)
    console.log(uuidV4());
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})
  
io.on('connection', socket => {
    socket.on('join-room', (roomid,id) => {
        socket.join(roomid)
        console.log("Joined Room, id",roomid,id)
        socket.to(roomid).broadcast.emit('user-connected',id);
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomid).emit('createMessage', message)
        });
    })


})


server.listen(process.env.PORT||3030)