import api from "./api";
import type { Project } from "../types";

export const projectService = {
  getAll: async () => {
    const response = await api.get(`/projects`);
    return response.data;
  },
  getAllUserProjects: async (id: string) => {
    console.log("the user id", id);

    const response = await api.get(`/projects/user/${id}`);
    console.log("the response data", response.data);

    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (project: Partial<Project>) => {
    console.log("Creating project with data:", project);

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
