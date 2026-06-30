import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/purchase-orders`;

export const getAllPOs          = ()         => axios.get(BASE);
export const getPOById          = (id)       => axios.get(`${BASE}/${id}`);
export const getOpenPOs         = ()         => axios.get(`${BASE}/open`);
export const getPendingPOs      = ()         => axios.get(`${BASE}/pending`);
export const getPOSummary       = ()         => axios.get(`${BASE}/summary`);
export const createPO           = (po)       => axios.post(BASE, po);
export const updatePO           = (id, po)   => axios.put(`${BASE}/${id}`, po);
export const changeStatus       = (id, s)    => axios.patch(`${BASE}/${id}/status`, { status: s });
export const receivePO          = (id)       => axios.post(`${BASE}/${id}/receive`);
export const deletePO           = (id)       => axios.delete(`${BASE}/${id}`);
export const generatePOId       = ()         => axios.get(`${BASE}/generate-id`);
