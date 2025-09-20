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
        <select name="category" value={category} onChange={onChange} required>
          <option value="">Select Category</option>
          <option value="Electrical">Electrical</option>
          <option value="Hardware">Hardware</option>
          <option value="Plumbing">Plumbing</option>
        </select>
        <select name="brand" value={brand} onChange={onChange}>
          <option value="">Select Brand</option>
          <option value="Ketko">Ketko</option>
          <option value="Anchor">Anchor</option>
          <option value="Generic">Generic</option>
        </select>
        <input type="text" placeholder="Supplier" name="supplier" value={supplier} onChange={onChange} />
        <input type="number" placeholder="Cost Price" name="costPrice" value={costPrice} onChange={onChange} required />
        <input type="number" placeholder="Selling Price" name="sellingPrice" value={sellingPrice} onChange={onChange} required />
        <input type="number" placeholder="Stock Quantity" name="stockQuantity" value={stockQuantity} onChange={onChange} required />
        <select name="reorderLevel" value={reorderLevel} onChange={onChange}>
          <option value="">Select Reorder Level</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <input type="submit" value="Add Product" />
      </form>
    </div>
  );
};

export default AddProductPage;
