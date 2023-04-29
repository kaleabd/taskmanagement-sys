import axios from "axios"
import React,{ useState } from "react"
import { useAuthStore } from "../store/authStore"

type Props = {
    id: number,
    isdone: boolean,
}

const EditTasks: React.FC<Props> = ({id, isdone}) => {
    const {username} = useAuthStore();
    const [eachTask, setEachTask] = useState({
        tasks: "", 
        person_name: username,
        isdone: isdone,
      });
    // loading buttons
    const [loading, setLoading] = useState(false);

      const handleChange = async () => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/api/tasks/update/${id}`, {...eachTask, isdone: !eachTask.isdone})
            setEachTask({
                ...eachTask,
                isdone: !eachTask.isdone
            })
            console.log('updated task successfully')
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

  return (
    <div>
        <input
            type="checkbox"
            name="isdone"
            checked={eachTask.isdone}
            onChange={handleChange}
            className="w-10 h-10"
        />
        {loading ? '...' : ''}
    </div>
  )
}

export default EditTasks