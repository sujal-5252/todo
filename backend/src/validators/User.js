import { object, string } from 'yup';

const User = object({
  email: string().email().required(),
  password: string().min(1).required(),
});

export default User;
