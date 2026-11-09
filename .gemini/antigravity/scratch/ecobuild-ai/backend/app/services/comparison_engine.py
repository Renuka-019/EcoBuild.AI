"""
EcoBuild AI - Multi-Design Comparison Engine
Compares 2 or more building designs across Cost, Energy, Water, Carbon, and Sustainability Score,
identifying trade-offs, category leaders, and user-weighted recommendation summaries.
"""

from typing import List, Dict, Any

def compare_designs(buildings_data: List[Dict[str, Any]], priority: str = "Balanced Performance") -> Dict[str, Any]:
    if not buildings_data:
        return {"error": "No building data provided for comparison"}

    designs = []
    for b in buildings_data:
        analysis = b.get("latest_analysis", {})
        energy = analysis.get("energy", {})
        water = analysis.get("water", {})
        carbon = analysis.get("carbon", {})
        cost = b.get("cost", {})
        
        designs.append({
            "id": b.get("id"),
            "name": b.get("project_name", f"Design {b.get('id')}"),
            "building_type": b.get("building_type"),
            "area_m2": b.get("built_up_area_m2", 0.0),
            "score": analysis.get("overall_sustainability_score", 0.0),
            "classification": analysis.get("classification", "Needs Improvement"),
            "energy_kwh": energy.get("annual_energy_kwh", 0.0),
            "energy_intensity": energy.get("energy_intensity_kwh_m2", 0.0),
            "water_annual_l": water.get("annual_water_litres", 0.0),
            "water_lpcd": water.get("water_per_occupant_lpcd", 0.0),
            "carbon_total_tons": carbon.get("total_carbon_tons", 0.0),
            "carbon_intensity": carbon.get("carbon_intensity_kg_m2", 0.0),
            "embodied_carbon_tons": carbon.get("embodied_carbon_tons", 0.0),
            "operational_carbon_tons": carbon.get("operational_carbon_tons", 0.0),
            "construction_cost": cost.get("construction_cost", 0.0),
            "energy_score": analysis.get("energy_score", 0.0),
            "water_score": analysis.get("water_score", 0.0),
            "carbon_score": analysis.get("carbon_score", 0.0),
            "materials_score": analysis.get("materials_score", 0.0),
        })

    # Identify leaders per metric
    best_score = max(designs, key=lambda x: x["score"])
    best_energy = min(designs, key=lambda x: x["energy_intensity"])
    best_water = min(designs, key=lambda x: x["water_lpcd"])
    best_carbon = min(designs, key=lambda x: x["carbon_intensity"])
    valid_costs = [d for d in designs if d["construction_cost"] > 0]
    best_cost = min(valid_costs, key=lambda x: x["construction_cost"]) if valid_costs else None

    # Determine recommended design based on priority
    recommended = None
    if priority == "Lowest Carbon":
        recommended = best_carbon
        reason = f"delivers the lowest overall carbon intensity at {best_carbon['carbon_intensity']} kg CO2e/m²"
    elif priority == "Lowest Cost" and best_cost:
        recommended = best_cost
        reason = f"has the lowest upfront construction cost at ${best_cost['construction_cost']:,.0f}"
    elif priority == "Highest Sustainability":
        recommended = best_score
        reason = f"achieves the top Sustainability Score of {best_score['score']}/100 ({best_score['classification']})"
    else:  # Balanced Performance
        # Normalized weighted rank
        def rank_score(d):
            s_norm = d["score"] / 100.0
            c_norm = 1.0 - (d["carbon_intensity"] / max([x["carbon_intensity"] for x in designs] + [1.0]))
            e_norm = 1.0 - (d["energy_intensity"] / max([x["energy_intensity"] for x in designs] + [1.0]))
            return (s_norm * 0.4) + (c_norm * 0.3) + (e_norm * 0.3)
        recommended = max(designs, key=rank_score)
        reason = f"maintains the most optimal balance between energy efficiency, carbon footprint ({recommended['carbon_intensity']} kg CO2e/m²), and a high Sustainability Score of {recommended['score']}/100"

    # Multi-faceted summary
    summary_paragraphs = [
        f"Comparative evaluation of {len(designs)} design alternatives under the '{priority}' decision framework.",
        f"• Highest Sustainability Score: '{best_score['name']}' ({best_score['score']}/100, {best_score['classification']}).",
        f"• Lowest Energy Intensity: '{best_energy['name']}' ({best_energy['energy_intensity']} kWh/m²/year).",
        f"• Lowest Water Consumption: '{best_water['name']}' ({best_water['water_lpcd']} LPCD).",
        f"• Lowest Carbon Emissions: '{best_carbon['name']}' ({best_carbon['carbon_intensity']} kg CO2e/m²).",
    ]
    if best_cost:
        summary_paragraphs.append(f"• Lowest Capital Outlay: '{best_cost['name']}' (${best_cost['construction_cost']:,.0f}).")
    
    summary_paragraphs.append(f"\nFinal Recommendation: '{recommended['name']}' is recommended because it {reason}.")

    return {
        "designs": designs,
        "priority_preference": priority,
        "leaders": {
            "sustainability_score": best_score["name"],
            "energy_intensity": best_energy["name"],
            "water_lpcd": best_water["name"],
            "carbon_intensity": best_carbon["name"],
            "construction_cost": best_cost["name"] if best_cost else "N/A"
        },
        "recommended_design": recommended["name"],
        "recommended_id": recommended["id"],
        "recommendation_reason": reason,
        "summary": "\n".join(summary_paragraphs)
    }
