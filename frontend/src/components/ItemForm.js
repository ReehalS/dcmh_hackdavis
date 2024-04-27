import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ItemForm = () => {
  const location = useLocation();
  const item = location.state.item;
  const [donationAmount, setDonationAmount] = useState(0);

  const handleDonationChange = (event) => {
    const value = event.target.value;
    if (value >= 0 && value <= item.maxAmount - (item.currentAmount+item.claimedAmount)) {
      setDonationAmount(value);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          amount: donationAmount,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>{item.title}</h4>
      <p>Maximum donation amount: {item.maxAmount - item.currentAmount}</p>
      <input type="number" value={donationAmount} onChange={handleDonationChange} />
      <button type="submit">Donate</button>
    </form>
  )
}

export default ItemForm;