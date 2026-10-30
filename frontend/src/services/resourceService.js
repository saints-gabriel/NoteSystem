import { get, patch, post } from "./httpClient.js";

/** CRUD genérico dos recursos registrados na API (`/api/:resource`). */
export const listResource = (resource) => get(`/api/${resource}`);
export const createResource = (resource, data) => post(`/api/${resource}`, data);
export const updateResource = (resource, id, data) => patch(`/api/${resource}/${id}`, data);
