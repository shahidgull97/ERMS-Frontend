import api from "./api";
import type { Project } from "../types";

export const projectService = {
  getAll: async () => {
    const response = await api.get("/projects");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (project: Partial<Project>) => {
    const response = await api.post("/projects", project);
    return response.data;
  },

  update: async (id: string, project: Partial<Project>) => {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
