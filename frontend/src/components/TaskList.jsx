import React, { useEffect, useState } from 'react';
import api from '../api';
import './TasksPage.css'; // Подключаем CSS файл

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'new', category: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/a/tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Ошибка загрузки задач:', error);
        setError('Не удалось загрузить задачи. Попробуйте обновить страницу.');
      }
    };

    fetchTasks();
  }, []);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        category: newTask.category.trim(),
      };

      const response = await api.post('/a/tasks/', payload);
      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: '', description: '', status: 'new', category: '' });
      setError(null);
    } catch (error) {
      console.error('Ошибка при создании задачи:', error.response?.data || error.message);
      setError('Ошибка при создании задачи: ' + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/a/tasks/${taskId}/`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status: response.data.status } : task))
      );
      setError(null);
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error.response?.data || error.message);
      setError('Не удалось изменить статус задачи.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    try {
      await api.delete(`/a/tasks/${taskId}/`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setError(null);
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error.response?.data || error.message);
      setError('Не удалось удалить задачу.');
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <h1 className="title">Tasks</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleCreate} className="form">
          <h2 className="subtitle">Создать новую задачу</h2>
          <input
            type="text"
            name="title"
            placeholder="Название"
            value={newTask.title}
            onChange={(e) => handleChange(e, setNewTask)}
            required
            className="input"
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={newTask.description}
            onChange={(e) => handleChange(e, setNewTask)}
            required
            className="textarea"
          ></textarea>
          <select
            name="status"
            value={newTask.status}
            onChange={(e) => handleChange(e, setNewTask)}
            required
            className="select"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Категория"
            value={newTask.category}
            onChange={(e) => handleChange(e, setNewTask)}
            required
            className="input"
          />
          <button type="submit" className="button">Создать</button>
        </form>

        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Категория: {task.category}</p>
              <p>Статус: {task.status || 'Нет статуса'}</p>
              <select
                value={task.status || ''}
                onChange={(e) => handleChangeStatus(task.id, e.target.value)}
                className="select"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => handleDeleteTask(task.id)} className="button">
                Удалить задачу
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TasksPage;
