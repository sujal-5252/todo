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

async function updateTodo(id, newTodo) {
  const response = await api.put(`/todo/${id}`, newTodo);
  console.log(response);
}

async function deleteTodo(id) {
  const response = await api.delete(`/todo/${id}`);
  console.log(response);
}

async function getTodoByTag(tag) {
  const todos = await getAllTodo();
  return todos.filter((todo) => todo.tags.includes(tag));
}

async function getTodoByQuery(query) {
  const todos = await getAllTodo();
  const result = todos.filter((todo) => {
    console.log(query);
    console.log(todo.title);
    console.log(todo.title.includes(query));
    return (
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      todo.description.toLowerCase().includes(query.toLowerCase())
    );
  });
  console.log(result);
  return result;
}

export {
  getAllTodo,
  createTodo,
  getAllTags,
  updateTodo,
  deleteTodo,
  getTodoByTag,
  getTodoByQuery,
};
