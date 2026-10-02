// ===========================================
// UrbanMindAI History Dashboard
// Part 3A
// ===========================================

const API_URL = "http://127.0.0.1:5000/api/history";

let historyData = [];

let trafficChart;
let scoreChart;
let energyChart;
let wasteChart;


// ===============================
// Load Data
// ===============================

async function loadHistory() {

    try {

        const response = await fetch(API_URL);

        historyData = await response.json();

        updateCards();

        updateTable(historyData);

        createCharts();

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to Flask API.");

    }

}



// ===============================
// KPI Cards
// ===============================

function updateCards() {

    document.getElementById("trafficCount").innerHTML =
        historyData.length;

    if(historyData.length===0)
        return;

    let air=0;
    let energy=0;
    let waste=0;
    let score=0;

    historyData.forEach(item=>{

        air+=Number(item.air);

        energy+=Number(item.energy);

        waste+=Number(item.waste);

        score+=Number(item.score);

    });


    document.getElementById("airAvg").innerHTML=

        (air/historyData.length).toFixed(1);


    document.getElementById("energyAvg").innerHTML=

        (energy/historyData.length).toFixed(1)+"%";


    document.getElementById("wasteAvg").innerHTML=

        (waste/historyData.length).toFixed(1)+"%";


    document.getElementById("scoreAvg").innerHTML=

        (score/historyData.length).toFixed(1);

}


function updateSummary(){

    document.getElementById("totalRecords").innerHTML =
        historyData.length;

    let heavy = 0;

    let highestAQI = 0;

    let highestEnergy = 0;

    let bestScore = 0;

    historyData.forEach(item=>{

        if(String(item.traffic).toLowerCase().includes("heavy"))

            heavy++;

        highestAQI = Math.max(highestAQI, Number(item.air));

        highestEnergy = Math.max(highestEnergy, Number(item.energy));

        bestScore = Math.max(bestScore, Number(item.score));

    });

    document.getElementById("heavyTraffic").innerHTML = heavy;

    document.getElementById("highestAQI").innerHTML = highestAQI;

    document.getElementById("highestEnergy").innerHTML = highestEnergy + "%";

    document.getElementById("bestScore").innerHTML = bestScore;

}
function generateInsights(){

    const box = document.getElementById("insights");

    box.innerHTML = "";

    if(historyData.length===0){

        box.innerHTML="<div class='insightItem'>No history available.</div>";

        return;

    }

    let avgAQI=0;
    let avgEnergy=0;
    let avgWaste=0;
    let avgScore=0;

    historyData.forEach(item=>{

        avgAQI += Number(item.air);

        avgEnergy += Number(item.energy);

        avgWaste += Number(item.waste);

        avgScore += Number(item.score);

    });

    avgAQI /= historyData.length;
    avgEnergy /= historyData.length;
    avgWaste /= historyData.length;
    avgScore /= historyData.length;

    let insights=[];

    if(avgAQI>100)
        insights.push("🌫 Air quality is poor. Pollution control measures are recommended.");
    else
        insights.push("🌫 Air quality is within the safe range.");

    if(avgEnergy>80)
        insights.push("⚡ Energy usage is high. Consider optimizing power consumption.");
    else
        insights.push("⚡ Energy consumption is normal.");

    if(avgWaste>70)
        insights.push("🗑 Waste collection should be increased.");
    else
        insights.push("🗑 Waste management is operating normally.");

    if(avgScore>=90)
        insights.push("🏙 Overall Smart City performance is Excellent.");
    else if(avgScore>=80)
        insights.push("🏙 City performance is Good with room for improvement.");
    else
        insights.push("🏙 City performance needs attention.");

    insights.forEach(text=>{

        box.innerHTML +=
        `<div class="insightItem">${text}</div>`;

    });

}

// ===============================
// Status Color
// ===============================

function trafficColor(status){

    status=status.toLowerCase();

    if(status.includes("heavy"))

        return "<span class='high'>🔴 Heavy</span>";

    if(status.includes("moderate"))

        return "<span class='medium'>🟡 Moderate</span>";

    return "<span class='low'>🟢 Low</span>";

}


function badge(value){

    let text = String(value).toLowerCase();

    if(text.includes("low"))

        return '<span class="badge badge-low">🟢 Low</span>';

    if(text.includes("moderate"))

        return '<span class="badge badge-medium">🟡 Moderate</span>';

    if(text.includes("heavy"))

        return '<span class="badge badge-high">🔴 Heavy</span>';

    if(text.includes("warning"))

        return '<span class="badge badge-warning">🟠 Warning</span>';

    return '<span class="badge badge-normal">'+value+'</span>';

}

// ===============================
// Table
// ===============================
function updateTable(data){

    const table = document.getElementById("historyTable");

    table.innerHTML = "";

    data.forEach(item=>{

        table.innerHTML += `

<tr>

<td>${item.id}</td>

<td>${item.time}</td>

<td>${badge(item.traffic)}</td>

<td>${item.weather}</td>

<td>${item.air}</td>

<td>${item.energy}%</td>

<td>${item.waste}%</td>

<td>${badge(item.emergency)}</td>

<td>

<b style="color:#38bdf8">

${item.score}

</b>

</td>

</tr>

`;

    });

}

// ===============================
// Refresh
// ===============================
document.getElementById("refreshBtn").addEventListener("click", async () => {

    const btn = document.getElementById("refreshBtn");

    btn.innerHTML = "Loading...";

    await loadHistory();

    btn.innerHTML = "Refresh";

});
// ===========================================
// Part 3B
// Charts + CSV + Start
// ===========================================

// ===============================
// Charts
// ===============================

function createCharts() {

    const labels = historyData.map(item => item.time);

    // Destroy old charts
    if (trafficChart) trafficChart.destroy();
    if (scoreChart) scoreChart.destroy();
    if (energyChart) energyChart.destroy();
    if (wasteChart) wasteChart.destroy();

    // ==========================
    // Traffic Chart
    // ==========================

    trafficChart = new Chart(
        document.getElementById("trafficChart"),
        {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "City Score",
                    data: historyData.map(item => item.score),
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56,189,248,0.25)",
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: "#000"
                        }
                    }
                }
            }
        }
    );

    // ==========================
    // Score Chart
    // ==========================

    scoreChart = new Chart(
        document.getElementById("scoreChart"),
        {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "City Score",
                    data: historyData.map(item => item.score),
                    backgroundColor: "#2563eb"
                }]
            },
            options: {
                responsive: true
            }
        }
    );

    // ==========================
    // Energy Chart
    // ==========================

    energyChart = new Chart(
        document.getElementById("energyChart"),
        {
            type: "doughnut",
            data: {
                labels: ["Energy"],
                datasets: [{
                    data: [
                        historyData.reduce((a,b)=>a+Number(b.energy),0)
                        / historyData.length,
                        100 -
                        (
                        historyData.reduce((a,b)=>a+Number(b.energy),0)
                        / historyData.length
                        )
                    ],
                    backgroundColor:[
                        "#f59e0b",
                        "#e5e7eb"
                    ]
                }]
            }
        }
    );

    // ==========================
    // Waste Chart
    // ==========================

    wasteChart = new Chart(
        document.getElementById("wasteChart"),
        {
            type: "pie",
            data: {
                labels:["Waste","Remaining"],
                datasets:[{
                    data:[
                        historyData.reduce((a,b)=>a+Number(b.waste),0)
                        / historyData.length,
                        100-
                        (
                        historyData.reduce((a,b)=>a+Number(b.waste),0)
                        / historyData.length
                        )
                    ],
                    backgroundColor:[
                        "#8b5cf6",
                        "#cbd5e1"
                    ]
                }]
            }
        }
    );

}



// ===============================
// CSV Download
// ===============================
document.getElementById("downloadBtn").addEventListener("click", function () {

    if (historyData.length === 0) {

        alert("No history available.");

        return;

    }

    let csv = "";

    csv += Object.keys(historyData[0]).join(",");

    csv += "\n";

    historyData.forEach(row => {

        csv += Object.values(row).join(",");

        csv += "\n";

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "UrbanMindAI_History.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});
// ===============================
// Auto Refresh
// ===============================

setInterval(loadHistory,15000);



// ===============================
// Start
// ===============================

async function loadHistory() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API Error");
        }

        historyData = await response.json();

        console.log(historyData);

        if (!Array.isArray(historyData)) {
            historyData = [];
        }

        updateCards();
        updateSummary();
        generateInsights();
        updateTable(historyData);
        createCharts();

    }

    catch (err) {

        console.error(err);

        historyData = [];

        updateCards();
        updateTable([]);

        alert("Cannot load history data.");

    }

}