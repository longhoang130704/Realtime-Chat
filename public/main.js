const socket = io();

const clientTotalElement = document.getElementById('client-total')
const messageInputElement = document.getElementById('message-input')
const nameInputElement = document.getElementById('name-input')
const messageFormElement = document.getElementById('message-form')
const messageContainerElement = document.getElementById('message-container')

socket.on('totalClient', (data) => {
    clientTotalElement.innerText = `Total-clients: ${data}`
});

socket.on('chatMessage', data => {
    addMessagetoUI(false, data)    
})

socket.on('status', (data) => {   
    clearStatus()
    const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.status}</p>
        </li>
    `
    messageContainerElement.innerHTML += element
})

messageFormElement.addEventListener('submit', (event) => {
    event.preventDefault()
    sendMessage()
})

function sendMessage() {
    if (messageInputElement.value === '') return
    const data = {
        name: nameInputElement.value,
        message: messageInputElement.value,
        time: new Date(),
    }
    socket.emit('chatMessage', data)
    addMessagetoUI(true, data)
    messageInputElement.value = ''
}

function addMessagetoUI(isOwner, data) {
    clearStatus()
    const element =`
        <li class="${isOwner ? "message-right" : "message-left"}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.time).fromNow()}</span>
          </p>
        </li>
    `
    messageContainerElement.innerHTML += element
}

function scrollToBottom() {
    messageContainerElement.scrollTo(0, messageContainerElement.scrollHeight)
}

messageInputElement.addEventListener('focus', (event) => {
    socket.emit('status', {
        status: `${nameInputElement.value} is typing`
    })
})

messageInputElement.addEventListener('keypress', (event) => {
    socket.emit('status', {
        status: `${nameInputElement.value} is typing`
    })
})

messageInputElement.addEventListener('blur', (event) => {
    socket.emit('status', {
        status: '',
    })
})

function clearStatus() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        console.log('tao o day'); // Ghi log để debug
        element.parentNode.removeChild(element);
    });
}
