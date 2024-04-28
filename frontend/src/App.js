import Navbar from './components/navbar';
import Table from './components/itemTable';
import Login from './pages/login';
import Signup from './pages/signup';
import ItemForm from './components/addItem';
import Home from './pages/home';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';

import { useAuthContext } from './hooks/useAuthContext';


function App() {
  const {user} =useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/home"/>}
              />
            <Route
              path="/home"
              element={user ? <Home/> : <Navigate to="/login"/>}
              />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/home"/>}
              />
            <Route
              path="/signup"
              element={!user ? <Signup/> : <Navigate to="/home"/>}
              />
            <Route
              path="/addItem"
              element={user ? <ItemForm/> : <Navigate to="/login"/>}
              />
            <Route
              path="/itemTable"
              element={user ? <Table/> : <Navigate to="/login"/>}
              />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
