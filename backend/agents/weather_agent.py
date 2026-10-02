import random


class WeatherAgent:


    def get_weather(self):

        weather = [

            "Sunny",

            "Cloudy",

            "Rain",

            "Fog"

        ]


        return random.choice(weather)