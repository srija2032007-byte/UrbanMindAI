import random

class WasteAgent:

    def get_waste_status(self):

        level = random.randint(10, 100)

        if level < 40:
            status = "Low"

        elif level < 70:
            status = "Medium"

        else:
            status = "High"

        return {
            "level": level,
            "status": status
        }