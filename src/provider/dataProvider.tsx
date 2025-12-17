import { DataProvider } from "react-admin";

// Utiliser une URL relative pour que ça fonctionne en dev et prod
const API_URL = import.meta.env.VITE_APP_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

export const dataProvider: DataProvider = {
  async getList(resource) {
    const url = `${API_URL}/${resource}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }

    const rawData = await response.json();
    const data = rawData.map((item: { _id: string }) => ({
      ...item,
      id: item._id,
    }));
    const total: number = data.length;

    return { data, total };
  },

  async getOne(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}/${params.id}`);
    }

    const rawData = await response.json();
    const data = { id: rawData._id, ...rawData };
    return { data };
  },

  async getMany(resource, params) {
    const query = new URLSearchParams();
    params.ids.forEach((id) => query.append("id", id.toString()));

    const url = `${API_URL}/${resource}?${query.toString()}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }

    const data = await response.json();
    return { data };
  },

  async create(resource, params) {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(params.data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${resource}`);
    }

    const data = await response.json();
    return { data };
  },

  async update(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(params.data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${resource}/${params.id}`);
    }

    const rawData = await response.json();
    const data = { id: rawData._id, ...rawData };

    return { data };
  },

  async delete(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${resource}/${params.id}`);
    }

    const data = await response.json();
    return { data };
  },

  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  updateMany: () => Promise.resolve({ data: [] }),

  async deleteMany(resource, params) {
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }),
      ),
    );

    return { data: params.ids };
  },
};
