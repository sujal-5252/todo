import axios from 'axios';

class TodoService {
  api = axios.create({
    baseURL: 'http://localhost:3001/api/',
  });

  constructor() {
    this.api.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem('access-token');

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      function (error) {
        console.log(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.data.message === 'jwt expired' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              'http://localhost:3001/auth/refresh-token',
              { refreshToken: localStorage.getItem('refresh-token') }
            );
            console.log(response);

            if (response) {
              localStorage.setItem('access-token', response.data.accessToken);
              localStorage.setItem('refresh-token', response.data.refreshToken);

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${response.data.accessToken}`;

              return this.api(originalRequest);
            }
          } catch (error) {
            console.log(error);
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');

            window.location.reload();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async getAllTodo(query = '', tag = '', sortBy = '') {
    const response = await this.api.get(
      `/todo?tag=${tag}&sortBy=${sortBy}&query=${query}`
    );
    const todos = response.data.result;
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
