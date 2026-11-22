const WORK_TIME_REASON_PATTERN = /(?:근무\s*)?시간/;
const DISTANCE_REASON_PATTERN = /거리|지역|가까/;

export function formatMatchingComparisonTags(reasons: string[]) {
  const tags: string[] = [];

  if (reasons.some((reason) => WORK_TIME_REASON_PATTERN.test(reason))) {
    tags.push('근무 시간 일치');
  }

  if (reasons.some((reason) => DISTANCE_REASON_PATTERN.test(reason))) {
    tags.push('희망 거리');
  }

  return tags;
}

export function formatMatchingSummary(reasons: string[], fallback = '') {
  const tags = formatMatchingComparisonTags(reasons);

  if (tags.includes('근무 시간 일치') && tags.includes('희망 거리')) {
    return '시간·거리 모두 일치';
  }

  return tags.join(' · ') || fallback;
}

export function formatDistrictAndWalkingTime(
  address: string,
  walkingTimeMinutes?: number | null,
) {
  const district = address.match(/(?:^|\s)([가-힣]+(?:구|군))(?:\s|$)/)?.[1];
  const location = district ?? address.trim();

  if (!location) return '위치 정보 없음';
  if (walkingTimeMinutes === undefined || walkingTimeMinutes === null) {
    return location;
  }

  return `${location} · 도보 ${walkingTimeMinutes}분`;
}
