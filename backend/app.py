from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask import request, jsonify
import os
import datetime
import random
import sqlite3
from database import (
    create_table,
    insert_data,
    get_history
)


# ===============================
# Agents
# ===============================

from agents.traffic_agent import TrafficAgent
from agents.weather_agent import WeatherAgent
from agents.air_quality_agent import AirQualityAgent
from agents.energy_agent import EnergyAgent
from agents.waste_agent import WasteAgent
from agents.emergency_agent import EmergencyAgent



# ===============================
# ML Model
# ===============================

try:

    from ml.traffic_prediction import predict_traffic

    print("✅ ML Traffic Model Loaded")


except Exception as e:

    print("❌ ML Loading Error:", e)

    predict_traffic = None




# ===============================
# Decision Engine
# ===============================

try:

    from services.decision_engine import DecisionEngine

    print("✅ AI City Brain Loaded")


except Exception as e:

    print("❌ Decision Engine Error:", e)

    DecisionEngine = None




# ===============================
# Flask Setup
# ===============================

app = Flask(__name__)

CORS(app)


create_table()




# ===============================
# Initialize Agents
# ===============================

traffic_agent = TrafficAgent()

weather_agent = WeatherAgent()

air_agent = AirQualityAgent()

energy_agent = EnergyAgent()

waste_agent = WasteAgent()

emergency_agent = EmergencyAgent()



if DecisionEngine:

    decision_engine = DecisionEngine()

else:

    decision_engine = None




# ===============================
# Frontend
# ===============================

FRONTEND_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "..",
    "frontend"
)





# ===============================
# Frontend Routes
# ===============================


@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_FOLDER,
        "index.html"
    )



@app.route("/css/<path:file>")
def css(file):

    return send_from_directory(
        os.path.join(
            FRONTEND_FOLDER,
            "css"
        ),
        file
    )



@app.route("/js/<path:file>")
def js(file):

    return send_from_directory(
        os.path.join(
            FRONTEND_FOLDER,
            "js"
        ),
        file
    )




# ===============================
# System Status
# ===============================


@app.route("/api/status")
def status():

    return jsonify({

        "system":"UrbanMind AI",

        "status":"Running",

        "time":
        str(datetime.datetime.now())

    })





# ===============================
# Agent APIs
# ===============================


@app.route("/api/traffic")
def traffic():

    return jsonify({

        "traffic":
        traffic_agent.get_traffic_status()

    })



@app.route("/api/weather")
def weather():

    return jsonify({

        "weather":
        weather_agent.get_weather()

    })



@app.route("/api/air")
def air():

    return jsonify(
        air_agent.get_air_quality()
    )



@app.route("/api/energy")
def energy():

    return jsonify(
        energy_agent.get_energy_status()
    )



@app.route("/api/waste")
def waste():

    return jsonify(
        waste_agent.get_waste_status()
    )



@app.route("/api/emergency")
def emergency():

    return jsonify(
        emergency_agent.get_emergency_status()
    )

@app.route("/api/history")
def api_history():

    conn = sqlite3.connect("city_data.db")
    conn.row_factory = sqlite3.Row

    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM city_history
        ORDER BY id DESC
    """)

    rows = cur.fetchall()

    conn.close()

    return jsonify([dict(i) for i in rows])
# ===============================
# ML Traffic Prediction
# ===============================


@app.route("/api/predict")
def predict():


    if predict_traffic is None:

        return jsonify({

            "prediction":
            "ML Model Not Ready"

        })



    try:


        hour = datetime.datetime.now().hour

        weather = random.choice(
[
"Sunny",
"Cloudy",
"Rain"
]
)

        day_type = "Weekday"


        vehicle_count = random.randint(
            100,
            550
        )



        result = predict_traffic(

            hour,

            weather,

            day_type,

            vehicle_count

        )



        return jsonify({

            "prediction": result,

            "details":{

                "hour":hour,

                "weather":weather,

                "vehicles":vehicle_count

            }

        })



    except Exception as e:


        return jsonify({

            "prediction":
            "Prediction Error",

            "error":
            str(e)

        })






# ===============================
# AI CITY BRAIN
# ===============================


@app.route("/api/brain")
def brain():


    traffic = traffic_agent.get_traffic_status()

    weather = weather_agent.get_weather()

    air = air_agent.get_air_quality()

    energy = energy_agent.get_energy_status()

    waste = waste_agent.get_waste_status()

    emergency = emergency_agent.get_emergency_status()



    # Decision Engine

    if decision_engine:


        messages = decision_engine.analyze(

            traffic,

            air,

            energy,

            waste,

            emergency

        )


    else:

        messages = [

            "🤖 AI Brain Running"

        ]



    # Save history

    try:


        insert_data(

            traffic,

            weather,

            air["aqi"],

            energy["usage"],

            waste["level"],

            emergency["level"],

            random.randint(75,98)

        )


    except Exception as e:

        print(
            "Database Error:",
            e
        )



    return jsonify({

        "brain":messages

    })






# ===============================
# CITY SCORE
# ===============================


@app.route("/api/city_score")
def city_score():


    score = random.randint(
        75,
        98
    )


    if score >= 90:

        status="Excellent"


    elif score >=80:

        status="Good"


    else:

        status="Needs Improvement"



    return jsonify({

        "score":score,

        "status":status

    })




# ===============================
# AI CITY CHAT ASSISTANT
# ===============================


@app.route("/api/chat", methods=["GET"])
def city_chat():


    question = request.args.get(
        "message",
        ""
    ).lower()



    traffic = traffic_agent.get_traffic_status()

    weather = weather_agent.get_weather()

    air = air_agent.get_air_quality()

    energy = energy_agent.get_energy_status()

    waste = waste_agent.get_waste_status()

    emergency = emergency_agent.get_emergency_status()



    reply = ""



    if "traffic" in question:

        reply = (
            "🚦 Current traffic status: "
            + traffic
        )



    elif "weather" in question:

        reply = (
            "🌤 Current weather: "
            + weather
        )



    elif "air" in question or "pollution" in question:

        reply = (
            "🌫 Air Quality AQI: "
            + str(air["aqi"])
            +
            " Status: "
            +
            air["status"]
        )



    elif "energy" in question:

        reply = (
            "⚡ Energy usage: "
            + str(energy["usage"])
            +
            "% "
            +
            energy["status"]
        )



    elif "waste" in question:

        reply = (
            "🗑 Waste level: "
            + str(waste["level"])
            +
            "% "
            +
            waste["status"]
        )



    elif "emergency" in question:

        reply = (
            "🚑 Emergency status: "
            +
            emergency["alert"]
            +
            " Level: "
            +
            emergency["level"]
        )



    else:

        reply = (
            "🤖 UrbanMind AI monitors "
            "traffic, weather, air quality, "
            "energy, waste and emergency systems."
        )



    return jsonify({

        "answer": reply

    })

@app.route("/ai_assistant.html")
def ai_page():
    return send_from_directory(FRONTEND_FOLDER, "ai_assistant.html")

@app.route("/history.html")
def history_page():
    return send_from_directory(FRONTEND_FOLDER, "history.html")
# ===============================
# Run Server
# ===============================


if __name__=="__main__":


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )