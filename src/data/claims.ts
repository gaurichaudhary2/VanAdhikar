export interface Claim {
  id: string;
  district: string;
  status: "Approved" | "Pending" | "Rejected" | "Review";
  anomaly?: "High" | "Medium";
  riskScore: number;
  lat: number;
  lng: number;
}

export const claims: Claim[] = [
  {
    id: "FRA-001",
    district: "Dhar",
    status: "Review",
    anomaly: "High",
    riskScore: 87,
    lat: 22.5937,
    lng: 75.2975,
  },
  {
    id: "FRA-002",
    district: "Mandla",
    status: "Pending",
    anomaly: "Medium",
    riskScore: 61,
    lat: 22.5979,
    lng: 80.3714,
  },
  {
    id: "FRA-003",
    district: "Betul",
    status: "Approved",
    riskScore: 18,
    lat: 21.3089,
    lng: 76.2301,
  },
  {
    id: "FRA-004",
    district: "Indore",
    status: "Approved",
    riskScore: 12,
    lat: 22.7196,
    lng: 75.8577,
  },
  {
    id: "FRA-005",
    district: "Mandla",
    status: "Review",
    anomaly: "High",
    riskScore: 92,
    lat: 22.75,
    lng: 80.45,
  },
  {
    id: "FRA-006",
    district: "Dhar",
    status: "Pending",
    riskScore: 34,
    lat: 22.65,
    lng: 75.4,
  },
  {
    id: "FRA-007",
    district: "Betul",
    status: "Review",
    anomaly: "Medium",
    riskScore: 67,
    lat: 21.4,
    lng: 76.35,
  },
  {
    id: "FRA-008",
    district: "Indore",
    status: "Pending",
    riskScore: 41,
    lat: 22.8,
    lng: 75.9,
  },
];