import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InventoryListPage from './pages/InventoryListPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </Router>
  );
};

const MainApp = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Shop Inventory</h1>
        <nav>
          <ul>
            {auth.isAuthenticated ? (
              <>
                <li><Link to="/inventory">Inventory</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                {auth.user && auth.user.role === 'admin' && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
                <li className="logout-item">
                  <button onClick={logout} className="btn logout-button">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/inventory" element={<PrivateRoute><InventoryListPage /></PrivateRoute>} />
          <Route path="/add-product" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
          <Route path="/edit-product/:id" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/inventory" />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Shop Inventory Management</p>
      </footer>
    </div>
  );
};

export default App;
