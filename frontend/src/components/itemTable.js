import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Popover, Typography, TableSortLabel, MenuItem, Select } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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

    useEffect(() => {
        const fetchItems = async () => {
            if (!user) {
                return;
            }

            const response = await fetch('http://localhost:4000/api/item', {});
            const json = await response.json();
            if (response.ok) {
                setItems(json);
                console.log(json);
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

    const filteredItems = showAllCategories ? items : items.filter(item => item.category === selectedCategory);

    return (
        <div>
            <Select
                value={selectedCategory}
                defaultValue="all"
                onChange={handleCategoryChange}
                sx={{ width: '250px' }} // Adjust the width as needed
            >
                <MenuItem value="all" >All Categories</MenuItem>
                {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
            </Select>


            <TableContainer component={Paper} className="table-container">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleSortRequest('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Max Amount</TableCell>
                            <TableCell>Current Amount</TableCell>
                            <TableCell>Claimed Amount</TableCell>
                            <TableCell>Donation link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.map(item => (
                            <TableRow key={item._id} className="table-row">
                                <TableCell>
                                    <Link href="#" onClick={(e) => handleTitleClick(e, item)}>{item.title}</Link>
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.maxAmount}</TableCell>
                                <TableCell>{item.currentAmount}</TableCell>
                                <TableCell>{item.claimedAmount}</TableCell>
                                <TableCell>{((item.currentAmount + item.claimedAmount) < item.maxAmount) ? (
                                    <Link component={RouterLink} to={`/userClaimItem`} className="table-link">Donate</Link>
                                    ) : (
                                        'Full'
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
