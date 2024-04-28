import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Snackbar } from '@mui/material';

const UserClaimItem = () => {
    const { user } = useAuthContext();

    const [items, setItems] = useState([]); // State to hold fetched items
    const [selectedItem, setSelectedItem] = useState(''); // State to hold selected item
    const [claimAmount, setClaimAmount] = useState(''); // State to hold the claimed amount
    const [error, setError] = useState(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const [donatedItems, setDonatedItems] = useState(0); // State to hold number of donated items

    // Fetch items when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('http://localhost:4000/api/item');
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    // Fetch number of donated items
    useEffect(() => {
        const fetchDonatedItems = async () => {
            const response = await fetch('http://localhost:4000/api/donatedItems'); // Endpoint to fetch number of donated items
            const data = await response.json();
            setDonatedItems(data.count);
        };
        fetchDonatedItems();
    }, [successAlert]); // Fetch again when a new item is successfully claimed

    // Function to handle selection of an item
    const handleTitleChange = (event) => {
        setSelectedItem(event.target.value);
    };

    // Function to calculate how many items the user can claim
    const calculateClaimableItems = () => {
        const selectedItemObj = items.find(item => item.title === selectedItem);
        if (!selectedItemObj) return 0;
        const remainingAmount = selectedItemObj.maxAmount - (selectedItemObj.currentAmount + selectedItemObj.claimedAmount);
        return remainingAmount > 0 ? remainingAmount : 0;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        // Perform validation checks here if needed

        // Example validation: Check if claim amount is greater than 0
        if (claimAmount <= 0) {
            setError('Please enter a valid claim amount');
            return;
        }

        // Calculate the new claimed amount by adding the entered claim amount to the existing claimed amount
        const selectedItemObj = items.find(item => item.title === selectedItem);
        if (!selectedItemObj) {
            setError('Please select an item');
            return;
        }

        const newClaimedAmount = parseInt(claimAmount);

        // Submit the claim
        const claimData = { claimedAmount: newClaimedAmount };

        // Update the item by sending a PATCH request to the server
        const response = await fetch(`http://localhost:4000/api/item/claim/${selectedItemObj._id}`, {
            method: 'PATCH',
            body: JSON.stringify(claimData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }

        // Reset form fields and errors after successful submission
        setSelectedItem('');
        setClaimAmount('');
        setError(null);
        setSuccessAlert(true); // Show success alert
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessAlert(false);
    };

    return (
        <div>
            <h3>Claim Item</h3>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel>Select Item</InputLabel>
                    <Select
                        value={selectedItem}
                        onChange={handleTitleChange}
                    >
                        <MenuItem value="">Select an item</MenuItem>
                        {items.map(item => (
                            <MenuItem key={item._id} value={item.title}>{item.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedItem && (
                    <div>
                        <p><strong>Max Amount</strong>: {calculateClaimableItems()} | <strong>Current Amount</strong>: {items.find(item => item.title === selectedItem)?.currentAmount}
                         | <strong>Claimed Amount</strong>: {items.find(item => item.title === selectedItem)?.claimedAmount}</p>
                        <p>Description: {items.find(item => item.title === selectedItem)?.description}</p>
                        
                        <p>You can claim at most <strong>{calculateClaimableItems()}</strong> item(s).</p>

                        <FormControl fullWidth>
                            <TextField
                                label="Claim Amount"
                                type="number"
                                value={claimAmount}
                                onChange={(e) => setClaimAmount(e.target.value)}
                            />
                        </FormControl>

                        <Button variant="contained" type="submit">Claim</Button>
                        {error && <div className="error">{error}</div>}
                    </div>
                )}
            </form>
            {/* Success Alert Snackbar */}
            <Snackbar
                open={successAlert}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                message="Item(s) claimed successfully"
            />
        </div>
    );
};

export default UserClaimItem;
