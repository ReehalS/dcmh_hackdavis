import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { Select, MenuItem, Popover, Typography, Button , InputLabel, FormControl} from '@mui/material'; // Import necessary components
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const categories = ['Food & Supplies', 'Cleaning and Sanitizing', 'Hygiene', 'Medicine'];

const AdminItemTable = () => {
    
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
        { field: 'maxAmount', headerName: 'Max Amount', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'currentAmount', headerName: 'Current Amount', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'claimedAmount', headerName: 'Claimed Amount', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'claimableItems', headerName: 'Amount Needed', flex: 1, renderCell: (params) => calculateClaimableItems(params.row), headerAlign: 'center', align: 'center' },

        { field: 'update', headerName: 'Update', flex: 1, renderCell: (params) => ( 
            <Button onClick={() => navigate(`/modifyInventory`, { state: params.row })}>Update</Button>
        ), headerAlign: 'center', align: 'center' }
    );
    
    
    return (
        <div>
            <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
                value={selectedCategory}
                defaultValue="all"
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
    
            <div className="datagrid-container" style={{ width: '100%', maxWidth: '1000px' }}>
                <DataGrid
                    rows={filteredItems}
                    columns={columns}
                    initialState={{
                        pageSize: 5,
                        page: 0,
                    }}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
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
    );
};

export default AdminItemTable;
