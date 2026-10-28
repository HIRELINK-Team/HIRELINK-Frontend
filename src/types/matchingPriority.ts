export type MatchingPriorityId = 'workTime' | 'wage' | 'distance' | 'industry';

export type MatchingPriority = {
  description: string;
  id: MatchingPriorityId;
  label: string;
};
