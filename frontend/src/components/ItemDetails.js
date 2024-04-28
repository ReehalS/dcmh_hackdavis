import { useState} from 'react'
import { Link } from 'react-router-dom'

const ItemDetails = ({ item }) => {
  const [amountRequired, setAmountRequired] = useState(item.maxAmount - item.currentAmount)

  return (
    <div className="item-details">
      <h4>{item.title}</h4>
      <p><strong>Category : </strong>{item.category} |
      <strong>Description: </strong>{item.description} |
      <strong>Current Inventory : </strong>{item.currentAmount} |
      <strong>Amount required : </strong>{amountRequired > 0 ? amountRequired : 0} |
      <strong>Claimed amount : </strong>{item.claimedAmount} 
      </p>
      <Link to="/donate">Donate</Link>
    </div>
  )
}

export default ItemDetails