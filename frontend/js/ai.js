const API="http://127.0.0.1:5000";

async function sendQuestion(){

let input=document.getElementById("question");

let q=input.value.trim();

if(q=="") return;

let chat=document.getElementById("chatBox");

chat.innerHTML+=`<div class="user">${q}</div>`;

input.value="";

try{

let res=await fetch(API+"/api/chat?message="+encodeURIComponent(q));

let data=await res.json();

chat.innerHTML+=`<div class="bot">${data.answer}</div>`;

chat.scrollTop=chat.scrollHeight;

}

catch{

chat.innerHTML+=`<div class="bot">❌ Server Error</div>`;

}

}

document.getElementById("question").addEventListener("keydown",function(e){

if(e.key==="Enter"){

sendQuestion();

}

});
function newChat(){

    document.getElementById("chatBox").innerHTML = `
        <div class="bot">
            👋 Hello! I am UrbanMindAI Assistant.<br><br>
            Ask me about:
            <br>🚦 Traffic
            <br>🌫 Air Quality
            <br>🌤 Weather
            <br>⚡ Energy
            <br>🗑 Waste
            <br>🚨 Emergency
        </div>
    `;

    document.getElementById("question").value = "";

    document.getElementById("question").focus();

}