import random

class EnergyAgent:

    def get_energy_status(self):

        usage = random.randint(40, 100)

        if usage < 60:
            status = "Low Usage"

        elif usage < 80:
            status = "Normal Usage"

        else:
            status = "High Usage"

        return {
            "usage": usage,
            "status": status
        }