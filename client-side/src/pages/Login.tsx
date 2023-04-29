import axios from "axios"
import { useState } from "react"
import Nav from "../components/Nav";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom';


export interface UserProps {
    username: string;
    password: string;
}

function Login() {
    const {isAuthorized,setAuth,setUserName} = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(isAuthorized)
    const [userProfile, setUserProfile] = useState<UserProps>({
        username: "",
        password: ""
    })

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
            await axios.post('http://localhost:3001/login/', userProfile)
            .then (response => {
                setAuth(response.data.message)
                setUserName(response.data.user.username)
                navigate('/');
                console.log(response.data.user, response.data.message)
                return response.data.user
                
            })
            console.log('logged in successfully')
        } catch (err) {
            console.log(err)
            console.log('incorrect password or username')
        }
        setLoading(false)
    }
  return (
    <div className="">
        <Nav />
        <div className="flex flex-col justify-center items-center h-[75vh]">
            <h2 className="text-3xl font-bold mb-12">Welcome Back!</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-[50%]">
                    <input type="text" name="username" value={userProfile.username} onChange={handleChange} className="border  px-4 py-4 text-lg"/>
                    <input type="password" name="password" value={userProfile.password} onChange={handleChange} className="border  px-4 py-4 text-lg"/>
                    <button type="submit" className="bg-indigo-600 px-4 py-2 text-2xl text-white">{loading ? 'Loading...' : 'Login'}</button>
            </form>
        </div>

    </div>
    
  )
}

export default Login