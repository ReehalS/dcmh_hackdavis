import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { Select, MenuItem, Popover, Typography, Button, FormControl , InputLabel} from '@mui/material'; // Import necessary components
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const categories = ['Food & Supplies', 'Cleaning and Sanitizing', 'Hygiene', 'Medicine'];

const ItemsTable = () => {
    
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(true);
    const { user } = useAuthContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchItems = async () => {
            if (!user) {
                return;
            }

            const response = await fetch('http://localhost:4000/api/item', {});
            const json = await response.json();
            if (response.ok) {
                setItems(json);
            }
        };

        fetchItems();
    }, [user]);

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleTitleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const open = Boolean(anchorEl);

    const handleCategoryChange = (event) => {
        const selected = event.target.value;
        setSelectedCategory(selected);
        setShowAllCategories(selected === 'all');
    };

    const calculateClaimableItems = (item) => {
        const remainingAmount = item.maxAmount - (item.currentAmount + item.claimedAmount);
        return remainingAmount > 0 ? remainingAmount : 0;
    };

    const filteredItems = showAllCategories ? items : items.filter(item => item.category === selectedCategory);

    let columns = [
        { field: 'title', headerName: 'Title', flex: 1, headerAlign: 'center', align: 'center', renderCell: (params) => (
            <span onClick={(event) => handleTitleClick(event, params.row)}>{params.value}</span>
        )}
    ];

    if (showAllCategories) {
        columns.push(
            { field: 'category', headerName: 'Category', flex: 1, headerAlign: 'center', align: 'center' }
        );
    }

    columns.push(
        { field: 'claimableItems', headerName: 'Amount Needed', flex: 1, renderCell: (params) => calculateClaimableItems(params.row), headerAlign: 'center', align: 'center' },
        { field: 'action', headerName: 'Donate', flex: 1, renderCell: (params) => (
            <Button onClick={() => navigate(`/userClaimItem`, { state: params.row })} disabled={(params.row.currentAmount + params.row.claimedAmount) >= params.row.maxAmount}>Donate</Button>
        ), headerAlign: 'center', align: 'center' }
    );
    
    
    return (
        <div className="homeItemsContainer">
            <div className="homeItemsTable">
                    <div className="itemTableHeader">
                        <h1>All Items</h1>
                        <FormControl>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory ? selectedCategory : ''}
                            label="Category"
                            onChange={handleCategoryChange}
                            sx={{ width: '250px', marginBottom: '20px' }}
                            className="select-item"
                        >
                        <MenuItem value="all" >All Categories</MenuItem>
                        {categories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                    </FormControl>
            
                    </div>
                    
                    
                    <div className="datagrid-container" style={{ width: '100%', maxWidth: '800px' }}>
                        <DataGrid
                            rows={filteredItems}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection={false}
                            disableSelectionOnClick
                            autoHeight
                            getRowId={(row) => row._id}
                        />
                    </div>    

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        {selectedItem && (
                            <Typography sx={{ p: 2 }}>{selectedItem.description}</Typography>
                        )}
                    </Popover>
                </div>
            
        </div>
    );
};

export default ItemsTable;
