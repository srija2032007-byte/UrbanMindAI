import random

class EmergencyAgent:

    def get_emergency_status(self):

        alerts = [
            "No Alerts",
            "Road Accident",
            "Fire Alert",
            "Flood Warning",
            "Medical Emergency"
        ]

        level = random.choice([
            "Low",
            "Medium",
            "High"
        ])

        return {
            "alert": random.choice(alerts),
            "level": level
        }