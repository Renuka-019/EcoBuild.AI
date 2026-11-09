# EcoBuild AI – AI-Powered Sustainable Construction Intelligence Platform
> *"Build Smarter. Build Greener."*

EcoBuild AI is a production-grade, AI-powered environmental analysis and decision-intelligence platform engineered for architects, structural engineers, builders, and civil engineering students. It converts complex architectural parameters into verified lifecycle metrics: Energy Use Intensity (EUI), per-capita water demand (LPCD), operational carbon, cradle-to-gate embodied carbon (Bath ICE v3.0), and an explainable 0–100 Sustainability Score.

---

## 🏛️ Platform Architecture & 20 Interconnected Pages

EcoBuild AI features 20 production pages connected through type-safe REST APIs and JWT role-based access control:

### Public Website
1. **Cinematic Landing Page (`/`)**: Atmospheric climate-tech aesthetics, 5-stage storytelling scroll story, interactive building sensor hotspots, live platform metrics, and verified solution highlights.
2. **About EcoBuild AI (`/about`)**: Problem statement, our mission & vision, multi-stakeholder challenge breakdown, and full 5-stage decision workflow diagram.
3. **How It Works (`/how-it-works`)**: 5-step engineering pipeline (Intake → Analyze → Calculate → AI Recommendations → Compare & Optimize) with a live interactive formula calculator.
4. **Sustainable Solutions Library (`/solutions`)**: 20+ searchable & filterable architectural interventions with category tags, implementation difficulty, and capital payback periods.
5. **Education & Knowledge Hub (`/knowledge-hub`)**: Learning cards on EUI, LPCD, and GGBS cement substitution, an interactive glossary, and rating framework overviews (LEED v4.1, IGBC Green Homes, and GRIHA).

### Authentication & Account Management
6. **Register (`/register`)**: Account creation with role categorization (Builder, Architect, Engineer, Student, Other).
7. **Login (`/login`)**: Secure JWT authentication with 1-click demo login buttons for instant exploration.
8. **User Profile (`/profile`)**: Account credentials, role management, password change, and personal portfolio summary.

### Core Application Workspace
9. **Dashboard (`/dashboard`)**: Aggregated portfolio metrics (Average Score, Annual kWh, Carbon Footprint, Energy Abatement), certification distribution charts, recent projects, and audit activity trail.
10. **Add New Building (`/buildings/new`)**: 5-step intake wizard covering Basic Info, Energy systems, Water fixtures, Structural Materials, and Capital Budgets with draft saving.
11. **My Buildings (`/buildings`)**: Project asset repository with search, typology filtering, status badges, multi-design selection for comparison, and instant analysis triggers.
12. **Building Sustainability Analysis (`/analyze/:id`)**: Multi-stage progress visualizer tracking actual backend execution across thermodynamic, hydrological, and carbon calculation stages.
13. **Detailed Analysis Results (`/analysis/:id`)**: Overall Sustainability Score gauge (0–100), classification badge (Platinum/Gold/Silver/Certified/Needs Improvement), EUI intensity, water demand, operational vs. embodied carbon bar chart, and PDF audit generation.
14. **Smart Green Recommendations (`/recommendations/:analysisId`)**: Impact-ranked AI remediation measures with expected kWh, water, and dollar savings, complete with a 1-click *"Apply This Recommendation to My Design"* engine.
15. **Design Comparison (`/compare`)**: Side-by-side trade-off matrix comparing 2 to 4 architectural designs across Cost, Carbon, Energy, Water, and Score with priority selection (*Lowest Carbon*, *Lowest Cost*, *Highest Sustainability*, *Balanced Performance*).
16. **Green Design Simulator (`/simulator`)**: Interactive "What-If" parametric simulator with real-time sliders (Solar PV kWp, Recycled %, Rainwater Cistern, Low-Carbon Concrete) and a *"Save as New Building Design"* workflow.
17. **Cost & Savings Analysis (`/cost-savings`)**: Financial feasibility model calculating initial green premiums, utility savings, payback periods, and a 25-year cumulative Total Cost of Ownership (TCO) projection.
18. **Sustainability Audit Reports (`/reports`)**: Repository of ISO 14040-formatted multi-page PDF audit reports generated on-demand via ReportLab.
19. **Benchmark Explorer (`/benchmarks`)**: Database of official baseline intensities across Residential, Commercial, Educational, Healthcare, and Industrial typologies.
20. **Admin Dashboard (`/admin`)**: Role-protected management console for user account status, real-time emission factor updates, and system operation logs.

---

## 🔬 Scientific Calculation Methodology

### 1. Energy Use Intensity (EUI) & Efficiency Classification
$$\text{EUI} = \frac{\text{Annual Electricity Consumption (kWh)}}{\text{Gross Built-up Area (m}^2\text{)}}$$
- **A+ Rating**: $\le 60\text{ kWh/m}^2/\text{yr}$
- **A Rating**: $61 - 90\text{ kWh/m}^2/\text{yr}$
- **B Rating**: $91 - 130\text{ kWh/m}^2/\text{yr}$
- **C Rating**: $131 - 180\text{ kWh/m}^2/\text{yr}$
- **D Rating**: $181 - 250\text{ kWh/m}^2/\text{yr}$
- **E Rating**: $> 250\text{ kWh/m}^2/\text{yr}$

**Solar Rooftop Potential Yield:**
$$\text{Solar Generation (kWh/yr)} = \text{Capacity (kWp)} \times 1,450\text{ peak sun hours} \times 0.78\text{ PR}$$

### 2. Hydrological Demand & Rainwater Harvesting
$$\text{Daily Water Demand (Litres)} = \text{Occupants} \times \text{LPCD Baseline}$$
- *Residential baseline:* $135\text{ LPCD}$ (WHO / NBC)
- *Commercial office baseline:* $45\text{ LPCD}$ (ASHRAE / NBC)

**Rooftop Rainwater Harvesting Yield:**
$$\text{Rainwater Yield (L/yr)} = \text{Roof Area (m}^2\text{)} \times \text{Annual Precipitation (850 mm)} \times 0.85\text{ (Runoff Coeff)} \times 0.80\text{ (Filter Eff)}$$

### 3. Greenhouse Gas Emissions (GHG Protocol Scope 2 & 3)
- **Scope 2 Operational Carbon:**
  $$\text{Operational Carbon (tCO}_2\text{e)} = \frac{(\text{Grid kWh} - \text{Solar Clean kWh}) \times 0.716\text{ kg CO}_2\text{e/kWh}}{1,000}$$
- **Scope 3 Embodied Material Carbon (Bath ICE v3.0):**
  - Standard Ready-mix Concrete (C25/30): $240\text{ kg CO}_2\text{e/m}^3$ (reduced to $145\text{ kg CO}_2\text{e/m}^3$ with 40% GGBS slag replacement)
  - Structural Virgin Steel: $1.85\text{ kg CO}_2\text{e/kg}$ (reduced to $0.72\text{ kg CO}_2\text{e/kg}$ for EAF scrap steel)
  - Fired Clay Brick: $0.24\text{ kg CO}_2\text{e/unit}$
  - Transport logistics discount: $-8\%$ for regional sourcing within 400 km.
  - Annualized embodied carbon amortized over a 50-year design lifespan.

### 4. Explainable Sustainability Scoring (0–100)
$$\text{Score} = (0.35 \times \text{Energy Score}) + (0.30 \times \text{Carbon Score}) + (0.20 \times \text{Water Score}) + (0.15 \times \text{Materials Score})$$
- **Platinum:** $90.0 - 100.0$
- **Gold:** $75.0 - 89.9$
- **Silver:** $60.0 - 74.9$
- **Certified:** $50.0 - 59.9$
- **Needs Improvement:** $< 50.0$

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Modular component architecture, type-safe models |
| **Styling & Motion** | Tailwind CSS, Framer Motion | Mossline-inspired aesthetic, glassmorphism, responsive |
| **Data Viz** | Recharts, Lucide Icons | Responsive bar charts, radar diagrams, circular SVG score gauges |
| **Backend** | Python 3.14, FastAPI | Asynchronous RESTful routing, Pydantic v2 schemas |
| **Database** | SQLAlchemy 2.0, SQLite / PostgreSQL | Relational schema, foreign keys, cascades, activity logs |
| **Document Engine**| ReportLab 5.0 | Multi-page ISO 14040 formatted PDF generator |
| **Security** | JWT (HS256), bcrypt | Password salting/hashing, role-based route guard |
| **Machine Learning**| Scikit-learn (Ridge Regressors) | Calibrated baseline energy/water requirements estimator |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- Node.js (v18+ or v22+)
- Python (v3.10+ or v3.14+)

### 1. Clone & Setup Workspace
```bash
cd ecobuild-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt # (or fast-install: fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose bcrypt reportlab scikit-learn pandas numpy)

# Seed database with benchmarks, solutions, emission factors, and demo projects:
python -m app.seed_data

# Start backend server:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
API Documentation will be live at: `http://127.0.0.1:8000/api/docs`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Client will be live at: `http://localhost:5173`

### 4. Default Demo Accounts
- **Lead Architect Demo:**
  - Email: `demo@ecobuild.ai`
  - Password: `DemoPass123!`
- **System Administrator:**
  - Email: `admin@ecobuild.ai`
  - Password: `AdminPass123!`
*(Quick 1-click login buttons are also provided directly on the Sign-In screen!)*

---

## 🧪 Testing & Verification

Execute the backend test suite:
```bash
cd backend
python -m pytest tests/test_api.py -v
```

Execute frontend production compilation:
```bash
cd frontend
npm run build
```

---

## 📄 License & Disclosures
EcoBuild AI provides simulation and architectural advisory metrics. Certifications such as LEED (USGBC), IGBC (CII), and GRIHA require accredited third-party auditing and commissioning.
