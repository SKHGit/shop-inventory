import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../components/Form.css';

const InventoryListPage = () => {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const res = await axios.get('/api/products', config);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchProducts();
    }
  }, [auth.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': auth.token,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts(); // Refetch products after deleting
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Inventory List</h2>
      <Link to="/add-product">Add Product</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock Quantity</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>{product.stockQuantity}</td>
              <td>{product.sellingPrice}</td>
              <td>
                <Link to={`/edit-product/${product._id}`}>Edit</Link>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryListPage;
