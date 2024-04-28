import { useEffect } from "react"
import ItemDetails from "../components/ItemDetails"
import {useAuthContext} from '../hooks/useAuthContext'


const Home = () => {
    const [items, setItems] = []
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
        }
      }
  
      fetchItems()
    }, [user])

  return (
    <div className="home">
      <div className="items">
        {Array.isArray(items) ? (
          items.map(item => (
            <ItemDetails item={item} key={item._id} />
          ))
        ) : (
          <p>Items data unavailable</p>
        )}
      </div>
    </div>
  )
}

export default Home