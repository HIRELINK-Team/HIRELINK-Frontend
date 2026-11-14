import {
  acceptStudentEmploymentOffer as acceptStudentEmploymentOfferApi,
  createStudentApplication as createStudentApplicationApi,
  createStudentRecommendations as createStudentRecommendationsApi,
  getEmploymentMatch as getEmploymentMatchApi,
  getMyEmploymentMatches as getMyEmploymentMatchesApi,
  getMyStudentApplication as getMyStudentApplicationApi,
  getMyStudentApplications as getMyStudentApplicationsApi,
  getStudentMatchingPreferences as getStudentMatchingPreferencesApi,
  getStudentProfile as getStudentProfileApi,
  getStudentRecommendation as getStudentRecommendationApi,
  getStudentRecommendations as getStudentRecommendationsApi,
  refreshStudentRecommendations as refreshStudentRecommendationsApi,
  rejectStudentEmploymentOffer as rejectStudentEmploymentOfferApi,
  updateStudentMatchingPreferences as updateStudentMatchingPreferencesApi,
  updateStudentProfile as updateStudentProfileApi,
  withdrawStudentApplication as withdrawStudentApplicationApi,
} from '../api/student';
import { getStudentJobPosting as getStudentJobPostingApi } from '../api/jobPostings';
import { IS_DEMO_MODE } from '../config/demoMode';
import {
  acceptDemoStudentEmploymentOffer,
  createDemoStudentApplication,
  createDemoStudentRecommendations,
  getDemoEmploymentMatch,
  getDemoEmploymentMatches,
  getDemoStudentApplication,
  getDemoStudentApplications,
  getDemoStudentJobPosting,
  getDemoStudentMatchingPreferences,
  getDemoStudentProfile,
  getDemoStudentRecommendation,
  getDemoStudentRecommendations,
  refreshDemoStudentRecommendations,
  rejectDemoStudentEmploymentOffer,
  updateDemoStudentMatchingPreferences,
  updateDemoStudentProfile,
  withdrawDemoStudentApplication,
} from '../mocks/studentDemoData';

export const studentDataSource = {
  acceptEmploymentOffer: IS_DEMO_MODE
    ? acceptDemoStudentEmploymentOffer
    : acceptStudentEmploymentOfferApi,
  createApplication: IS_DEMO_MODE
    ? createDemoStudentApplication
    : createStudentApplicationApi,
  createRecommendations: IS_DEMO_MODE
    ? createDemoStudentRecommendations
    : createStudentRecommendationsApi,
  getApplication: IS_DEMO_MODE
    ? getDemoStudentApplication
    : getMyStudentApplicationApi,
  getApplications: IS_DEMO_MODE
    ? getDemoStudentApplications
    : getMyStudentApplicationsApi,
  getJobPosting: IS_DEMO_MODE
    ? getDemoStudentJobPosting
    : getStudentJobPostingApi,
  getMatch: IS_DEMO_MODE ? getDemoEmploymentMatch : getEmploymentMatchApi,
  getMatches: IS_DEMO_MODE
    ? getDemoEmploymentMatches
    : getMyEmploymentMatchesApi,
  getMatchingPreferences: IS_DEMO_MODE
    ? getDemoStudentMatchingPreferences
    : getStudentMatchingPreferencesApi,
  getProfile: IS_DEMO_MODE ? getDemoStudentProfile : getStudentProfileApi,
  getRecommendation: IS_DEMO_MODE
    ? getDemoStudentRecommendation
    : getStudentRecommendationApi,
  getRecommendations: IS_DEMO_MODE
    ? getDemoStudentRecommendations
    : getStudentRecommendationsApi,
  refreshRecommendations: IS_DEMO_MODE
    ? refreshDemoStudentRecommendations
    : refreshStudentRecommendationsApi,
  rejectEmploymentOffer: IS_DEMO_MODE
    ? rejectDemoStudentEmploymentOffer
    : rejectStudentEmploymentOfferApi,
  updateMatchingPreferences: IS_DEMO_MODE
    ? updateDemoStudentMatchingPreferences
    : updateStudentMatchingPreferencesApi,
  updateProfile: IS_DEMO_MODE
    ? updateDemoStudentProfile
    : updateStudentProfileApi,
  withdrawApplication: IS_DEMO_MODE
    ? withdrawDemoStudentApplication
    : withdrawStudentApplicationApi,
} as const;
