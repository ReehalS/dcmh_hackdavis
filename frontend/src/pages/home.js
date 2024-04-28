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
        const response = await fetch('http://localhost:4000/api/item/');
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
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'claimableItems', headerName: 'Amount Needed', flex: 1, renderCell: (params) => calculateClaimableItems(params.row), headerAlign: 'center', align: 'center' },
    { field: 'action', headerName: 'Donate', flex: 1, renderCell: (params) => (
        <Button onClick={() => navigate(`/userClaimItem`, { state: params.row })}>Donate</Button>
    ), headerAlign: 'center', align: 'center' }
  ];

  return (
    <div>
        <div className="donate-block-container">
        <div className="donate-block">
            Donate Online!
        </div>
            </div>
                <div className="dropdown-container">
                    <div className="dropdown">
                        <h1 className="exclamation-icons">!!! Urgently Needed Items!!!</h1>

                    <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={urgentlyNeededItems}
                        columns={columns}
                        initialState={{
                            pageSize: 5,
                            page: 0
                        }}
                        rowsPerPageOptions={[5]}
                        checkboxSelection={false}
                        disableSelectionOnClick={true}   
                        getRowId={(row) => row._id}
                    />
                    
                    </div>
                </div>
            </div>
        <div className="homeItemsContainer">
            <div className="homeItemsTable">
                <ItemsTable />
            </div>
            
        </div>
    </div>

  );
}

export default Home;
