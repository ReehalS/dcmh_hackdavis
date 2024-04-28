import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const UserRecieveItem = () => {
    const { user } = useAuthContext();
    const [items, setItems] = useState([]); 
    const [selectedItem, setSelectedItem] = useState(''); 
    const [recieveAmount, setRecieveAmount] = useState(''); 
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation(); 

    // Access the state passed from the Link
    useEffect(() => {
        if(!location.state) return;
        //console.log(location.state?.title);
        setSelectedItem(location.state?.title);
    }, [location.state]);

    // Fetch items when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('https://dcmh-hackdavis-backend.vercel.app/api/item');
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    // Function to handle selection of an item
    const handleTitleChange = (event) => {
        setSelectedItem(event.target.value);
        setShowAlert(false);
    };

    // Function to calculate how many items the user can recieve
    const calculateRecieveableItems = () => {
        const selectedItemObj = items.find(item => item.title === selectedItem);
        if (!selectedItemObj) return 0;
        const remainingAmount = selectedItemObj.maxAmount - (selectedItemObj.currentAmount);
        return remainingAmount > 0 ? remainingAmount : 0;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        if (recieveAmount <= 0) {
            setError('Please enter a valid Amount to recieve');
            return;
        }

        // Calculate the new recieved amount by adding the entered recieveamount to the existing recieved amount
        const selectedItemObj = items.find(item => item.title === selectedItem);
        if (!selectedItemObj) {
            setError('Please select an item');
            setShowAlert(false);
            return;
        }

        const newRecievedAmount = parseInt(recieveAmount);

        // Submit the recieve
        const recieveData = { recievedAmount: newRecievedAmount };

        // Update the item by sending a PATCH request to the server
        const response = await fetch(`https://dcmh-hackdavis-backend.vercel.app/api/item/recieve/${selectedItemObj._id}`, {
            method: 'PATCH',
            body: JSON.stringify(recieveData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setShowAlert(false);
            return;
        }
        if(response.ok) {
            setShowAlert(true);
        }

        // Reset form fields and errors after successful submission
        setSelectedItem('');
        setRecieveAmount('');
        setError(null);
    };

    return (
        <div>
        <div className="homeItemsContainer">
            <div className="homeItemsTable">
            <h3>Recieve Item</h3>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel>Select Item</InputLabel>
                    <Select
                        label="Item"
                        value={selectedItem}
                        onChange={handleTitleChange}
                        className="select-item"
                    >
                        <MenuItem value="">Select an item</MenuItem>
                        {items.map(item => (
                            <MenuItem key={item._id} value={item.title}>{item.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedItem && (
                    <div>
                        
                        <p>We can recieve at most <strong>{calculateRecieveableItems()}</strong> item(s).</p>

                        <FormControl fullWidth>
                            <TextField
                                label="Recieve Amount"
                                type="number"
                                value={recieveAmount}
                                onChange={(e) => setRecieveAmount(e.target.value)}
                            />
                        </FormControl>

                        <Button variant="contained" type="submit">Recieve</Button>
                        {error && <div className="error">{error}</div>}
                    </div>
                )}
            </form> 
            {showAlert && (
                <Alert severity="success" onClose={() => setShowAlert(false)}>
                    <AlertTitle>Success</AlertTitle>
                    Item amount has been updated successfully!
                </Alert>
            )}
        </div>
        </div>
        </div>
    );
};

export default UserRecieveItem;
