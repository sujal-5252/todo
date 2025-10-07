import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

async function getAllTodo() {
  const response = await api.get('/todo');
  const todos = response.data;
  console.log(todos);
  return todos;
}

async function createTodo(todo) {
  const response = await api.post('/todo', todo);
  console.log(response.data);
  return response.data;
}

async function getAllTags() {
  const tags = new Set();
  const todos = await getAllTodo();
  todos.forEach((todo) => {
    todo.tags.forEach((tag) => tags.add(tag));
  });
  return tags;
}

export { getAllTodo, createTodo, getAllTags };
