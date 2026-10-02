import random


def get_air_quality():

    aqi=random.randint(50,200)


    if aqi<100:
        status="Good"

    elif aqi<150:
        status="Moderate"

    else:
        status="Unhealthy"


    return {

        "aqi":aqi,

        "status":status

    }