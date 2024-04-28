import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom"

const UserBackBtn = () => {

    return (
        <Link to="/home" >
            <ArrowBackIcon sx={{ mt: 2,color:"black"}}/>
        </Link>
    );
}

export default UserBackBtn;