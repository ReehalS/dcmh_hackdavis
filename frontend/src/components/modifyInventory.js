import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Typography } from '@mui/material';

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

    // Fetch items when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('http://localhost:4000/api/item');
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    // Function to handle selection of an item
    const handleTitleChange = (e) => {
        const selected = items.find(item => item.title === e.target.value);
        setSelectedItem(selected);
        // Load existing values into the form fields
        if (selected) {
            setTitle(selected.title);
            setDescription(selected.description);
            setCategory(selected.category);
            setCurrentAmount(selected.currentAmount);
            setMaxAmount(selected.maxAmount);
            setClaimedAmount(selected.claimedAmount);
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
        }
    };

    // Function to handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modify-inventory-container"> {/* Apply custom class */}
            <TextField
                label="Search by title"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FormControl fullWidth>
                <InputLabel>Select Item</InputLabel>
                <Select
                    value={selectedItem ? selectedItem.title : ''}
                    onChange={handleTitleChange}
                >
                    <MenuItem value="">Select an item</MenuItem>
                    {filteredItems.map(item => (
                        <MenuItem key={item._id} value={item.title}>{item.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedItem && (
                <form onSubmit={handleSubmit} className="modify-inventory-form"> {/* Apply custom class */}
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
        </div>
    );
};

export default ModifyInventory;
