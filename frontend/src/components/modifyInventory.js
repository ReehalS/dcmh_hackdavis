import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Typography, Stack} from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useLocation } from 'react-router-dom';

const ModifyInventory = () => {
    const { user } = useAuthContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [currentAmount, setCurrentAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]); // State to hold fetched items
    const [selectedItem, setSelectedItem] = useState(null); // State to hold selected item
    const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation();

    // Fetch items when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('http://localhost:4000/api/item');
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    useEffect(() => {
        setSearchTerm(location.state?.title.toLowerCase().trim());
    }, [location.state]);

    // Function to handle selection of an item
    const handleTitleChange = (selected) => {
        setSelectedItem(selected);
        if (selected) {
            setTitle(selected.title);
            setDescription(selected.description);
            setCategory(selected.category);
            setCurrentAmount(selected.currentAmount);
            setMaxAmount(selected.maxAmount);
            setClaimedAmount(selected.claimedAmount);
        } else {
            // Clear form fields if no item is selected
            setTitle('');
            setDescription('');
            setCategory('');
            setCurrentAmount(0);
            setMaxAmount(0);
            setClaimedAmount(0);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return;
        }

        const itemData = { title, description, category, currentAmount, maxAmount, claimedAmount };

        // Update item by sending PATCH request to server
        const response = await fetch(`http://localhost:4000/api/item/${selectedItem._id}`, {
            method: 'PATCH',
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }
        if(response.ok) {
            setTitle('');
            setDescription('');
            setCategory('');
            setCurrentAmount(0);
            setMaxAmount(0);
            setClaimedAmount(0);
            setError(null);
            setSelectedItem(null);
            setShowAlert(true);
        }
    };

    // Function to handle search term change
    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        // Filter items based on search term
        const filteredItem = items.find(item =>
            item.title.toLowerCase().includes(searchTerm)
        );

        // Populate the selected item if found
        handleTitleChange(filteredItem);
    };

    // Function to handle search submission
    const handleSearchSubmit = () => {
        // You can perform any additional actions here if needed
        // For this case, we'll just perform the search
        handleSearchChange({ target: { value: searchTerm } });
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modify-inventory-container">
            <Stack direction="row" alignItems="center" spacing={2}> {/* Use Stack to align items horizontally */}
                <TextField
                    label="Search by title"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button variant="contained" onClick={handleSearchSubmit}>Search</Button>
            </Stack>
            <FormControl fullWidth>
                <InputLabel>Select Item</InputLabel>
                <Select
                    value={selectedItem ? selectedItem.title : ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                >
                    <MenuItem value="">Select an item</MenuItem>
                    {filteredItems.map(item => (
                        <MenuItem key={item._id} value={item}>{item.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedItem && (
                <form onSubmit={handleSubmit} className="modify-inventory-form">
                    <Typography variant="h6">Update Item</Typography>
                    <TextField
                        label="Item Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="">Select a category</MenuItem>
                            <MenuItem value="Food & Supplies">Food & Supplies</MenuItem>
                            <MenuItem value="Cleaning and Sanitizing">Cleaning and Sanitizing</MenuItem>
                            <MenuItem value="Hygiene">Hygiene</MenuItem>
                            <MenuItem value="Medicine">Medicine</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Maximum Amount"
                        variant="outlined"
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />
                    <TextField
                        label="Current Amount"
                        variant="outlined"
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                    <TextField
                        label="Claimed Amount"
                        variant="outlined"
                        type="number"
                        value={claimedAmount}
                        onChange={(e) => setClaimedAmount(e.target.value)}
                    />
                    <Button variant="contained" type="submit">Update Item</Button>
                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                </form>
            )}
            {showAlert && (
            <Alert severity="success" onClose={() => setShowAlert(false)}>
                <AlertTitle>Success</AlertTitle>
                Item updated successfully!
            </Alert>
        )}

        </div>
    );
};

export default ModifyInventory;
