import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import '../../LoginView.css';
import { findSKUById, update } from '../../Services/SKUService';

const SKUUpdate = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [sku, setSku] = useState(null); // start with null for loading state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // loading flag
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    findSKUById(id)
      .then(response => {
        setSku(response.data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError("Error fetching SKU details");
        setLoading(false);
      });
  }, [id]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setSku(prev => ({ ...prev, [name]: value }));
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!sku.skuId?.trim()) {
      tempErrors.skuId = "SKU ID is required";
      isValid = false;
    }

    if (!sku.skuDescription?.trim()) {
      tempErrors.skuDescription = "SKU description is required";
      isValid = false;
    }

    setErrors(tempErrors);

    if (isValid) {
      update(sku)
        .then(() => {
          alert("SKU updated successfully");
          navigate('/SkuRepo');
        })
        .catch(() => {
          alert("Error updating SKU");
        });
    }
  };

  const cancelUpdate = () => {
    navigate('/SkuRepo');
  };

  if (loading) return <p>Loading SKU details...</p>;
  if (fetchError) return <p style={{ color: 'red' }}>{fetchError}</p>;

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3">
            <div className="login-box">
              <h2 className="text-center"><u>Update SKU</u></h2>
              <br />
              <form onSubmit={handleValidation}>
                <div className="form-group">
                  <label>SKU ID: </label>
                  <input
                    placeholder="SKU ID"
                    name="skuId"
                    className="form-control"
                    value={sku.skuId}
                    onChange={onChangeHandler} 
                  />
                  {errors.skuId && <p style={{ color: "red" }}>{errors.skuId}</p>}
                </div>
                <div className="form-group">
                  <label>SKU Description: </label>
                  <input
                    placeholder="SKU Description"
                    name="skuDescription"
                    className="form-control"
                    value={sku.skuDescription}
                    onChange={onChangeHandler}
                  />
                  {errors.skuDescription && <p style={{ color: "red" }}>{errors.skuDescription}</p>}
                </div>
                <br />
                <button type="submit" className='btn btn-primary'>Update</button>
                &nbsp;
                <button type="button" className='btn btn-secondary' onClick={cancelUpdate}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SKUUpdate;
