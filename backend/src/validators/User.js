import * as z from 'zod';

const User = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export default User;
