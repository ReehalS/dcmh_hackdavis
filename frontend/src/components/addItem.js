import React, { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';


const ItemForm = () => {
    const { user } = useAuthContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [maxAmount, setMaxAmount] = useState(0);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const item = { title, description, category,maxAmount, currentAmount, claimedAmount};

        const response = await fetch('https://dcmh-hackdavis-backend.vercel.app/api/item', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setTitle('');
            setDescription('');
            setCategory('');
            setMaxAmount(0);
            setCurrentAmount(0);
            setClaimedAmount(0);
            setError(null);
        }
    };

    return (
        <div className="homeItemsContainer">
            <div className="homeItemsTable">
                <form className="form-container create" onSubmit={handleSubmit}>
                    <h2>Add a New Item</h2>

                    <TextField
                        label="Item Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <FormControl>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                            className="select-item"
                        >
                            <MenuItem value="Food & Supplies">Food & Supplies</MenuItem>
                            <MenuItem value="Cleaning and Sanitizing">Cleaning and Sanitizing</MenuItem>
                            <MenuItem value="Hygiene">Hygiene</MenuItem>
                            <MenuItem value="Medicine">Medicine</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        label="Maximum Amount"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />

                    <TextField
                        type="number"
                        label="Current Amount"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                    />

                    <TextField
                        type="number"
                        label="Claimed Amount"
                        value={claimedAmount}
                        onChange={(e) => setClaimedAmount(e.target.value)}
                    />

                    <Button variant="contained" type="submit">Add Item</Button>
                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ItemForm;
