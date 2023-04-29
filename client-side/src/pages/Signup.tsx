import axios from "axios"
import { useState } from "react"
import { UserProps } from "./Login"
import Nav from "../components/Nav"
import Vector from '../assets/welcome.svg'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";

function Signup() {
    const {setAuth,setUserName} = useAuthStore();
    const [userProfile, setUserProfile] = useState<UserProps>({
        username: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({
            ...userProfile,
            [event.target.name] : event.target.value
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        try {
            await axios.post('http://localhost:3001/register', userProfile)
            .then (response => {
                setAuth(response.data.message)
                setUserName(response.data.user.username)
                navigate('/login')
                window.location.reload();
                return response.data.user ;
                
            })
            console.log('registered successfully')
        } catch (err) {
            console.log(err)
            alert('user already registered')
            navigate('/')
        }
        setLoading(false)
    }
  return (
    <div className="">
        <Nav />
        <div className="grid grid-cols-2 gap-4 place-items-center h-[85vh] ">
            <img src={Vector} alt="" className="w-[70%]"/>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-[75%]">
                <input type="text" name="username" value={userProfile.username} onChange={handleChange} className="border  px-4 py-4 text-lg"/>
                <input type="password" name="password" value={userProfile.password} onChange={handleChange} className="border  px-4 py-4 text-lg"/>
                <button type="submit" className="bg-indigo-600 px-4 py-2 text-2xl text-white">{loading ? 'Loading...' : 'Register'}</button>
            </form>
        </div>

    </div>

  )
}

export default Signup