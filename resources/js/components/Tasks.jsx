import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tasks');
            setTasks(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTask(prev => ({ ...prev, [name]: value }));
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', newTask);
            setNewTask({ title: '', description: '', status: 'pending' });
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const startEdit = (task) => {
        setEditingTask({ ...task });
    };

    const cancelEdit = () => {
        setEditingTask(null);
    };

    const updateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/tasks/${editingTask.id}`, editingTask);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Task Manager</div>

                        <div className="card-body">
                            <form onSubmit={createTask} className="mb-4">
                                <div className="form-group mb-2">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={newTask.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={newTask.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Status</label>
                                    <select
                                        className="form-control"
                                        name="status"
                                        value={newTask.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Add Task</button>
                            </form>

                            {loading ? (
                                <p>Loading tasks...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4">No tasks found</td>
                                                </tr>
                                            ) : (
                                                tasks.map(task => (
                                                    <tr key={task.id}>
                                                        {editingTask && editingTask.id === task.id ? (
                                                            <>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="title"
                                                                        value={editingTask.title}
                                                                        onChange={handleEditChange}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <textarea
                                                                        className="form-control"
                                                                        name="description"
                                                                        value={editingTask.description || ''}
                                                                        onChange={handleEditChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <select
                                                                        className="form-control"
                                                                        name="status"
                                                                        value={editingTask.status}
                                                                        onChange={handleEditChange}
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="in_progress">In Progress</option>
                                                                        <option value="completed">Completed</option>
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <button onClick={updateTask} className="btn btn-sm btn-success me-1">Save</button>
                                                                    <button onClick={cancelEdit} className="btn btn-sm btn-secondary">Cancel</button>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td>{task.title}</td>
                                                                <td>{task.description}</td>
                                                                <td>
                                                                    <span className={
                                                                        task.status === 'completed' ? 'badge bg-success' :
                                                                        task.status === 'in_progress' ? 'badge bg-warning' :
                                                                        'badge bg-secondary'
                                                                    }>
                                                                        {task.status.replace('_', ' ')}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button onClick={() => startEdit(task)} className="btn btn-sm btn-primary me-1">Edit</button>
                                                                    <button onClick={() => deleteTask(task.id)} className="btn btn-sm btn-danger">Delete</button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tasks;

if (document.getElementById('tasks')) {
    ReactDOM.render(<Tasks />, document.getElementById('tasks'));
}
