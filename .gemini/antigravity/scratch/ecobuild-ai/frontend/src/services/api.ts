const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('ecobuild_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const err = await res.json();
      errorMsg = err.detail || err.message || errorMsg;
    } catch {
      errorMsg = `Server error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(payload: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async register(payload: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async updateProfile(payload: any) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  // Buildings
  async getBuildings(type?: string, search?: string) {
    const params = new URLSearchParams();
    if (type && type !== 'All') params.append('building_type', type);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/buildings?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  async getBuilding(id: number | string) {
    const res = await fetch(`${API_BASE}/buildings/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async createBuilding(payload: any) {
    const res = await fetch(`${API_BASE}/buildings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async updateBuilding(id: number | string, payload: any) {
    const res = await fetch(`${API_BASE}/buildings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async deleteBuilding(id: number | string) {
    const res = await fetch(`${API_BASE}/buildings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Analysis
  async runAnalysis(buildingId: number | string) {
    const res = await fetch(`${API_BASE}/analysis/${buildingId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async getAnalysis(analysisId: number | string) {
    const res = await fetch(`${API_BASE}/analysis/${analysisId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Recommendations
  async getRecommendations(analysisId: number | string) {
    const res = await fetch(`${API_BASE}/recommendations/${analysisId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  async applyRecommendation(recId: number | string) {
    const res = await fetch(`${API_BASE}/recommendations/${recId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Comparisons
  async createComparison(payload: { title: string; building_ids: number[]; priority_preference: string }) {
    const res = await fetch(`${API_BASE}/comparisons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async getComparisons() {
    const res = await fetch(`${API_BASE}/comparisons`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  async getComparison(id: number | string) {
    const res = await fetch(`${API_BASE}/comparisons/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Simulations
  async runSimulation(payload: any) {
    const res = await fetch(`${API_BASE}/simulations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  async saveSimulationAsDesign(payload: any) {
    const res = await fetch(`${API_BASE}/simulations/save-as-design`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  // Reports
  async generateReport(buildingId: number | string, reportTitle?: string) {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ building_id: buildingId, report_title: reportTitle || 'Sustainability Performance Audit' })
    });
    return handleResponse<any>(res);
  },

  async getReports() {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  // Dashboard
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Benchmarks
  async getBenchmarks(buildingType?: string) {
    const params = new URLSearchParams();
    if (buildingType && buildingType !== 'All') params.append('building_type', buildingType);
    const res = await fetch(`${API_BASE}/benchmarks?${params.toString()}`);
    return handleResponse<any[]>(res);
  },

  // Solutions
  async getSolutions(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/solutions?${params.toString()}`);
    return handleResponse<any[]>(res);
  },

  // Admin
  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async toggleUserStatus(userId: number) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async updateEmissionFactor(factorId: number, newValue: number) {
    const res = await fetch(`${API_BASE}/admin/factors/${factorId}?new_value=${newValue}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  }
};
