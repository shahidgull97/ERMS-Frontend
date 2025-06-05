import api from "./api";

export const engineerService = {
  getAll: async (params?: { skills?: string; minCapacity?: number }) => {
    const response = await api.get("/users/engineers", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/engineers/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: { skills?: string[]; department?: string }
  ) => {
    const response = await api.put(`/users/engineers/${id}`, data);
    return response.data;
  },

  getCapacityReport: async () => {
    const response = await api.get("/users/engineers/capacity-report");
    return response.data;
  },
};
