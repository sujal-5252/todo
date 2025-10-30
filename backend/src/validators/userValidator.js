import { mixed, object, string } from 'yup';

const userValidator = object({
  name: string().min(1),
  email: string().email().required(),
  password: string().min(1).required(),
  profile_image: mixed().nullable().default(null),
});

export default userValidator;
