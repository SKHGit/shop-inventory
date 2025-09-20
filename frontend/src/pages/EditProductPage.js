import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components/Form.css';

const EditProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    supplier: '',
    hsn: '',
    basePrice: '',
    sellingPrice: '',
    stockQuantity: '',
    reorderLevel: ''
  });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': auth.token,
          },
        };
        const res = await axios.get(`/api/products/${id}`, config);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (auth.token) {
      fetchProduct();
    }
  }, [auth.token, id]);

  const { name, category, brand, supplier, hsn, basePrice, sellingPrice, stockQuantity, reorderLevel } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
          'Content-Type': 'application/json'
        }
      };
      await axios.put(`/api/products/${id}`, formData, config);
      navigate('/inventory');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        <input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required />
        <input type="text" placeholder="Brand" name="brand" value={brand} onChange={onChange} />
        <input type="text" placeholder="Supplier" name="supplier" value={supplier} onChange={onChange} />
        <input type="text" placeholder="HSN" name="hsn" value={hsn} onChange={onChange} />
        <input type="number" placeholder="Base Price" name="basePrice" value={basePrice} onChange={onChange} required />
        <input type="number" placeholder="Selling Price" name="sellingPrice" value={sellingPrice} onChange={onChange} required />
        <input type="number" placeholder="Stock Quantity" name="stockQuantity" value={stockQuantity} onChange={onChange} required />
        <input type="number" placeholder="Reorder Level" name="reorderLevel" value={reorderLevel} onChange={onChange} />
        <input type="submit" value="Update Product" className="btn" />
      </form>
    </div>
  );
};

export default EditProductPage;
