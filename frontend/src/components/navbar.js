import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    logout();
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const truncateEmail = (email) => {
    if (windowWidth <= 768 && email.includes('@')) {
      const atIndex = email.indexOf('@');
      return email.substring(0, atIndex);
    }
    return email;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ background: 'white', paddingLeft: 0, paddingRight: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <img src="DCMH_logo.webp" alt="DCMH Logo" style={{ width: '100px', marginRight: '10px' }} />
          <Link style={{marginRight:'5px', padding:"0px"}} to={user ? (user.isAdmin ? "/admin" : "/home") : "/login"}>
            <h2 style={{marginRight:'5px', padding:"0px"}}>Davis Community Meals and Housing</h2>
          </Link>
        </Box>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          style={{ color: 'black' }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          style={{ marginRight: '30px' }}
        >
          <MenuItem component={Link} to={user ? "/home" : "/about"} onClick={handleMenuClose}>
            {user ? "Home" : "About"}
          </MenuItem>
          {user && (
            <div>
              {user.isAdmin && <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>Admin</MenuItem>}
              {user.isAdmin && <MenuItem component={Link} to="/addItem" onClick={handleMenuClose}><span> </span> Add Item</MenuItem>}
              {user.isAdmin && <MenuItem component={Link} to="/modifyInventory" onClick={handleMenuClose}><span> </span> Modify Inventory</MenuItem>}
              {user.isAdmin && <MenuItem component={Link} to="/recieveItem" onClick={handleMenuClose}><span> </span> Recieve Items</MenuItem>}
              
              <MenuItem component={Link} to="/itemTable" onClick={handleMenuClose}>All Items</MenuItem>
              <MenuItem component={Link} to="/userClaimItem" onClick={handleMenuClose}>Claim Item</MenuItem>
              <MenuItem onClick={handleClick}>Logout</MenuItem>
              <MenuItem disabled>{truncateEmail(user.email)}</MenuItem>
            </div>
          )}
          {!user && (
            <div>
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
              <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>Sign Up</MenuItem>
            </div>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
