import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/analytics`;

export const getValuation        = ()         => axios.get(`${BASE}/valuation`);
export const getAbcAnalysis      = ()         => axios.get(`${BASE}/abc`);
