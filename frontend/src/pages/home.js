import {Link} from 'react-router-dom';


const Home = () => {
    return (
        <div className="home">
            <h1>Homepage</h1>
            <p>
                <Link to="/addItem" className='homeLink'>Add Item</Link>
                <Link to="/itemTable" className='homeLink'>View Items</Link>
                <Link to="/admin/modifyInventory" className='homeLink'>modifyInventory</Link>
                <Link to="/userClaimItem" className='homeLink'>Claim Item</Link>
                <Link to="/admin/adminItemTable" className='homeLink'>Admin Item Table</Link>
            </p>
           
        </div>
    )   
}

export default Home