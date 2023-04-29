import Nav from "../components/Nav";
import Tasks from "../components/Tasks";
import { useAuthStore } from "../store/authStore";
import { Link } from 'react-router-dom';

function Home() {
    const {isAuthorized} = useAuthStore();

  return (
    <div>
        <Nav />
        {
            isAuthorized ? (
                <div>
                    <Tasks />
                </div>
            ): (
                <div className="flex justify-center flex-col items-center gap-6 h-[50vh]">
                    <div className="text-center flex flex-col gap-4">
                        <h1 className="font-bold text-4xl">
                            Stay organized and efficient
                            with a powerful task management platform
                        </h1>
                        <p>make your life *10 productive!</p>
                    </div>
                    <div className="bg-indigo-600 px-4 py-2">
                    <Link to='/register' className=" text-white  font-bold">GET STARTED</Link>
                    </div>
                    
                </div>
            )
        }
    </div>
  )
}

export default Home