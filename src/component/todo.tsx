import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash, FaStickyNote } from 'react-icons/fa'; // Importing the necessary icons
import './todo.css';

interface TodoItem {
    id: number;
    name: string;
    completed: boolean;
}

const initialData: TodoItem[] = [
    { id: 1, name: 'Cảnh sát', completed: true },
    { id: 2, name: 'Ăn cướp', completed: false },
    { id: 3, name: 'Lính cứu hỏa', completed: true },
    { id: 4, name: 'Đua xe', completed: false },
];

const Todo: React.FC = () => {
    const [tasks, setTasks] = useState<TodoItem[]>(initialData);
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editInputValue, setEditInputValue] = useState<string>('');


    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (inputValue.trim() === '') {
            setError('Không được để tên trống.');
            return;
        }
        if (tasks.some(task => task.name === inputValue)) {
            setError('Không được đặt tên đã có sẵn ');
            return;
        }

        const newTask: TodoItem = {
            id: tasks.length + 1,
            name: inputValue,
            completed: false,
        };

        setTasks([...tasks, newTask]);
        setInputValue('');
        setError('');
    };

    const startEditingTask = (id: number, name: string) => {
        setEditingTaskId(id);
        setEditInputValue(name);
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditInputValue('');
    };

    const saveEditedTask = (id: number) => {
        if (editInputValue.trim() === '') {
            setError('Không được để tên trống.');
            return;
        }

        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, name: editInputValue } : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null);
        setEditInputValue('');
    };


    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const deleteAllTasks = () => {
        if (window.confirm('Bạn có muốn chọn delete all tasks?')) {
            setTasks([]);
        }
    };

    const deleteDoneTasks = () => {
        if (window.confirm('Bạn có muốn chọn delete all completed tasks?')) {
            setTasks(tasks.filter(task => !task.completed));
        }
    };

    const toggleTaskCompletion = (id: number) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    return (
        <>
            <h1 className='title1'>TodoInput</h1>
            <div className='first'>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className='task-input'
                    placeholder='New todo...'
                />
                <br />
                <button className='add-button' onClick={addTask}>Add new task</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <h1 className='title2'>TodoList</h1>
            <div className='render'>
                {tasks.map(task => (
                    <div key={task.id} className='task-item'>
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    type='text'
                                    value={editInputValue}
                                    onChange={(e) => setEditInputValue(e.target.value)}
                                    className='edit-input'
                                />
                                <button onClick={() => saveEditedTask(task.id)}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className={task.completed ? 'completed' : ''}>{task.name}</span>
                                <div className='task-actions'>
                                    <input
                                        type='checkbox'
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(task.id)}
                                    />
                                    <FaPencilAlt className='edit-icon' onClick={() => startEditingTask(task.id, task.name)} />
                                    <FaTrash className='delete-icon' onClick={() => deleteTask(task.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button className='delete-button delete1' onClick={deleteAllTasks}>Delete all tasks</button>
            <button className='delete-button delete2' onClick={deleteDoneTasks}>Delete done tasks</button>
        </>
    );
};

export default Todo;
