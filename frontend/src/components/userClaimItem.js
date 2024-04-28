import React, { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';

const UserClaimItem = () => {
    const { user } = useAuthContext();

    const [items, setItems] = useState([]); // State to hold fetched items
    const [selectedItem, setSelectedItem] = useState(null); // State to hold selected item
    const [claimAmount, setClaimAmount] = useState(0); // State to hold the claimed amount
    const [error, setError] = useState(null);

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
    };

    // Function to calculate how many items the user can claim
    const calculateClaimableItems = () => {
        if (!selectedItem) return 0;
        const remainingAmount = selectedItem.maxAmount - (selectedItem.currentAmount + selectedItem.claimedAmount);
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
        const newClaimedAmount = selectedItem.claimedAmount + parseInt(claimAmount);

        // Submit the claim
        const claimData = { claimedAmount: newClaimedAmount };

        // Update the item by sending a PATCH request to the server
        const response = await fetch(`http://localhost:4000/api/item/claim/${selectedItem._id}`, {
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
        setSelectedItem(null);
        setClaimAmount(0);
        setError(null);
    };

    return (
        <div>
            <h3>Claim Item</h3>
            <form onSubmit={handleSubmit}>
                <label>Select Item:</label>
                <select onChange={handleTitleChange} value={selectedItem ? selectedItem.title : ''}>
                    <option value="">Select an item</option>
                    {items.map(item => (
                        <option key={item._id} value={item.title}>{item.title}</option>
                    ))}
                </select>

                {selectedItem && (
                    <div>
                        <p><strong>Max Amount</strong>: {selectedItem.maxAmount} | <strong>Current Amount</strong>: {selectedItem.currentAmount}
                         | <strong>Claimed Amount</strong>: {selectedItem.claimedAmount}</p>
                        <p>You can claim at most <strong>{calculateClaimableItems()}</strong> selected item</p>

                        <label>Claim Amount:</label>
                        <input 
                            type="number"
                            value={claimAmount}
                            onChange={(e) => setClaimAmount(e.target.value)}
                        />

                        <button>Claim</button>
                        {error && <div className="error">{error}</div>}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserClaimItem;
