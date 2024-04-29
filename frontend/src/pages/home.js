import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => {
  return (
    <div>
      <div className="donate-block-container">
        <div className="donate-block">
          Donate Online!
        </div>
      </div>
      <div className="dropdown-container">
        <div className="dropdown">
          {/* Dropdown button with icon */}
          <button className="dropbtn">
            !!! Urgently Needed Items!!!<span className="exclamation-icons"></span>
          </button>
          {/* Dropdown content */}
          <div className="dropdown-content">
            {/* List of items with alternating background colors */}
            <div className="item-bar light-green-bg">
              Coffee
              <button><Link to="/userClaimItem" className="donate-btn">Donate</Link></button>
            </div>
            <div className="item-bar dark-green-bg">
              Sugar
              <button><Link to="/userClaimItem" className="donate-btn">Donate</Link></button>
            </div>
            <div className="item-bar light-green-bg">
              Cups
              <button><Link to="/userClaimItem" className="donate-btn">Donate</Link></button>
            </div>
            {/* Add more items as needed */}
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default Home;

