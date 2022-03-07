const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")
const typingBox = document.getElementById("typingBox")
const uploadImg = document.getElementById("upload")


const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

socket.emit("joinRoom", {username, room})

socket.on("usersRoom", ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on("message", message =>{
    outputMessage(message);

    //Scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on("upload", (image)=>{
    upload(image)

    chatMessages.scrollTop = chatMessages.scrollHeight;
})


socket.on("typing", user =>{
    typing(user)
})

chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    //Get message 
    const msg = e.target.elements.msg.value

    socket.emit("chatMessage", msg); 

    //Clear input 
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

uploadImg.addEventListener("submit", (e)=>{
    e.preventDefault()
    socket.emit("imgUpload", e.target.elements.image.files[0]);     
    e.target.elements.image.value = ""
})

chatForm.addEventListener("keypress", ()=>{
    socket.emit("typing", username)
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add("message")
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`
    typingBox.innerHTML = ""
    document.querySelector(".chat-messages").appendChild(div)
    
}

function outputRoomName(room){
    roomName.innerText = room
}

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `
}

function typing(user){
    typingBox.innerHTML = `<p><b>${user}</b> is typing...</p>`
    setTimeout(() => {
        typingBox.innerHTML = ""
    }, 6000);
}

function upload(url){
    const div = document.createElement('div');
    div.classList.add("upload")
    div.innerHTML = `<img src="../images/${url}.jpg" width ="450 px" />`
    document.querySelector(".chat-messages").appendChild(div)
}