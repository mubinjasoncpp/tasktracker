import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GoDotFill } from "react-icons/go";
import axios from 'axios'

import "../styles/TaskInfo.css";

const TaskInfo = () => {
  const { id } = useParams()
  const [taskInfo, setTaskInfo] = useState([])
  const [isActive, setIsActive] = useState(taskInfo.active);
  const [activeTimes, setActiveTimes] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [intervals, setIntervals] = useState([])

  useEffect(() => {
    getTaskInfo();
    // getAlltags();
    // getSettings();
    // getAllTaskData();
  }, [isActive])
  const getTaskInfo = () => {
    fetch(`http://localhost:3010/tasks/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setTaskInfo(data)
        setActiveTimes(taskInfo.active_list)
        // setIsActive(taskInfo.active)
      })
  }




  const updateTaskStatus = async () => {
    try {
      const currentDate = new Date();

      // const updatedTask = { ...taskInfo, active: !taskInfo.active};
      const updatedTask = {
        ...taskInfo,
        active: !taskInfo.active,
        active_list: [...taskInfo.active_list, currentDate],
      };
      console.log(taskInfo.active_list);
      const response = await fetch(`http://localhost:3010/tasks/${taskInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      setIsActive(!isActive);
      setActiveTimes(updatedTask.active_list);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
   
  };
  console.log(activeTimes);

  const calculateTimeIntervals = () => {
    const intervals = [];

    if (taskInfo.active_list && taskInfo.active_list.length > 0) {
      for (let i = 0; i < taskInfo.active_list.length - 1; i += 2) {
        const activationTime = new Date(taskInfo.active_list[i]);
        const deactivationTime = new Date(taskInfo.active_list[i + 1]);
        const duration = deactivationTime - activationTime;
  
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
  
        const interval = `Activation ${i / 2 + 1}: ${activationTime.toLocaleString()} - Deactivation ${i / 2 + 1}: ${deactivationTime.toLocaleString()} (Duration: ${hours}h ${minutes}m ${seconds}s)`;
        intervals.push(interval);
      }
    }

    return intervals;
  };
  return (
    <div>
      <div className='taskInfo'>
        <div className="taskContainer">
          <h1>{taskInfo.task_name}</h1>
          <p1>{taskInfo.description}</p1>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '90px' }}>
            {taskInfo.active ? (
              <GoDotFill style={{ color: 'green' }} />
            ) : (
              <GoDotFill style={{ color: 'red' }} />
            )}
            <p>{taskInfo.active ? 'Active' : 'Inactive'}</p>
          </div>
          <p>Created at: {taskInfo.starting_time}</p>
          <p>Estimated finish at: {taskInfo.ending_time}</p>
          <button onClick={updateTaskStatus}>Toggle Status</button>
        </div>
      </div>
      <div>
        {activeTimes && activeTimes.length > 0 && !isActive && (
          <div>
            <p>Time Intervals:</p>
            <ul>
              {calculateTimeIntervals().map((interval, index) => (
                <li key={index}>{interval}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskInfo