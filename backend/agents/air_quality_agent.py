import random

class AirQualityAgent:

    def get_air_quality(self):
        aqi = random.randint(20, 180)

        if aqi <= 50:
            status = "Good"
        elif aqi <= 100:
            status = "Moderate"
        elif aqi <= 150:
            status = "Unhealthy"
        else:
            status = "Very Unhealthy"

        return {
            "aqi": aqi,
            "status": status
        }