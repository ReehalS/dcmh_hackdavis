import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import AdminItemTable from '../components/adminItemTable';

const Admin = () => {
    const { user } = useAuthContext();

    const [threshold, setThreshold] = useState(0);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const req = { threshold };

    const submit = async () => {
        if (!user) {
            setError('You must be logged in');
            return;
        }
        // sends email with this threshold
        const response = await fetch('https://dcmh-hackdavis-backend.vercel.app/api/email/send-notif', {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            setError(json.error);
        }
        setSent(true);
    }

    return (

        <div className="adminItemsContainer">
            <div className="adminItemsTable">
            <h1 style={{color:"black"}}>Update Inventory</h1>
            
            <Link to="/addItem" className='homeLink'>Add Item</Link>
            <p>  </p>
            <p>  </p>
            <AdminItemTable />

            <div className="claimItem">
            <h2>Running low on supplies?</h2>
            <p>Send users a notification for highly needed items.</p>
            <p>Items with a number of "Amount Needed" higher than this number will be included in the mailing list: </p>
            </div>

            <Box display="flex" justifyContent={'center'}> 
                <TextField 
                    id="standard-basic" 
                    label="Min Amount" 
                    variant="standard" 
                    type="number"
                    sx={{mr:"50px"}}
                    onChange={(e) => setThreshold(e.target.value)}
                    />
                <Button variant="contained" color="success" onClick={submit}>Submit</Button>
            </Box>
            {error && (
                <div className="error">
                    {error}
                </div>
            )}
            {sent && 
                <div className='alert-container'>
                    <Alert severity="success" onClose={() => {setSent(false)}}>
                        Low stock items were successfully sent to the mailing list!
                    </Alert>
                </div>
                
            } 
        </div>
        </div>        
    );
}

export default Admin;