import os
import pickle
import pandas as pd


# =====================================
# Model Paths
# =====================================

CURRENT_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


MODEL_PATH = os.path.join(
    CURRENT_DIR,
    "traffic_model.pkl"
)


WEATHER_ENCODER_PATH = os.path.join(
    CURRENT_DIR,
    "weather_encoder.pkl"
)


DAY_ENCODER_PATH = os.path.join(
    CURRENT_DIR,
    "day_encoder.pkl"
)


TRAFFIC_ENCODER_PATH = os.path.join(
    CURRENT_DIR,
    "traffic_encoder.pkl"
)



# =====================================
# Load ML Files
# =====================================

try:

    with open(MODEL_PATH,"rb") as f:
        model = pickle.load(f)


    with open(WEATHER_ENCODER_PATH,"rb") as f:
        weather_encoder = pickle.load(f)


    with open(DAY_ENCODER_PATH,"rb") as f:
        day_encoder = pickle.load(f)


    with open(TRAFFIC_ENCODER_PATH,"rb") as f:
        traffic_encoder = pickle.load(f)


    print("✅ Traffic ML Model Loaded Successfully")


except Exception as e:

    print(
        "❌ Model Loading Failed:",
        e
    )

    model=None




# =====================================
# Prediction Function
# =====================================


def predict_traffic(
        hour,
        weather,
        day_type,
        vehicle_count
):


    if model is None:

        return "ML Model Not Ready"



    try:


        # Encode inputs

        weather_value = (
            weather_encoder
            .transform([weather])[0]
        )


        day_value = (
            day_encoder
            .transform([day_type])[0]
        )



        input_data = pd.DataFrame(

            [[
                hour,
                weather_value,
                day_value,
                vehicle_count
            ]],

            columns=[

                "hour",
                "weather",
                "day_type",
                "vehicle_count"

            ]

        )



        prediction = model.predict(
            input_data
        )



        result = (
            traffic_encoder
            .inverse_transform(prediction)
        )[0]



        return result + " Traffic Expected"



    except Exception as e:


        return "Prediction Error : " + str(e)