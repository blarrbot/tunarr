import { z } from 'zod';
import { TaskSchema } from './schemas/tasksSchema.js';

type Alias<T> = T & { _?: never };

export type Task = Alias<z.infer<typeof TaskSchema>>;
