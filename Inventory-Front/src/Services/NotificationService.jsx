import axios from "axios";
import API_BASE from "./config";
const BASE = `${API_BASE}/inventory/notifications`;
export const getNotifications    = ()    => axios.get(BASE);
export const getUnreadCount      = ()    => axios.get(`${BASE}/unread-count`);
export const markRead            = (id)  => axios.patch(`${BASE}/${id}/read`);
export const markAllRead         = ()    => axios.patch(`${BASE}/read-all`);
export const addNotification     = (n)   => axios.post(BASE, n);
