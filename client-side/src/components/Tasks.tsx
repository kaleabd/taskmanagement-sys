import axios from "axios"
import { useState, useEffect } from "react"
import { useAuthStore } from "../store/authStore";
import Done from '../assets/done.svg'
import NotDone from '../assets/undone.svg'
import Remove from '../assets/delete.svg'
import EditTasks from "../pages/EditTasks";

interface TasksProps {
    id: number;
    tasks: string;
    person_name: string;
    isdone: boolean;
}

function Tasks() {
    const {username} = useAuthStore();
    const [tasks, setTasks] = useState<TasksProps[]>([])
    const [eachTask, setEachTask] = useState({
        tasks: "", // Change the name of the property to match the input element
        person_name: username,
        isdone: false
      });
      // loading buttons
      const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchTasks = async () => {
          const response = await axios.get<TasksProps[]>("http://localhost:3001/api/tasks")
          setTasks(response.data)
        }
        fetchTasks();
      })

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        setEachTask({
          ...eachTask,
          [name]: newValue
        });
      };
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/api/tasks/create', eachTask)
            console.log('created tasks successfully')
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
      }
      const handleDelete = async (id: number) => {

        try {
          await axios.delete(`http://localhost:3001/api/tasks/delete/${id}`)
          console.log('task deleted successfully')
      } catch (err) {
          console.log(err)
      }
      }

  return (
    <div className="mt-12 flex flex-col gap-8">
        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4"> 
            <input type="text" name="tasks" value={eachTask.tasks} onChange={handleChange} 
            className="border-b-2 border-b-gray-700 outline-none w-[50%] text-2xl px-6 py-1 my-2"/>
            <button type="submit" className="bg-indigo-600 px-4 py-2 text-white font-bold rounded-lg">{loading ? 'Loading...' : 'Submit'}</button>
        </form>
        <div className="flex flex-col-reverse gap-5 justify-start">
            { tasks.length !== 0 ?
                tasks.filter(task => task.person_name === username).map((task) => (
                    <div key={task.id} className="flex justify-center items-center text-2xl gap-6">
                        <EditTasks id={task.id} isdone={task.isdone}/>
                        <h2 className={task.isdone ? "w-[50%] line-through" : "w-[50%]"}>{task.tasks}</h2>
                        <img src={task.isdone ? Done : NotDone}  className="w-8 h-8"/>
                        <h2 className="w-24">{task.isdone ? 'completed' : 'not yet'}</h2>
                        <img src={Remove} alt="" className="w-12 h-8" onClick={() => handleDelete(task.id)}/>
                    </div> 
                )):
                <div className="flex justify-center">
                  <h2>no tasks added yet!</h2>
                </div>
            }
            {

            }
        </div>
    </div>
  )
}

export default Tasks