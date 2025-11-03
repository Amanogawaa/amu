import apiRequest from '@/server/helpers/apiRequest';
import { Chapter, CreateChapterPayload } from './types';

export async function getChapters(moduleId: string) {
  return apiRequest<null, Chapter[]>(`${moduleId}/chapter`, 'get');
}

export async function getChapter(chapterId: string) {
  return apiRequest<null, Chapter>(`chapter/${chapterId}`, 'get');
}

export async function createChapter(
  payload: CreateChapterPayload
): Promise<Chapter> {
  return apiRequest<CreateChapterPayload, Chapter>('chapters', 'post', payload);
}
