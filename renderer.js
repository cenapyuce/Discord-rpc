// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const btn = document.getElementById('debug');
const btntoinfo = document.getElementById('debug-info');
btn.addEventListener('click', () => {
    if(btntoinfo.hidden) {
        btntoinfo.hidden = false;
    } else {
        btntoinfo.hidden = true;
    }
});

const ws = new WebSocket('ws://localhost:3000', 'protocolOne');

ws.onopen = () => {
    console.log('connected');
}

ws.onmessage = (event) => {
    console.log(event.data);
    document.getElementById("status").innerHTML = event.data;
}

const savebtn = document.getElementById('save');
savebtn.addEventListener('click', () => {
    ws.send(document.getElementById('id').value+"&"+document.getElementById('details').value+"&"+document.getElementById("state").value+"&"+document.getElementById('largeimgkey').value+"&"+document.getElementById("largeimgtext").value);
});
