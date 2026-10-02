import random

class TrafficAgent:

    def get_traffic_status(self):

        traffic = [
            "Low Traffic",
            "Moderate Traffic",
            "Heavy Traffic",
            "Traffic Jam"
        ]

        return random.choice(traffic)