import { useState, useHistory} from 'react'

const ItemDetails = ({ item }) => {
  const [amountRequired, setAmountRequired] = useState(item.maxAmount - item.currentAmount)

  const navigateToItemForm = (item) => {
    history.push(`/item-form/`, {item})
  }
  
  return (
    <div className="item-details">
      <h4>{item.title}</h4>
      <p><strong>Category : </strong>{item.category} |
      <strong>Description: </strong>{item.description} |
      <strong>Current Inventory : </strong>{item.currentAmount} |
      <strong>Amount required : </strong>{amountRequired > 0 ? amountRequired : 0} |
      <strong>Claimed amount : </strong>{item.claimedAmount} 
      </p>
      <button onClick={() => navigateToItemForm(item)}>Go to Item Form</button>
    </div>
  )
}

export default ItemDetails