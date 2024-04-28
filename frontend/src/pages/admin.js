import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

const Admin = () => {
    const { user } = useAuthContext();

    const [threshold, setThreshold] = useState(0);
    const [sent, setSent] = useState(false);

    const req = { threshold };

    const submit = async () => {
        // sends email with this threshold
        const response = await fetch('http://localhost:4000/api/email/send-notif', {
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
        }
        setSent(true);
    }

    return (
        <div>
            <h1>Update Inventory</h1>
            <Box display="flex" justifyContent="flex-end"> 
                <Link to="/addItem" className='homeLink'>Add Item</Link>
            </Box>

            <h2>Running low on supplies?</h2>
            <p>Set a minium amount for all supplies to have in stock at all times: </p>
            <Box display="flex"> 
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
            {sent && 
                <Alert severity="success" onClose={() => {setSent(false)}}>
                    Low stock items were successfully sent to the mailing list!
                </Alert>
            } 
        </div>
    );
}

export default Admin;