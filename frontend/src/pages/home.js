import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ItemsTable from '../components/itemTable';

const Home = () => {
  const [urgentlyNeededItems, setUrgentlyNeededItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://dcmh-hackdavis-backend.vercel.app/api/item/');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        // Filter items where remaining amount > 50% of maxAmount
        const filteredItems = data.filter(item => (calculateClaimableItems(item)) > 0.33 * item.maxAmount);
        setUrgentlyNeededItems(filteredItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

    const calculateClaimableItems = (item) => {
        const remainingAmount = item.maxAmount - (item.currentAmount + item.claimedAmount);
        return remainingAmount > 0 ? remainingAmount : 0;
    };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'claimableItems', headerName: 'Amount Needed', flex: 1, renderCell: (params) => calculateClaimableItems(params.row), headerAlign: 'center', align: 'center' },
    { field: 'action', headerName: 'Donate', flex: 1, renderCell: (params) => (
        <Button onClick={() => navigate(`/userClaimItem`, { state: params.row })} variant="contained" color="success">Donate</Button>
    ), headerAlign: 'center', align: 'center' }
  ];

  return (
    <div>
      <div className="background-section">
        <h2>Want to help provide low-income and unhoused people with the resources they need?</h2>
        <a href="https://interland3.donorperfect.net/weblink/weblink.aspx?name=E357416&id=1" target="_blank" rel="noreferrer">
        <Button size="large" class="donate-block">Donate Online!</Button>
          </a>
      </div>
    
      <div className="dropdown-container">
        <div className="dropdown" style={{ backgroundColor: '#22391c', padding: '20px' }}>
          <h1 className="exclamation-icons"> Urgently Needed Items!</h1>

          <div style={{ height: 400, width: '100%', backgroundColor: "#fff" }}>
          <DataGrid
            style={{ width: '100%', maxWidth: '800px', backgroundColor: "#f1f1f1"}}
            rows={urgentlyNeededItems}
            columns={columns}
            initialState={{
              pageSize: 5,
              page: 0
            }}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            headerClassName={{ backgroundColor: '#772146' }}
          />

          </div>
        </div>
      </div>
      <div className="homeItemsContainer">
        <div className="homeItemsTable" style={{ backgroundColor: '#14390a', padding: '20px' }}>
          <ItemsTable/>
         </div>
    </div>
    </div>
  );
}

export default Home;
