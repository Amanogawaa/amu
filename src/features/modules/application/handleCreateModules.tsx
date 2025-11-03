import { CreateModulePayload } from '@/server/features/modules/types';
import { ModuleFormValues } from '../domain/ModuleSchema';

export default function handleCreateModules(
  values: ModuleFormValues,
  onSubmit: (payload: CreateModulePayload) => void
) {
  const payload: CreateModulePayload = {
    courseId: values.courseId,
    courseName: values.courseName,
    courseDescription: values.courseDescription,
    noOfModules: values.noOfModules,
    duration: values.duration,
    level: values.level,
    language: values.language,
    learningOutcomes: values.learningOutcomes,
    prerequisites: values.prerequisites,
  };

  onSubmit(payload);
}
