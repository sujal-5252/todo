import axios from 'axios';

class TodoService {
  api = axios.create({
    baseURL: 'http://localhost:3001/api/',
  });

  constructor() {
    this.api.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem('access_token');

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
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.get(
              'http://localhost:3001/auth/refresh-token',
              {
                headers: {
                  Authorization:
                    'Bearer ' + localStorage.getItem('refresh_token'),
                },
              }
            );
            console.log(response);

            if (response) {
              localStorage.setItem('access_token', response.data.accessToken);
              localStorage.setItem('refresh_token', response.data.refreshToken);

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${response.data.accessToken}`;

              return this.api(originalRequest);
            }
          } catch (error) {
            console.log(error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

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
    const formData = new FormData();

    formData.append('title', todo.title);
    formData.append('description', todo.description);
    formData.append('tags', JSON.stringify(todo.tags));
    formData.append('isImportant', todo.isImportant);
    formData.append('attachment', todo.attachment);

    console.log(formData);

    const response = await this.api.post('/todo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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

const todoService = new TodoService();

export default todoService;
