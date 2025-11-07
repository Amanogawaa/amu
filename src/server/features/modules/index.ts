import apiRequest from '@/server/helpers/apiRequest';
import { CreateModulePayload, Module } from './types';

export async function getModules(courseId: string) {
  return apiRequest<null, Module[]>(`/${courseId}/modules`, 'get');
}

export async function getModule(moduleId: string): Promise<Module> {
  return apiRequest<null, Module>(`/modules/${moduleId}`, 'get');
}

export async function createModules(
  payload: CreateModulePayload
): Promise<Module[]> {
  return apiRequest<CreateModulePayload, Module[]>('/modules', 'post', payload);
}
