import axios from 'axios';

class TodoService {
  api = axios.create({
    baseURL: 'http://localhost:3001/api/',
  });

  async getAllTodo(query = '', tag = '', sortBy = '') {
    const response = await this.api.get(
      `/todo?tag=${tag}&sortBy=${sortBy}&query=${query}`
    );
    const todos = response.data;
    console.log(todos);

    return todos;
  }

  async createTodo(todo) {
    const response = await this.api.post('/todo', todo);
    console.log(response.data);

    return response.data;
  }

  async getAllTags() {
    const tags = new Set();
    const todos = await this.getAllTodo();
    todos.forEach((todo) => {
      todo.tags.forEach((tag) => tags.add(tag));
    });

    return tags;
  }

  async updateTodo(id, newTodo) {
    const response = await this.api.put(`/todo/${id}`, newTodo);
    console.log(response);
  }

  async deleteTodo(id) {
    const response = await this.api.delete(`/todo/${id}`);
    console.log(response);
  }
}

export default TodoService;
