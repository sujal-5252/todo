import mongoose from 'mongoose';
import Todo from './src/models/Todo.js';

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
} catch (err) {
  console.log(err);
}

const todo = new Todo({ title: 'hello', description: 'world' });
await todo.save();
console.log(todo);

console.log(await Todo.find({}));
