class DecisionEngine:


    def analyze(
        self,
        traffic,
        air,
        energy,
        waste,
        emergency
    ):

        decisions = []


        # Traffic Analysis

        if "Heavy" in traffic or "High" in traffic:

            decisions.append(
                "🚦 High traffic detected. Optimize routes."
            )


        # Air Quality Analysis

        if air.get("aqi",0) > 100:

            decisions.append(
                "🌫 High pollution detected. Improve air quality control."
            )


        # Energy Analysis

        if energy.get("usage",0) > 75:

            decisions.append(
                "⚡ High energy consumption. Activate energy saving mode."
            )


        # Waste Analysis

        if waste.get("level",0) > 80:

            decisions.append(
                "🗑 Waste level critical. Schedule collection."
            )


        # Emergency Analysis

        if emergency.get("level") == "High":

            decisions.append(
                "🚑 Emergency priority activated."
            )


        if len(decisions)==0:

            decisions.append(
                "✅ City operating normally"
            )


        return decisions