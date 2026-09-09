export class CreateTaskDto {
  title!: string;
  description?: string;
  status?: string;
  contextId?: string;
  projectId?: string;
  dueDate?: string;
  energyLevel?: string;
  estimatedDuration?: number;
}
