import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory`;

// ── Export (trigger browser download) ──
export const exportProducts     = () => window.open(`${BASE}/export/products`,     "_blank");
export const exportTransactions = () => window.open(`${BASE}/export/transactions`, "_blank");
export const downloadTemplate   = () => window.open(`${BASE}/export/template/products`, "_blank");

// ── Import ──
export const previewImport = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/import/products/preview`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const commitImport = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/import/products/commit`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
