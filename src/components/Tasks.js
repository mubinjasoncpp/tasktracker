import React from 'react'
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

import "../styles/Tasks.css";

const Tasks = ({ task }) => {
  const { id, task_name, tags, active } = task;
  const navigate = useNavigate();

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3010/tasks/${task.id}`)
      .then((response) => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div key={id} className="task">
      <table className="equal-width-table">
        <tr>
          <td>
            <h3>{task.task_name}</h3>
          </td>
          <td>
            <p>{task.tags.join(', ')}</p>
          </td>
          <td>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {task.active ? (
                <GoDotFill style={{ color: 'green' }} />
              ) : (
                <GoDotFill style={{ color: 'red' }} />
              )}
              <p>{task.active ? 'Active' : 'Inactive'}</p>
            </div>
          </td>
          <td>
            <button onClick={handleDelete} className='deleteButtom'><MdDelete /></button>
          </td>
          <td>
            <Link to={`/info/${task.id}`}>
            <button className='action'><FaArrowRightToBracket /></button>
            </Link>           
          </td>
        </tr>
      </table>
    </div>
  )
}

export default Tasks