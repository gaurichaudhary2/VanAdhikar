const API_BASE_URL = "https://vanadhikar-backend.onrender.com/api";

function getAuthHeaders() {
  const token = localStorage.getItem("vanadhikar_token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

async function handleResponse(response: Response) {
  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("vanadhikar_token");
    localStorage.removeItem("vanadhikar_user");
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}


export async function getDashboardOverview() {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/overview`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.data;
}

export async function getClaims() {
  const response = await fetch(
    `${API_BASE_URL}/claims`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.claims;
}

export async function getClaimById(
  claimId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/claims/${encodeURIComponent(
      claimId
    )}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data = await handleResponse(response);

  return data.claim;
}

export async function getAnomalies() {
  const response = await fetch(
    `${API_BASE_URL}/anomalies`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.anomalies;
}

export async function analyzeAnomalies() {
  const response = await fetch(
    `${API_BASE_URL}/anomalies/analyze`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.anomalies;
}

export async function getAlerts() {
  const response = await fetch(
    `${API_BASE_URL}/alerts`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.alerts;
}

export async function generateAlerts() {
  const response = await fetch(
    `${API_BASE_URL}/alerts/generate`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.alerts;
}

export async function markAlertAsRead(
  alertId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${encodeURIComponent(
      alertId
    )}/read`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.alert;
}

export async function getDistrictDecision(
  district: string
) {
  const response = await fetch(
    `${API_BASE_URL}/decision-support/district/${encodeURIComponent(
      district
    )}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(response);

  return data.data;
}