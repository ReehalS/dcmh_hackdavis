import Navbar from './components/navbar';
import Table from './components/itemTable';
import Login from './pages/login';
import Signup from './pages/signup';
import ItemForm from './components/addItem';
import Home from './pages/home';
import Admin from './pages/admin';
import ModifyInventory from './components/modifyInventory';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import UserClaimItem from './components/userClaimItem';
import AdminItemTable from './components/adminItemTable';
import { inject } from '@vercel/analytics';
import UserRecieveItem from './components/recordItem';
inject();
const isAdmin = (user) => {
  return user && user.isAdmin;
};

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/home" />}
            />
            <Route
              path="/addItem"
              element={user ? <ItemForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/itemTable"
              element={user ? <Table /> : <Navigate to="/login" />}
            />
            <Route
              path="/userClaimItem"
              element={user ? <UserClaimItem /> : <Navigate to="/login" />}
            />
            <Route
              path="/modifyInventory"
              element={user && isAdmin(user) ? <ModifyInventory /> : <Navigate to="/home" />}
            />
            
            <Route
              path="/admin"
              element={user && isAdmin(user) ? <Admin /> : <Navigate to="/home" />}
            />
            <Route
              path="/adminItemTable"
              element={user && isAdmin(user) ? <AdminItemTable /> : <Navigate to="/home" />}
            />
            <Route
              path="/recieveItem"
              element={user && isAdmin(user) ? <UserRecieveItem /> : <Navigate to="/home" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
