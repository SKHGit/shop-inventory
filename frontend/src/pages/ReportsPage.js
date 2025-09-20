import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import '../components/Form.css';
import { addDays, subMonths } from 'date-fns';

const ReportsPage = () => {
  const { auth } = useContext(AuthContext);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const downloadReport = async (url, filename, params = {}) => {
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
        responseType: 'blob',
        params
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

  const handleTimeRangeReport = (months) => {
    const endDate = new Date();
    const startDate = subMonths(endDate, months);
    downloadReport('/api/reports/sales', `sales_report_${months}_months.xlsx`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  };

  const handleCustomDateRangeReport = () => {
    const { startDate, endDate } = state[0];
    downloadReport('/api/reports/sales', `sales_report_custom.xlsx`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
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
      <div style={{ marginTop: '20px' }}>
        <h3>Sales Reports</h3>
        <button onClick={() => handleTimeRangeReport(3)}>Last 3 Months</button>
        <button onClick={() => handleTimeRangeReport(6)}>Last 6 Months</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Custom Date Range Sales Report</h3>
        <DateRangePicker
          onChange={item => setState([item.selection])}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
        />
        <button onClick={handleCustomDateRangeReport}>Download Report</button>
      </div>
    </div>
  );
};

export default ReportsPage;
