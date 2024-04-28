import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';

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
            console.log(items);
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

        // Update item by sending PUT request to server
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
        <div>
            <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <select
                onChange={handleTitleChange}
                value={selectedItem ? selectedItem.title : ''}
            >
                <option value="">Select an item</option>
                {filteredItems.map(item => (
                    <option key={item._id} value={item.title}>{item.title}</option>
                ))}
            </select>

            {selectedItem && (
                <form className="create" onSubmit={handleSubmit}>
                    <h3>Update Item</h3>

                    <label>Item Title:</label>
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />

                    <label>Description:</label>
                    <input 
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />

                    <label>Category:</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        <option value="">Select a category</option>
                        <option value="Food & Supplies">Food & Supplies</option>
                        <option value="Cleaning and Sanitizing">Cleaning and Sanitizing</option>
                        <option value="Hygiene">Hygiene</option>
                        <option value="Medicine">Medicine</option>
                    </select>

                    <label>Maximum Amount:</label>
                    <input 
                        type="number"
                        onChange={(e) => setMaxAmount(e.target.value)}
                        value={maxAmount}
                    />

                    <label>Current Amount:</label>
                    <input 
                        type="number"
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        value={currentAmount}
                    />
                    
                    <label>Claimed Amount:</label>
                    <input 
                        type="number"
                        onChange={(e) => setClaimedAmount(e.target.value)}
                        value={claimedAmount}
                    />

                    <button>Update Item</button>
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
