import { mixed, object, string } from 'yup';

const UserValidator = object({
  email: string().email().required(),
  password: string().min(1).required(),
  profile_image: mixed().nullable().default(null),
});

export default UserValidator;
