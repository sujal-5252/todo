import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

async function getAllTodo(query = '', tag = '', sortBy = '') {
  const response = await api.get(
    `/todo?tag=${tag}&sortBy=${sortBy}&query=${query}`
  );
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

export { getAllTodo, createTodo, getAllTags, updateTodo, deleteTodo };
