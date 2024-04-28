// to add an item to the database for the admin page

import React, { useState } from "react"
import { useAuthContext } from '../hooks/useAuthContext'

const ItemForm = () => {
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [currentAmount, setCurrentAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(0)
    const [claimedAmount, setClaimedAmount] = useState(0)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }
        setClaimedAmount(0)
        const item = {title, description, category, currentAmount, maxAmount, claimedAmount}

        const response = await fetch('http://localhost:4000/api/item', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
        }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setTitle('')
            setDescription('')
            setCategory('')
            setCurrentAmount(0)
            setMaxAmount(0)
            setError(null)
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
        <h3>Add a New Item</h3>

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

        <label>Current Amount:</label>
        <input 
            type="number"
            onChange={(e) => setCurrentAmount(e.target.value)}
            value={currentAmount}
        />
        <label>Maximum Amount:</label>
        <input 
            type="number"
            onChange={(e) => setMaxAmount(e.target.value)}
            value={maxAmount}
        />

        <button>Add Item</button>
        {error && (
            <div className="error">
                {error}
            </div>
            )}
        </form>
    )
}

export default ItemForm