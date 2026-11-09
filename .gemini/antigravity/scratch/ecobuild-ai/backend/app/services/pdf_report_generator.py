"""
EcoBuild AI - Production Quality PDF Sustainability Report Generator
Generates comprehensive multi-page sustainability audits using ReportLab.
Includes executive score summary, energy, water, carbon breakdown, materials circularity,
recommendations table, and emission factor methodology.
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak, HRFlowable
)

def generate_pdf_report(building_data: dict, analysis_data: dict, output_filepath: str) -> str:
    doc = SimpleDocTemplate(
        output_filepath,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom palette
    ink = colors.HexColor("#10291A")
    lime = colors.HexColor("#7DB828")
    dark_green = colors.HexColor("#1B4D2E")
    mist = colors.HexColor("#F4F6F4")
    border_color = colors.HexColor("#D1D9D4")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=ink
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=dark_green
    )
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=ink,
        spaceBefore=14,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#222222")
    )
    bold_body_style = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#666666")
    )

    elements = []

    # Header / Branding Banner
    header_data = [
        [
            Paragraph("<b>ECOBUILD AI</b><br/><font size=9 color='#2C4434'>AI-Powered Sustainable Construction Intelligence</font>", title_style),
            Paragraph(f"<b>Audit Date:</b> {datetime.utcnow().strftime('%B %d, %Y')}<br/><b>Standard:</b> ISO 14040 / GHG Protocol / ASHRAE", meta_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[350, 180])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(header_table)
    elements.append(HRFlowable(width="100%", thickness=2, color=dark_green, spaceBefore=4, spaceAfter=15))

    # Project Overview & Score Card
    score = analysis_data.get("overall_sustainability_score", 0.0)
    classification = analysis_data.get("classification", "Needs Improvement")

    overview_data = [
        [
            Paragraph("<b>Project Details</b>", bold_body_style),
            Paragraph("<b>Sustainability Rating</b>", bold_body_style)
        ],
        [
            Paragraph(
                f"<b>Project Name:</b> {building_data.get('project_name')}<br/>"
                f"<b>Building Type:</b> {building_data.get('building_type')}<br/>"
                f"<b>Location:</b> {building_data.get('location')}<br/>"
                f"<b>Gross Built-up Area:</b> {building_data.get('built_up_area_m2')} m²<br/>"
                f"<b>Floors / Occupants:</b> {building_data.get('floors')} floors / {building_data.get('occupants')} people<br/>"
                f"<b>Planned Construction:</b> {building_data.get('construction_year')}",
                body_style
            ),
            Paragraph(
                f"<font size=26 color='#1B4D2E'><b>{score}/100</b></font><br/>"
                f"<b>Classification:</b> {classification}<br/>"
                f"• Energy Performance: <b>{analysis_data.get('energy_score', 0)}/100</b><br/>"
                f"• Carbon Footprint: <b>{analysis_data.get('carbon_score', 0)}/100</b><br/>"
                f"• Water Conservation: <b>{analysis_data.get('water_score', 0)}/100</b><br/>"
                f"• Materials Circularity: <b>{analysis_data.get('materials_score', 0)}/100</b>",
                body_style
            )
        ]
    ]
    overview_table = Table(overview_data, colWidths=[280, 250])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), mist),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(overview_table)
    elements.append(Spacer(1, 14))

    # Core Metric Performance Table
    elements.append(Paragraph("1. Environmental Assessment Summary", h2_style))
    
    e = analysis_data.get("energy", {})
    w = analysis_data.get("water", {})
    c = analysis_data.get("carbon", {})

    metrics_rows = [
        [Paragraph("<b>Category</b>", bold_body_style), Paragraph("<b>Key Metric</b>", bold_body_style), Paragraph("<b>Assessed Value</b>", bold_body_style), Paragraph("<b>Standard Benchmark</b>", bold_body_style), Paragraph("<b>Rating / Status</b>", bold_body_style)],
        [
            Paragraph("<b>Energy</b>", body_style),
            Paragraph("Energy Use Intensity (EUI)", body_style),
            Paragraph(f"{e.get('energy_intensity_kwh_m2')} kWh/m²/yr", body_style),
            Paragraph(f"{e.get('benchmark_eui', 120)} kWh/m²/yr", body_style),
            Paragraph(f"Class {e.get('energy_efficiency_class', 'B')}", body_style)
        ],
        [
            Paragraph("<b>Renewables</b>", body_style),
            Paragraph("Annual Solar Generation", body_style),
            Paragraph(f"{e.get('actual_solar_kwh', 0):,.0f} kWh", body_style),
            Paragraph(f"Pot: {e.get('potential_solar_generation_kwh', 0):,.0f} kWh", body_style),
            Paragraph("On-site Clean Power" if e.get('actual_solar_kwh', 0) > 0 else "Undeployed", body_style)
        ],
        [
            Paragraph("<b>Water</b>", body_style),
            Paragraph("Per Capita Consumption", body_style),
            Paragraph(f"{w.get('water_per_occupant_lpcd')} LPCD", body_style),
            Paragraph(f"{w.get('benchmark_lpcd', 135)} LPCD", body_style),
            Paragraph("Optimized" if w.get('water_per_occupant_lpcd', 150) <= w.get('benchmark_lpcd', 135) else "Elevated Demand", body_style)
        ],
        [
            Paragraph("<b>Rainwater</b>", body_style),
            Paragraph("Rooftop Catchment Yield", body_style),
            Paragraph(f"{w.get('rainwater_harvest_potential_litres', 0):,.0f} L/yr", body_style),
            Paragraph("850 mm/yr Precipitation", body_style),
            Paragraph("High Capture Potential", body_style)
        ],
        [
            Paragraph("<b>Operational Carbon</b>", body_style),
            Paragraph("Scope 2 Grid Emissions", body_style),
            Paragraph(f"{c.get('operational_carbon_tons')} tCO2e/yr", body_style),
            Paragraph("Grid: 0.716 kg/kWh", body_style),
            Paragraph("Annual Operational", body_style)
        ],
        [
            Paragraph("<b>Embodied Carbon</b>", body_style),
            Paragraph("Cradle-to-Gate Materials", body_style),
            Paragraph(f"{c.get('embodied_carbon_tons')} tCO2e", body_style),
            Paragraph("Amortized over 50 yrs", body_style),
            Paragraph(f"Concrete: {c.get('concrete_carbon_tons', 0)} t | Steel: {c.get('steel_carbon_tons', 0)} t", body_style)
        ],
        [
            Paragraph("<b>Carbon Intensity</b>", body_style),
            Paragraph("Total Annual Footprint", body_style),
            Paragraph(f"{c.get('carbon_intensity_kg_m2')} kg CO2e/m²", body_style),
            Paragraph("Target: < 90 kg/m²", body_style),
            Paragraph("Compliant" if c.get('carbon_intensity_kg_m2', 100) < 90 else "Action Required", body_style)
        ],
    ]
    metrics_table = Table(metrics_rows, colWidths=[90, 130, 110, 110, 90])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), mist),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(metrics_table)
    elements.append(Spacer(1, 14))

    # Recommendations Section
    elements.append(Paragraph("2. Prioritized AI Sustainability Recommendations", h2_style))
    recs = analysis_data.get("recommendations", [])
    if recs:
        rec_rows = [
            [Paragraph("<b>Priority</b>", bold_body_style), Paragraph("<b>Recommendation</b>", bold_body_style), Paragraph("<b>Intervention & Environmental Benefit</b>", bold_body_style), Paragraph("<b>Expected Annual Savings</b>", bold_body_style)]
        ]
        for r in recs[:5]:
            p_color = "#B91C1C" if r.get("priority") == "High" else "#1E40AF"
            rec_rows.append([
                Paragraph(f"<font color='{p_color}'><b>{r.get('priority')}</b></font><br/><font size=7>{r.get('category')}</font>", body_style),
                Paragraph(f"<b>{r.get('title')}</b><br/><font size=7 color='#555555'>Diff: {r.get('implementation_difficulty')} | Cost: {r.get('estimated_cost_category')}</font>", body_style),
                Paragraph(f"{r.get('suggested_improvement')}<br/><font color='#1B4D2E'><b>Benefit:</b> {r.get('environmental_benefit')}</font>", body_style),
                Paragraph(
                    f"• {r.get('expected_savings_kwh', 0):,.0f} kWh<br/>"
                    f"• {r.get('expected_savings_water_l', 0):,.0f} Litres<br/>"
                    f"• {r.get('expected_savings_carbon_tons', 0):.1f} tCO2e",
                    body_style
                )
            ])
        rec_table = Table(rec_rows, colWidths=[65, 125, 230, 110])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), mist),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(rec_table)
    else:
        elements.append(Paragraph("No active remediation measures identified for current design baseline.", body_style))

    elements.append(Spacer(1, 14))

    # Methodology, Assumptions & Limitations
    elements.append(Paragraph("3. Calculation Methodology & Reference Standards", h2_style))
    methodology_text = (
        "<b>Governing Standards & Emission Factors:</b><br/>"
        "• <b>Operational Carbon:</b> Evaluated under GHG Protocol Scope 2 location-based accounting utilizing grid emission intensity factor of 0.716 kg CO2e/kWh.<br/>"
        "• <b>Embodied Carbon:</b> Cradle-to-gate inventory derived from the University of Bath Inventory of Carbon and Energy (ICE v3.0). Standard ready-mix concrete rated at 240 kg CO2e/m³, structural steel at 1.85 kg CO2e/kg (reduced proportionally for recycled EAF scrap content).<br/>"
        "• <b>Water & Rainwater:</b> Calculations follow National Building Code (NBC) standard baseline of 135 LPCD for residential dwellings and 45 LPCD for commercial workplaces. Rainwater harvesting assumes local precipitation coefficient with 85% impervious runoff and 80% secondary filtration efficiency.<br/>"
        "• <b>Limitations:</b> This report presents an engineering estimation model for early-stage design optimization. Actual commissioned performance may vary based on weather variations, microclimate conditions, and tenant behavioral patterns."
    )
    elements.append(Paragraph(methodology_text, meta_style))
    elements.append(Spacer(1, 15))

    # Sign-off footer
    elements.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=8))
    elements.append(Paragraph("Generated by EcoBuild AI Platform • Verified Environmental Intelligence • Build Smarter. Build Greener.", meta_style))

    doc.build(elements)
    return output_filepath
