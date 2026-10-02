# ============================================
# UrbanMind AI - Traffic Prediction ML Training
# Random Forest Model
# ============================================


import os
import pickle

import pandas as pd


from sklearn.ensemble import RandomForestClassifier

from sklearn.preprocessing import LabelEncoder

from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score





# --------------------------------------------
# Current Directory
# --------------------------------------------


CURRENT_DIR = os.path.dirname(
    os.path.abspath(__file__)
)





# --------------------------------------------
# Dataset Location
# --------------------------------------------


DATASET_PATH = os.path.join(

    CURRENT_DIR,
    "..",
    "..",
    "datasets",
    "traffic_data.csv"

)



print(
"Loading dataset from:",
DATASET_PATH
)





# --------------------------------------------
# Read Dataset
# --------------------------------------------


df = pd.read_csv(
    DATASET_PATH
)



print("\nDataset Loaded")

print(df.head())





# --------------------------------------------
# Encode Text Data
# --------------------------------------------


weather_encoder = LabelEncoder()

day_encoder = LabelEncoder()

traffic_encoder = LabelEncoder()





df["weather"] = weather_encoder.fit_transform(
    df["weather"]
)



df["day_type"] = day_encoder.fit_transform(
    df["day_type"]
)



df["traffic_level"] = traffic_encoder.fit_transform(
    df["traffic_level"]
)





# --------------------------------------------
# Features and Target
# --------------------------------------------


X = df[

[
"hour",
"weather",
"day_type",
"vehicle_count"
]

]



y = df[
"traffic_level"
]






# --------------------------------------------
# Train Test Split
# --------------------------------------------


X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,
    test_size=0.2,
    random_state=42

)






# --------------------------------------------
# Random Forest Model
# --------------------------------------------


model = RandomForestClassifier(

    n_estimators=100,

    random_state=42

)





model.fit(

    X_train,

    y_train

)






# --------------------------------------------
# Model Accuracy
# --------------------------------------------


prediction = model.predict(
    X_test
)


accuracy = accuracy_score(

    y_test,

    prediction

)


print(
"\nModel Accuracy:",
round(accuracy*100,2),
"%"
)






# --------------------------------------------
# Save Model Files
# --------------------------------------------


pickle.dump(

    model,

    open(

        os.path.join(
            CURRENT_DIR,
            "traffic_model.pkl"
        ),

        "wb"

    )

)




pickle.dump(

    weather_encoder,

    open(

        os.path.join(
            CURRENT_DIR,
            "weather_encoder.pkl"
        ),

        "wb"

    )

)





pickle.dump(

    day_encoder,

    open(

        os.path.join(
            CURRENT_DIR,
            "day_encoder.pkl"
        ),

        "wb"

    )

)





pickle.dump(

    traffic_encoder,

    open(

        os.path.join(
            CURRENT_DIR,
            "traffic_encoder.pkl"
        ),

        "wb"

    )

)







print("\n✅ UrbanMind AI Traffic Model Trained Successfully!")

print("Created files:")

print("✔ traffic_model.pkl")

print("✔ weather_encoder.pkl")

print("✔ day_encoder.pkl")

print("✔ traffic_encoder.pkl")