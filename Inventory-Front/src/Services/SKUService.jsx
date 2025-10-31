import axios from 'axios';
 
const SKU_URL='http://localhost:9898/inventory/SKU';
const ID_URL='http://localhost:9898/inventory/all-ids';


	export const save=(sku)=>{
		// TODO Auto-generated method stub
		return axios.post(SKU_URL,sku)
	}

	export const findSKUById=(id)=>{
		// TODO Auto-generated method stub
		return axios.get(SKU_URL+"/"+id);
	}

	export const removeSKU=(id)=>{
		// TODO Auto-generated method stub
		return axios.delete(SKU_URL+"/"+id);
	}

	
	export const showAllSKUs=()=> {
		// TODO Auto-generated method stub
		return axios.get(SKU_URL);
	}
	
	export const update=(sku)=>{
		return axios.put (SKU_URL,sku);
	}
	
	export const getSkuIdList=()=>{
		return axios.get (ID_URL);
	}
	