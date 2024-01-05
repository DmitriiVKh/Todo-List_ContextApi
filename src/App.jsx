import { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext';
import './App.css'

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState(false);


  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3002/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log('Ошибка при получении данных', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      const response = await fetch('http://localhost:3002/todos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: newTodo})
      });

      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (error) {
      console.log('Ошибка при добавлении дела', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3002/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.log('Ошибка при удалении дела', error);
    }
  };

  const updateTodo = async (id, newTitle) => {
    try{
      await fetch(`http://localhost:3002/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: newTitle}),
      });
      setTodos(todos.map((todo) => (todo.id === id ? {...todo, title: newTitle} : todo)))
    } catch (error) {
      console.log('Ошибка при обновлении дел', error);
    }
  };

  const searchTodos = () => {
    const filteredTodos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTodos(filteredTodos);
  };

  const toggleSort = () => {
    setSortMode(!sortMode);
  };

  const sortedTodos = sortMode ? [...todos].sort((a, b) => a.title.localeCompare(b.title)) : [...todos];
  
  return (
    <div className={`todo-list ${darkMode ? 'dark-theme' : ''}`}>

      <div className="todo-list">
        <h1>Todo List</h1>
        <div>
          <input
          type='text'
          placeholder='Новая задача'
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          />
          <button onClick={addTodo}>Добавить задачу</button>
        </div>
         
          <form onSubmit={(event) => { event.preventDefault(); searchTodos(); }}>
            <input
              type='text'
              placeholder='Поиск задачи'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit">Поиск</button>
          </form>

         <div>
          <label>
          <input
          type='checkbox'
          onChange={toggleSort}
          />
          Сортировать по алфавиту
          </label>
         </div>

         <div>
          <label>
            <input
              type='checkbox'
              onChange={toggleDarkMode}
            />
            Сменить тему
          </label>
        </div>

         <ul>
          {sortedTodos.map((todo) => (
            <li key={todo.id}>
              {todo.title}
              <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
              <button
                onClick={() => {
                  const newTitle = prompt('Введите новое название задачи:', todo.title);
                  if (newTitle !== null) {
                    updateTodo(todo.id, newTitle);
                  }
                }}
              >
                Изменить
              </button>
            </li>
          ))}
        </ul>
       
      </div>
    </div>
  
  );
}


export default App