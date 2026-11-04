import type { StudentApplication } from '../types/studentApplication';
import type { StudentHomeSummary } from '../types/studentHome';
import type { StudentMatchingPreferencesResponse } from '../types/studentMatchingPreferences';
import type { StudentProfileResponse } from '../types/studentProfile';
import type { StudentRecommendationsResponse } from '../types/studentRecommendation';
import { DAY_LABELS } from '../utils/workSchedule';

const BUSINESS_TYPE_LABELS: Readonly<Record<string, string>> = {
  ACADEMIC: '전공·학업',
  DUTY_FREE: '면세점',
  FOOD_AND_CAFE: '음식점·카페',
  FOOD_CAFE: '음식점·카페',
  INTERNSHIP: '인턴십',
  INTERPRETATION: '통·번역',
  OFFICE_AND_TOURISM: '사무·관광',
  OTHER: '기타',
  RETAIL: '매장·판매',
};

export const EMPTY_STUDENT_HOME_SUMMARY: StudentHomeSummary = {
  applications: { completed: 0, offer: 0, reviewing: 0, total: 0 },
  conditions: [],
  greetingName: '회원',
  recommendedJobCount: 0,
};

function summarizeApplications(applications: StudentApplication[]) {
  return applications.reduce(
    (summary, application) => {
      summary.total += 1;

      if (application.matchId !== null) summary.completed += 1;
      else if (application.offerId !== null) summary.offer += 1;
      else summary.reviewing += 1;

      return summary;
    },
    { completed: 0, offer: 0, reviewing: 0, total: 0 },
  );
}

function summarizeWorkTimes(preferences: StudentMatchingPreferencesResponse) {
  if (preferences.preferredWorkTimes.length === 0) return '미입력';

  return preferences.preferredWorkTimes
    .map(
      ({ dayOfWeek, startTime, endTime }) =>
        `${DAY_LABELS[dayOfWeek]} ${startTime}-${endTime}`,
    )
    .join(', ');
}

function summarizeJobs(preferences: StudentMatchingPreferencesResponse) {
  if (preferences.businessTypeFlexible) return '업종 무관';
  if (preferences.preferredJobs.length === 0) return '미입력';

  return preferences.preferredJobs
    .map((job) =>
      job.businessTypeName === 'OTHER' && job.otherJobName
        ? job.otherJobName
        : (BUSINESS_TYPE_LABELS[job.businessTypeName] ?? job.businessTypeName),
    )
    .join(', ');
}

export function mapStudentHomeSummary({
  applications,
  matchingPreferences,
  profile,
  recommendations,
}: {
  applications: StudentApplication[];
  matchingPreferences: StudentMatchingPreferencesResponse;
  profile: StudentProfileResponse;
  recommendations: StudentRecommendationsResponse;
}): StudentHomeSummary {
  return {
    applications: summarizeApplications(applications),
    conditions: [
      { label: '근무시간', value: summarizeWorkTimes(matchingPreferences) },
      {
        label: '거리',
        value: matchingPreferences.preferredLocation?.locationName ?? '미입력',
      },
      {
        label: '급여',
        value:
          matchingPreferences.minimumHourlyWage === null
            ? '미입력'
            : `시급 ${matchingPreferences.minimumHourlyWage.toLocaleString('ko-KR')}원 이상`,
      },
      { label: '직종', value: summarizeJobs(matchingPreferences) },
    ],
    greetingName: profile.name,
    recommendedJobCount: recommendations.recommendations.length,
  };
}
