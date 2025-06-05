export interface User {
  _id: string;
  email: string;
  name: string;
  role: "manager" | "engineer";
  skills?: string[];
  currentCapacity?: number;
  maxCapacity?: number;
  department?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  requiredSkills: string[];
  teamSize: number;
  status: "planning" | "active" | "completed";
  managerId: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  engineerId: User | string;
  projectId: Project | string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string;
  role: "Developer" | "Tech Lead" | "Architect";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: "manager" | "engineer";
  skills?: string[];
  department?: string;
}
