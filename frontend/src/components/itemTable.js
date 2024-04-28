import { useEffect , useState} from "react"
import {useAuthContext} from '../hooks/useAuthContext'


// base holder for generating a table of items
const Table = () => {
    const [items, setItems] = useState([])
    const {user} = useAuthContext()
  
    useEffect(() => {
      const fetchItems = async () => {
        if(!user) {
          return
        }
  
        const response = await fetch('http://localhost:4000/api/item', {})
        const json = await response.json()
        if(response.ok) {
          setItems(json)
          console.log(json)
        }
      }
  
      fetchItems()
    }, [user])

  return (
    <div className="home">
      <div className="items">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Max Amount</th>
            <th>Description</th>
            <th>Current Amount</th>
            <th>Claimed Amount</th>
            <th>Donation link</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.maxAmount}</td>
              <td>{item.description}</td>
              <td>{item.currentAmount}</td>
              <td>{item.claimedAmount}</td>
              <td>{((item.currentAmount + item.claimedAmount) < item.maxAmount) ? (
                <a href="/donation">Donate</a>
              ) : (
                ''
              )}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table