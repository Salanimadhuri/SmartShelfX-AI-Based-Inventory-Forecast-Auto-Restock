import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/auth`;

export const getMailStatus       = ()           => axios.get(`${BASE}/mail-status`);
export const forgotPassword      = (email)      => axios.post(`${BASE}/forgot-password`,  { email });
export const validateResetToken  = (token)      => axios.get(`${BASE}/validate-token`,    { params: { token } });
export const resetPassword       = (token, pw)  => axios.post(`${BASE}/reset-password`,   { token, newPassword: pw });
