

// ================================
// Clock
// ================================

function updateClock(){

    let now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString();


    document.getElementById("date").innerHTML =
        now.toDateString();

}


setInterval(updateClock,1000);

updateClock();





// ================================
// Backend API
// ================================

const API="http://127.0.0.1:5000";





// ================================
// Charts
// ================================


let trafficChart;
let airChart;
let energyChart;
let wasteChart;





function createCharts(){


trafficChart = new Chart(
document.getElementById("trafficChart"),
{

type:"line",

data:{

labels:[
"8AM",
"10AM",
"12PM",
"2PM",
"4PM"
],

datasets:[{

label:"Traffic Level",

data:[
30,
45,
60,
80,
50
]

}]

}

});






airChart = new Chart(
document.getElementById("airChart"),
{

type:"line",

data:{

labels:[
"Morning",
"Noon",
"Evening",
"Night"
],

datasets:[{

label:"AQI",

data:[
50,
80,
120,
70
]

}]

}

});







energyChart = new Chart(
document.getElementById("energyChart"),
{

type:"bar",

data:{

labels:[
"Morning",
"Noon",
"Evening",
"Night"
],

datasets:[{

label:"Energy %",

data:[
40,
60,
80,
50
]

}]

}

});







wasteChart = new Chart(
document.getElementById("wasteChart"),
{

type:"doughnut",

data:{

labels:[
"Low",
"Medium",
"High"
],

datasets:[{

label:"Waste",

data:[
30,
40,
30
]

}]

}

});


}


// =====================================
// Load City Data
// =====================================


async function loadCityData(){


try{


let prediction =
await fetch(API+"/api/predict")
.then(r=>r.json());



let air =
await fetch(API+"/api/air")
.then(r=>r.json());



let weather =
await fetch(API+"/api/weather")
.then(r=>r.json());



let energy =
await fetch(API+"/api/energy")
.then(r=>r.json());



let waste =
await fetch(API+"/api/waste")
.then(r=>r.json());



let emergency =
await fetch(API+"/api/emergency")
.then(r=>r.json());





// Traffic

document.getElementById("prediction").innerHTML =
prediction.prediction;



document.getElementById("confidence").innerHTML =
"🎯 Confidence : 85%";





// Air

document.getElementById("air").innerHTML =

"AQI : "
+
air.aqi
+
"<br>"
+
air.status;

// Weather

document.getElementById("weather").innerHTML =

"🌤 "
+
weather.weather;

// Energy

document.getElementById("energy").innerHTML =

energy.status
+
"<br>"
+
"⚡ "
+

energy.usage
+
"%";
// Waste

document.getElementById("waste").innerHTML =

waste.status
+
"<br>"
+
waste.level
+
"%";






// Status

document.getElementById("trafficStatus").innerHTML =
"🟢 Online";



document.getElementById("airStatus").innerHTML =

air.aqi > 120 ?
"🔴 Warning" :
"🟢 Normal";



document.getElementById("energyStatus").innerHTML =

energy.usage > 80 ?
"🟠 High" :
"🟢 Normal";



document.getElementById("wasteStatus").innerHTML =

waste.level > 70 ?
"🔴 Full" :
"🟢 Normal";






updateCharts(
air,
energy,
waste
);



}

catch(error){

console.log(
"City Data Error",
error
);


}


}







// =====================================
// Update Charts
// =====================================


function updateCharts(
air,
energy,
waste
){


if(airChart){


airChart.data.datasets[0].data =

[
40,
70,
air.aqi,
90
];


airChart.update();


}





if(energyChart){


energyChart.data.datasets[0].data =

[
40,
energy.usage,
70,
50
];


energyChart.update();


}





if(wasteChart){


wasteChart.data.datasets[0].data =

[
30,
waste.level,
20
];


wasteChart.update();


}


}


// =====================================
// AI CITY BRAIN
// =====================================


async function loadBrain(){


try{


let data = await fetch(API+"/api/brain")
.then(r=>r.json());



let box =
document.getElementById("brain");



box.innerHTML="";



data.brain.forEach(message=>{


let div =
document.createElement("div");



div.className =
"brain-message";



div.innerHTML =
"🤖 " + message;



box.appendChild(div);



});



}

catch(error){

console.log(
"Brain Error",
error
);

}


}








// =====================================
// Digital Twin Map
// =====================================


function loadMap(){



let map =
L.map("map")
.setView(
[
11.1271,
78.6569
],
7
);




L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:
"&copy; OpenStreetMap"

}

).addTo(map);




let zones=[


{
name:"🚦 Traffic AI Zone",
lat:11.0168,
lon:76.9558
},


{
name:"🌫 Air Quality Zone",
lat:13.0827,
lon:80.2707
},



{
name:"⚡ Energy Zone",
lat:11.6643,
lon:78.1460
},



{
name:"🚑 Emergency Zone",
lat:10.7905,
lon:78.7047
}


];




zones.forEach(zone=>{


L.marker(
[
zone.lat,
zone.lon
]

)

.addTo(map)

.bindPopup(

"🏙 UrbanMindAI<br>"
+
zone.name

);


});


}








// =====================================
// City Score
// =====================================


async function loadCityScore(){


try{


let data =
await fetch(API+"/api/city_score")
.then(r=>r.json());



document.getElementById("cityScore").innerHTML =

data.score
+
" /100";



document.getElementById("cityStatus").innerHTML =

data.status;



}

catch(error){

console.log(error);

}


}


// =====================================
// REPORT BUTTON
// =====================================
document.getElementById("reportBtn").addEventListener("click", function () {

    const report = `
==============================
UrbanMindAI Smart City Report
==============================

Date: ${new Date().toLocaleString()}

Traffic:
Monitoring Active

Air Quality:
AQI Monitoring Active

Weather:
Weather Monitoring Active

Energy:
Power Consumption Monitoring Active

Waste:
Waste Collection Monitoring Active

Emergency:
Emergency System Online

Generated by UrbanMindAI
`;

    const blob = new Blob([report], { type: "text/plain" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "UrbanMindAI_Report.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

});
// =====================================
// START DASHBOARD
// =====================================

window.onload=function(){

if(document.getElementById("trafficChart")){
    createCharts();
}

if(document.getElementById("prediction")){
    loadCityData();
}

if(document.getElementById("brain")){
    loadBrain();
}

if(document.getElementById("cityScore")){
    loadCityScore();
}

if(document.getElementById("map")){
    loadMap();
}

}



setInterval(
loadCityData,
10000
);



setInterval(
loadBrain,
10000
);



setInterval(
loadCityScore,
15000
);


/* ==========================================
   UrbanMindAI Assistant Chat
========================================== */


async function askAI(){

    let input = document.getElementById("aiQuestion");

    let chatBox = document.getElementById("aiResponse");


    let question = input.value.trim();


    if(question === ""){
        return;
    }


    chatBox.innerHTML = "🤖 Thinking...";


    try{

        let response = await fetch("/ask_ai",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                question:question

            })

        });


        let data = await response.json();


        chatBox.innerHTML =
        data.answer.replace(/\n/g,"<br>");


    }


    catch(error){

        chatBox.innerHTML =
        "❌ AI Assistant connection failed.";

        console.log(error);

    }


    input.value="";

}
// 
// =====================================
// Sidebar AI Assistant Navigation
// =====================================

function showModule(module){


let panel=document.getElementById("modulePanel");

let title=document.getElementById("moduleTitle");

let content=document.getElementById("moduleContent");


panel.style.display="block";


title.innerHTML="🏙 "+module;



let data={


"Traffic":
"🚦 Traffic Intelligence<br><br>Status: High Traffic Expected<br>Confidence: 85%<br><br>AI Recommendation: Optimize traffic signals.",


"Air Quality":
"🌫 Air Quality<br><br>AQI monitoring active.<br><br>AI Recommendation: Control pollution sources.",


"Weather":
"🌤 Weather Intelligence<br><br>Weather monitoring active.",


"Energy":
"⚡ Energy Intelligence<br><br>Power usage analysis running.",


"Waste":
"🗑 Waste Intelligence<br><br>Smart waste monitoring active.",


"Emergency":
"🚨 Emergency System<br><br>Emergency agents online.",


"Reports":
`
<h3>📄 AI Reports</h3>

<p>Generate and download the latest UrbanMindAI report.</p>

<br>

<button onclick="downloadReport()"
style="
padding:10px 20px;
background:#2563eb;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
">
📥 Download Report
</button>
`
};


content.innerHTML=data[module];


}
// =====================================
// Close Module Panel
// =====================================

function closeModule(){

    document.getElementById("modulePanel").style.display="none";

}
// =====================================
// AI Assistant Floating Panel
// =====================================

function openAssistant() {

    const panel = document.getElementById("modulePanel");

    panel.style.display = "block";

    document.getElementById("moduleTitle").innerHTML =
    "🤖 UrbanMindAI Assistant";

    document.getElementById("moduleContent").innerHTML = `

        <div id="assistantAnswer">
        🤖 Hello! Ask me about traffic, weather, air quality, energy, waste or emergency.
        </div>

        <br>

        <input id="panelQuestion"
               placeholder="Ask anything..."
               style="width:100%;padding:10px;">

        <br><br>

        <button id="panelSend">
        Send
        </button>

    `;

    document.getElementById("panelSend").onclick = panelAskAI;

    document.getElementById("panelQuestion").addEventListener("keydown",function(e){

        if(e.key==="Enter"){
            panelAskAI();
        }

    });

}
function downloadReport(){

    const report = `
==============================
UrbanMindAI Smart City Report
==============================

Date: ${new Date().toLocaleString()}

Traffic : Monitoring Active
Air Quality : Good
Weather : Stable
Energy : Normal
Waste : Under Monitoring
Emergency : No Active Alerts

Generated by UrbanMindAI
`;

    const blob = new Blob([report], {type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "UrbanMindAI_Report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

