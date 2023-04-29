import axios from "axios"
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";

function Nav() {
    const {isAuthorized,username,setUserName, setAuth} = useAuthStore();
      // loading buttons
      const [loading, setLoading] = useState(false);

    const logOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setLoading(true);
        try {
            await axios.get('http://localhost:3001/logout')
            localStorage.removeItem('user');
            setUserName("")
            setAuth(false)
            console.log('logged out successfully')
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }
  return (
    <nav className="flex justify-between mx-12 mt-12 border-b-2 pb-6">
        <h2 className="text-2xl font-bold">Task-Management</h2>
      <ul className="flex gap-6">
        {!isAuthorized && <li><Link to='/'>Home</Link></li>}
        {!isAuthorized && <li><Link to='/register'>Signup</Link></li>}
        {!isAuthorized && <li><Link to='/login'>Login</Link></li>}
        {isAuthorized && username &&
        (<div className="flex items-center gap-2">
            <h2 >Hello, <span className="font-semibold">{username}</span></h2>
            <button onClick={logOut} className="bg-red-600 text-white px-2 py-2 rounded-lg font-bold text-center">{loading ? 'Loading' : 'Logout'}</button>
        </div>)
        }
        
      </ul>
    </nav>
  );
}

export default Nav;
