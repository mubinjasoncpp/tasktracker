import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tasks from './Tasks';

import "../styles/Dashboard.css";
import "../styles/Tasks.css";

const Dashboard = () => {
    
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [editMode, setEditMode] = useState(false);
    //const [filterResult, setFilterResult] = useState([]);
    const [newTagInput, setNewTagInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        taskName: '',
        description: '',
        selectTags: [],
        endingDate: '',
    });

    useEffect(() => {
        fetchTags();
        fetchData();    
    }, [ newTaskData, selectedTags]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3010/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    const fetchTags = async () => {
        try {
            const response = await fetch('http://localhost:3010/tags');
            const data = await response.json();
            setTags(data.my_tags);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleTagSelection = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((prevSelectedTags) =>
                prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
            );
        } else {
            setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
        }
    };

    const filteredResult =
        selectedTags.length === 0
            ? tasks
            : tasks.filter((task) =>
                task.tags.some((tag) => selectedTags.includes(tag))
            );

    const handleEditButtonClick = () => {
        setEditMode(!editMode);
        // setSelectedTags([]); // Clear selected tags when entering edit mode
    };

    const handleDeleteTag = async (tag) => {
        const tagIndex = tags.indexOf(tag);

        // Check if the tag is found in the array
        if (tagIndex !== -1) {
            // Create a copy of the tags array without the deleted tag
            const updatedTags = [...tags.slice(0, tagIndex), ...tags.slice(tagIndex + 1)];

            try {
                // Assuming your server has an endpoint to update tags, for example:
                // PUT http://localhost:3010/up_tags/update

                const response = await fetch('http://localhost:3010/tags', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any additional headers if needed
                    },
                    body: JSON.stringify({ my_tags: updatedTags }),
                });

                if (response.ok) {
                    // Tag successfully deleted, update the local state or perform any other actions
                    console.log(`Tag "${tag}" deleted successfully.`);
                    fetchTags();
                    setTags(updatedTags);
                    setSelectedTags([]);
                } else {
                    console.error(`Failed to delete tag "${tag}". Server returned ${response.status}.`);
                }
            } catch (error) {
                console.error('Error deleting tag:', error);
            }
        }
    };

    const handleAddTag = async () => {
        if (!newTagInput) return; // Do not add empty tags

        const updatedTags = [...tags, newTagInput];

        try {
            const response = await fetch('http://localhost:3010/tags/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ my_tags: updatedTags }),
            });

            if (response.ok) {
                console.log(`Tag "${newTagInput}" added successfully.`);
                setTags(updatedTags);
                setNewTagInput(''); // Clear the input field after adding the tag
            } else {
                console.error(`Failed to add tag "${newTagInput}". Server returned ${response.status}.`);
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };
    const handleAddTaskClick = () => {
        setShowForm(!showForm);
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleFormTagSelection = (e) => {
        const selectedOptions = e.target.selectedOptions;
        const newSelectTags = Array.from(selectedOptions).map((option) => option.value);
        setNewTaskData((prevData) => ({
            ...prevData,
            selectTags: newSelectTags,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0]

        try {
            const response = await fetch('http://localhost:3010/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_name: newTaskData.taskName,
                    description: newTaskData.description,
                    active:false,
                    tags: newTaskData.selectTags,              
                    starting_time: currentDate,
                    ending_time: newTaskData.endingDate,
                }),
            });
            window.location.reload();
            if (response.ok) {
                console.log('New task added successfully.');
                setShowForm(false);
                fetchData();
                setNewTaskData({
                    taskName: '',
                    description: '',
                    selectTags: [],
                    endingDate: '',
                });
                const updatedTasks = await response.json();
                setTasks(updatedTasks);
            } else {
                console.error(`Failed to add new task. Server returned ${response.status}.`);
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className='tags'>
                <h1>Tag Selector</h1>
                <div>
                    {tags.map((tag, index) => (
                        <label key={index} className={editMode ? 'edit-mode' : ''}>
                            <input
                                type="checkbox"
                                value={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagSelection(tag)}
                            />
                            {tag}
                            {editMode && (
                                <span
                                    className="delete-icon"
                                    onClick={() => handleDeleteTag(tag)}
                                >
                                    &#x2716;
                                </span>
                            )}
                        </label>
                    ))}
                </div>
                {editMode && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter new tag"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                        />
                        <button onClick={handleAddTag}>Add</button>
                    </div>
                )}
                <button onClick={handleEditButtonClick}>
                    {editMode ? 'Done Editing' : 'Edit tags'}
                </button>
                <div>
                    <button onClick={handleAddTaskClick}>Add New Task</button>
                    {showForm && (
                        <form onSubmit={handleFormSubmit} className='add-task-form'>
                            <label>
                                Task Name:
                                <input
                                    type="text"
                                    name="taskName"
                                    value={newTaskData.taskName}
                                    onChange={handleFormInputChange}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={newTaskData.description}
                                    onChange={handleFormInputChange}
                                />
                            </label>
                            <label>
                                Tags:
                                <select
                                    multiple
                                    name="selectTags"
                                    value={newTaskData.selectTags}
                                    onChange={handleFormTagSelection}
                                >
                                    {tags.map((tag) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Ending Date:
                                <input
                                    type="date"
                                    name="endingDate"
                                    value={newTaskData.endingDate}
                                    onChange={handleFormInputChange}
                                />
                            </label>
                            <button type="submit">Add Task</button>
                        </form>
                    )}
                </div>
            </div>
            <div className='task_list'>
                <h1>Task List</h1>
                <div className="task-container">
                    <table className="equal-width-table">
                        <tr>
                            <th>Task Name</th>
                            <th>Tags</th>
                            <th>Status</th>
                            <th>Delete</th>
                            <th>Action</th>
                        </tr>
                    </table>
                    {/* {filteredTasks.map((task) => (
                        <Tasks key={task.id} task={task} />
                    ))} */}
                    {filteredResult.length === 0 ? (
                        <p>No tasks of that tag</p>
                    ) : (
                        filteredResult.map((task) => {
                            return <Tasks key={task.id} task={task} />;
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard