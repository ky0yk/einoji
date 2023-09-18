import { taskRepository } from '../infrastructure/ddb/task-repository';
import { useCaseFactory } from './factory/usecase-factory';

const deleteTask = async (id: string): Promise<void> => {
  await taskRepository.delete(id);
};

export const deleteTaskUseCase = useCaseFactory('deleteTask', deleteTask);
