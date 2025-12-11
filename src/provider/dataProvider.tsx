import { DataProvider } from "react-admin";

const API_URL = "http://localhost/api";

const token = localStorage.getItem("token");

export const dataProvider: DataProvider = {
  async getList(resource) {
    const url = `${API_URL}/${resource}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const rawData = await response.json();
    const data = rawData.map((item: { _id: string }) => ({
      ...item,
      id: item._id,
    }));
    const total: number = data.length; // standard JSON-server

    return { data, total };
  },

  async getOne(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    return { data };
  },

  async create(resource, params) {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params.data),
    });

    const data = await response.json();
    return { data };
  },

  async update(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params.data),
    });

    const rawData = await response.json();
    const data = { id: rawData._id, ...rawData };

    return { data };
  },

  async delete(resource, params) {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { data };
  },

  // Tu peux laisser les autres méthodes plus tard
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  updateMany: () => Promise.resolve({ data: [] }),

  async deleteMany(resource, params) {
    const token = localStorage.getItem("token");

    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ),
    );

    return { data: params.ids };
  },
};
