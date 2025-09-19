import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components/Form.css';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    supplier: '',
    costPrice: '',
    sellingPrice: '',
    stockQuantity: '',
    reorderLevel: ''
  });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, category, brand, supplier, costPrice, sellingPrice, stockQuantity, reorderLevel } = formData;

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
      await axios.post('/api/products', formData, config);
      navigate('/inventory');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        <input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required />
        <input type="text" placeholder="Brand" name="brand" value={brand} onChange={onChange} />
        <input type="text" placeholder="Supplier" name="supplier" value={supplier} onChange={onChange} />
        <input type="number" placeholder="Cost Price" name="costPrice" value={costPrice} onChange={onChange} required />
        <input type="number" placeholder="Selling Price" name="sellingPrice" value={sellingPrice} onChange={onChange} required />
        <input type="number" placeholder="Stock Quantity" name="stockQuantity" value={stockQuantity} onChange={onChange} required />
        <input type="number" placeholder="Reorder Level" name="reorderLevel" value={reorderLevel} onChange={onChange} />
        <input type="submit" value="Add Product" />
      </form>
    </div>
  );
};

export default AddProductPage;
