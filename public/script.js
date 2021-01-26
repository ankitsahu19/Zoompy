const socket = io();
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
let myVideoStream;


var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: '3030',
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);
    peer.on('call', function (call) {
        
            call.answer(stream); // Answer the call with an A/V stream.
            const video = document.createElement('video')
            call.on('stream', function (remoteStream) {
                // Show stream in some video/canvas element.
                addVideoStream(video, remoteStream)
            });
        })
    socket.on('user-connected', (id) => {
        connectToNewUser(id, stream);
    })

    let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })
  

peer.on("open", (id) => {

    socket.emit("join-room", ROOM_ID, id);
})


const connectToNewUser = (id, stream) => {
    console.log('New User is connected', id);

    const video = document.createElement('video')
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({ video: true, audio: true }, function (stream) {
        var call = peer.call(id, myVideoStream);
        call.on('stream', function (remoteStream) {
            addVideoStream(video, remoteStream)
        });
    }, function (err) {
        console.log('Failed to get local stream', err);
    });
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    })
    videoGrid.appendChild(video);
}


const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  } 

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  