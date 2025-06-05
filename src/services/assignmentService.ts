import api from "./api";
import type { Assignment } from "../types";

export const assignmentService = {
  getAll: async (params?: { engineerId?: string; projectId?: string }) => {
    const response = await api.get("/assignments", { params });
    return response.data;
  },

  create: async (assignment: Partial<Assignment>) => {
    const response = await api.post("/assignments", assignment);
    return response.data;
  },

  update: async (id: string, assignment: Partial<Assignment>) => {
    const response = await api.put(`/assignments/${id}`, assignment);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
};
