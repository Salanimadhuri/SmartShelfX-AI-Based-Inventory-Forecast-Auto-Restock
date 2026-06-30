import axios from "axios";
import API_BASE from "./config";
const BASE_URL = `${API_BASE}/inventory`;
const ANA_URL  = `${API_BASE}/inventory/analysis`;

export const getAllTransactions = () => axios.get(`${BASE_URL}/transaction`);

export const getTransaction = (id) => axios.get(`${BASE_URL}/transaction/${id}`);

export const saveTransaction = (transaction) =>
  axios.post(`${BASE_URL}/transaction`, transaction);

export const deleteTransaction = (id) =>
  axios.delete(`${BASE_URL}/transaction/${id}`);

export const generateTransactionId = () =>
  axios.get(`${BASE_URL}/transaction-id`);

export const getProductWiseTotalSale = () => axios.get(ANA_URL);

export const getDemandByProduct = (id) => axios.get(`${ANA_URL}/${id}`);
