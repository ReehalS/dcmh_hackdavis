import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom"

const AdminBackBtn = () => {

    return (
        <Link to="/admin">
            <ArrowBackIcon sx={{ mt: 2, color:"black"}}/>
        </Link>
    );
}

export default AdminBackBtn;