import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../components/Form.css';

const ReportsPage = () => {
  const { auth } = useContext(AuthContext);

  const downloadReport = async (url, filename) => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
        responseType: 'blob',
      };
      const res = await axios.get(url, config);
      const blob = new Blob([res.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      <div>
        <button onClick={() => downloadReport('/api/reports/stock/excel', 'stock_levels.xlsx')}>
          Download Stock Levels (Excel)
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => downloadReport('/api/reports/lowstock/pdf', 'low_stock_report.pdf')}>
          Download Low Stock Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
