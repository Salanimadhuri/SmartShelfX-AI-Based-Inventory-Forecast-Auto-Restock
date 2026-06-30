import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/batches`;

export const getAllBatches       = ()         => axios.get(BASE);
export const getBatchById        = (id)       => axios.get(`${BASE}/${id}`);
export const getBatchesByProduct = (pid)      => axios.get(`${BASE}/product/${pid}`);
export const getExpirySummary    = ()         => axios.get(`${BASE}/expiry/summary`);
export const getExpiredBatches   = ()         => axios.get(`${BASE}/expiry/expired`);
export const getExpiringSoon     = ()         => axios.get(`${BASE}/expiry/soon`);
export const createBatch         = (batch)    => axios.post(BASE, batch);
export const updateBatch         = (id, b)    => axios.put(`${BASE}/${id}`, b);
export const deleteBatch         = (id)       => axios.delete(`${BASE}/${id}`);
