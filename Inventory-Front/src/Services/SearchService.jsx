import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/search`;
export const globalSearch = (query) => axios.get(BASE, { params: { q: query } });
