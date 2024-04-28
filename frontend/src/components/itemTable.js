import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Popover, Typography, TableSortLabel, MenuItem, Select, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const categories = ['Food & Supplies', 'Cleaning and Sanitizing', 'Hygiene', 'Medicine'];

const ItemsTable = () => {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(true);
    const { user } = useAuthContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
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

    const handleTitleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const open = Boolean(anchorEl);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

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

    return (
        <div>
            <Select
                value={selectedCategory}
                defaultValue="all"
                onChange={handleCategoryChange}
                sx={{ width: '250px', marginBottom: '20px' }} // Adjust the width and margin as needed
            >
                <MenuItem value="all" >All Categories</MenuItem>
                {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
            </Select>


            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleSortRequest('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Amount Needed</TableCell>
                            <TableCell align="center">Donation link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.map(item => (
                            <TableRow key={item._id} className="table-row">
                                <TableCell align="center">
                                    <Link href="#" onClick={(e) => handleTitleClick(e, item)}>{item.title}</Link>
                                </TableCell>
                                <TableCell align="center">{item.category}</TableCell>
                                <TableCell align="center">{calculateClaimableItems(item)}</TableCell>
                                
                                <TableCell align="center">{((item.currentAmount + item.claimedAmount) < item.maxAmount) ? (
                                    <Button onClick={() => navigate(`/userClaimItem`, { state: { item } })} className="table-link">Donate</Button>  
                                    ) : (
                                        <Button disabled className="table-link">Full</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
            </TableContainer>
        </div>
    );
};

export default ItemsTable;
