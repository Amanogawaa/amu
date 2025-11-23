import { CapstoneGuideline } from '@/server/features/capstone/types';

export default function normalizeCapstoneGuideline(
  data: any
): CapstoneGuideline {
  const normalized = { ...data };

  const fieldsToParseIfString = [
    'gettingStarted',
    'implementationRoadmap',
    'projectStructure',
    'technicalRequirements',
    'evaluationCriteria',
    'moduleMapping',
    'resources',
    'examples',
    'deliverables',
    'suggestedFeatures',
  ];

  for (const field of fieldsToParseIfString) {
    if (normalized[field] && typeof normalized[field] === 'string') {
      try {
        normalized[field] = JSON.parse(normalized[field]);
      } catch (e) {
        console.warn(`Failed to parse ${field}:`, e);
      }
    }
  }

  return normalized as CapstoneGuideline;
}
