import React, { useEffect, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Popover, Typography, TableSortLabel } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


const ItemsTable = () => {
    const [items, setItems] = useState([]);
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

    const sortedItems = items.sort((a, b) => {
        if (orderBy === 'title') {
            return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
        // Add additional sorting logic for other properties if needed
        return 0;
    });

    return (
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
                    {sortedItems.map(item => (
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
                                  ''
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
    );
};

export default ItemsTable;
