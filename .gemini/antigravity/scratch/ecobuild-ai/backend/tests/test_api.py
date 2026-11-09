import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_full_api_suite():
    with TestClient(app) as client:
        # 1. Health
        h = client.get("/api/health")
        assert h.status_code == 200
        assert h.json()["status"] == "healthy"

        # 2. Public Solutions
        sol = client.get("/api/solutions")
        assert sol.status_code == 200
        assert len(sol.json()) >= 5

        # 3. Public Benchmarks
        bm = client.get("/api/benchmarks")
        assert bm.status_code == 200
        assert len(bm.json()) >= 4

        # 4. Auth Login
        login_res = client.post("/api/auth/login", json={
            "email": "demo@ecobuild.ai",
            "password": "DemoPass123!"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 5. Buildings
        b_res = client.get("/api/buildings", headers=headers)
        assert b_res.status_code == 200
        buildings = b_res.json()
        assert len(buildings) >= 1

        b_id = buildings[0]["id"]

        # 6. Analysis
        an_res = client.post(f"/api/analysis/{b_id}", headers=headers)
        assert an_res.status_code == 200
        an = an_res.json()
        assert an["overall_sustainability_score"] > 0
        assert an["classification"] in ["Platinum", "Gold", "Silver", "Certified", "Needs Improvement"]
        assert len(an["recommendations"]) > 0

        # 7. Dashboard Summary
        dash_res = client.get("/api/dashboard/summary", headers=headers)
        assert dash_res.status_code == 200
        assert dash_res.json()["total_buildings"] >= 1

        # 8. Report Generation
        rep_res = client.post("/api/reports/generate", json={"building_id": b_id}, headers=headers)
        assert rep_res.status_code == 200
        assert "download_url" in rep_res.json()

        # 9. Simulation
        sim_res = client.post("/api/simulations", json={
            "building_id": b_id,
            "solar_capacity_kw": 50.0,
            "rainwater_harvesting": True,
            "recycled_percentage": 40.0
        }, headers=headers)
        assert sim_res.status_code == 200
        assert "deltas" in sim_res.json()

        print("\nAll 9 core API flow tests passed successfully!")
