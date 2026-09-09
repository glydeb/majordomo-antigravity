import { CreateTaskDto } from './create-task.dto.js';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  contextId?: string;
  projectId?: string;
  dueDate?: string;
  energyLevel?: string;
  estimatedDuration?: number;
}
