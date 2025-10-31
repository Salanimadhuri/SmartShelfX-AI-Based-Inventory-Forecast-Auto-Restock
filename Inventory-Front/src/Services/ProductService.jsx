// Services/ProductService.js
import axios from "axios";

const BASE_URL = "http://localhost:9898/inventory/product";
const ID_GEN_URL = "http://localhost:9898/inventory/id-gen";

// Fetch all products
export const getAllProducts = async () => {
  return await axios.get(BASE_URL);
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  return await axios.get(`${BASE_URL}/${id}`);
};



export const updateProductStock = async (product, qty, flag) => {
  // flag must be numeric (0 = issue, 1 = purchase) because backend expects int
  return await axios.put(`${BASE_URL}/${qty}/${flag}`, product);
};

export const updateProductPrice = async (id, purchasePrice, salesPrice) => {
  // Step 1: fetch full product
  const { data } = await getProductById(id);

  // Step 2: update only price fields
  const payload = {
    ...data,
    purchasePrice: Number(purchasePrice),
    salesPrice: Number(salesPrice),
  };

  // Step 3: send back full product
  return await axios.put(BASE_URL, payload);
};

export const fetchProductNames = async () => {
  return await axios.get(`${BASE_URL}/names`);
};




export const saveProduct = async (product) => {
  return await axios.post(BASE_URL, product);
};





// Delete a product
export const deleteProduct = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

// Generate a new product ID
export const generateProductId = async () => {
  return await axios.get(ID_GEN_URL);
};
// Issue = should decrease stock, but backend decreases when flag = 2
export const issueProduct = async (id, qty) => {
  const response = await getProductById(id);
  const product = response.data;
  return await updateProductStock(product, qty, 2); // use 2 for issue
};

// Purchase = should increase stock, but backend increases when flag = 1
export const purchaseProduct = async (id, qty) => {
  const response = await getProductById(id);
  const product = response.data;
  return await updateProductStock(product, qty, 1); // use 1 for purchase
};

