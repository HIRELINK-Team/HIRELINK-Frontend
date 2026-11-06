import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import JobForm from '../../components/employer/JobForm';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { createDefaultJobFormValues } from '../../data/employerJobFormData';
import { EMPLOYER_INDUSTRY_OPTIONS } from '../../data/employerProfileData';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import { useEmployerWorkplaces } from '../../hooks/useEmployerWorkplaces';
import type { IndustryCode, JobFormValues } from '../../types/jobForm';
import type {
  CreateJobPostingRequest,
  JobPostingDetailResponse,
  JobPostingStatus,
  JobPostingWageType,
  UpdateJobPostingRequest,
} from '../../types/jobPosting';
import {
  jobPostingWorkTimesToSchedule,
  scheduleToJobPostingWorkTimes,
} from '../../utils/jobPosting';

interface PreviousJobRouteState {
  previousJobId?: number;
}

function getIndustryCode(detail: JobPostingDetailResponse): IndustryCode {
  const option = EMPLOYER_INDUSTRY_OPTIONS.find(
    (candidate) => candidate.id === detail.businessTypeId,
  );
  return option?.value ?? '';
}

function detailToFormValues(detail: JobPostingDetailResponse): JobFormValues {
  return {
    workplaceId: detail.workplaceId,
    workplace: detail.workplaceName,
    jobTitle: detail.jobRole ?? '',
    industry: getIndustryCode(detail),
    headcount:
      detail.recruitmentCount === null ? '' : String(detail.recruitmentCount),
    salary: detail.wageAmount === null ? '' : String(detail.wageAmount),
    salaryType: detail.wageType ?? 'HOURLY',
    startDate: detail.workStartDate ?? '',
    koreanLevel: detail.requiredKoreanLevel ?? '',
    preferredExperience: detail.preferredExperience ?? '',
    deadline: detail.applicationDeadlineDate ?? '',
    schedule: jobPostingWorkTimesToSchedule(detail.workTimes),
    isScheduleNegotiable: detail.workTimeNegotiable ?? false,
  };
}

function getBusinessTypeId(industry: IndustryCode) {
  return EMPLOYER_INDUSTRY_OPTIONS.find((option) => option.value === industry)
    ?.id;
}

function buildCreateRequest(
  values: JobFormValues,
  status: 'DRAFT' | 'RECRUITING',
): CreateJobPostingRequest {
  if (values.workplaceId === null) {
    throw new Error('사업장을 선택해 주세요.');
  }

  const request: CreateJobPostingRequest = {
    workplaceId: values.workplaceId,
    status,
  };
  const businessTypeId = getBusinessTypeId(values.industry);
  const workTimes = scheduleToJobPostingWorkTimes(values.schedule);

  if (businessTypeId !== undefined) request.businessTypeId = businessTypeId;
  if (values.jobTitle.trim()) request.jobRole = values.jobTitle.trim();
  if (values.headcount) request.recruitmentCount = Number(values.headcount);
  request.wageType = values.salaryType;
  if (values.salary) request.wageAmount = Number(values.salary);
  if (values.startDate) request.workStartDate = values.startDate;
  if (values.koreanLevel) request.requiredKoreanLevel = values.koreanLevel;
  if (values.preferredExperience)
    request.preferredExperience = values.preferredExperience;
  if (values.deadline) request.applicationDeadlineDate = values.deadline;
  request.workTimeNegotiable = values.isScheduleNegotiable;
  if (workTimes.length > 0) request.workTimes = workTimes;
  return request;
}

function buildUpdateRequest(
  initialValues: JobFormValues,
  values: JobFormValues,
  initialServerWageType: JobPostingWageType | null,
  promoteToRecruiting: boolean,
): UpdateJobPostingRequest {
  const request: UpdateJobPostingRequest = {};
  const initialBusinessTypeId = getBusinessTypeId(initialValues.industry);
  const businessTypeId = getBusinessTypeId(values.industry);

  if (
    businessTypeId !== undefined &&
    businessTypeId !== initialBusinessTypeId
  ) {
    request.businessTypeId = businessTypeId;
  }
  if (
    values.jobTitle.trim() &&
    values.jobTitle.trim() !== initialValues.jobTitle.trim()
  ) {
    request.jobRole = values.jobTitle.trim();
  }
  if (values.headcount && values.headcount !== initialValues.headcount) {
    request.recruitmentCount = Number(values.headcount);
  }
  if (values.salaryType !== initialServerWageType) {
    request.wageType = values.salaryType;
  }
  if (values.salary && values.salary !== initialValues.salary) {
    request.wageAmount = Number(values.salary);
  }
  if (values.startDate && values.startDate !== initialValues.startDate) {
    request.workStartDate = values.startDate;
  }
  if (values.koreanLevel && values.koreanLevel !== initialValues.koreanLevel) {
    request.requiredKoreanLevel = values.koreanLevel;
  }
  if (
    values.preferredExperience &&
    values.preferredExperience !== initialValues.preferredExperience
  ) {
    request.preferredExperience = values.preferredExperience;
  }
  if (values.deadline && values.deadline !== initialValues.deadline) {
    request.applicationDeadlineDate = values.deadline;
  }
  if (values.isScheduleNegotiable !== initialValues.isScheduleNegotiable) {
    request.workTimeNegotiable = values.isScheduleNegotiable;
  }

  const initialWorkTimes = scheduleToJobPostingWorkTimes(
    initialValues.schedule,
  );
  const workTimes = scheduleToJobPostingWorkTimes(values.schedule);
  if (JSON.stringify(workTimes) !== JSON.stringify(initialWorkTimes)) {
    request.workTimes = workTimes;
  }
  if (promoteToRecruiting) request.status = 'RECRUITING';
  return request;
}

function getSaveErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 409) {
    return apiError?.code === 'JOB_POSTING_STATE_CONFLICT'
      ? '현재 공고 상태에서는 요청한 작업을 할 수 없어요.'
      : (apiError?.message ?? '공고 상태가 변경되어 저장하지 못했어요.');
  }
  if (status === 400)
    return apiError?.message ?? '입력한 공고 정보를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '공고를 저장할 권한이 없습니다.';
  if (status === 404) return '공고 또는 사업장을 찾지 못했습니다.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '공고를 저장하지 못했습니다.';
}

function EmployerJobFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const { loadWorkplaces } = useEmployerWorkplaces();
  const { loadJobDetail, createJob, updateJob } = useEmployerJobs();
  const mode = jobId ? 'EDIT' : 'CREATE';
  const [initialValues, setInitialValues] = useState<JobFormValues | null>(
    null,
  );
  const [initialStatus, setInitialStatus] = useState<JobPostingStatus>();
  const [initialServerWageType, setInitialServerWageType] =
    useState<JobPostingWageType | null>(null);
  const [workplaceOptions, setWorkplaceOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const numericJobId = jobId ? Number(jobId) : null;
    const previousJobId = (location.state as PreviousJobRouteState | null)
      ?.previousJobId;

    Promise.all([
      loadWorkplaces(),
      numericJobId
        ? loadJobDetail(numericJobId)
        : previousJobId
          ? loadJobDetail(previousJobId)
          : Promise.resolve(null),
    ])
      .then(([workplaces, detail]) => {
        if (!isActive) return;
        setWorkplaceOptions(
          workplaces.map((workplace) => ({
            value: String(workplace.workplaceId),
            label: workplace.workplaceName,
          })),
        );

        if (detail) {
          if (numericJobId && detail.status === 'CLOSED') {
            setFeedback('마감된 공고는 수정할 수 없어요.');
            return;
          }
          setInitialValues(detailToFormValues(detail));
          setInitialStatus(numericJobId ? detail.status : undefined);
          setInitialServerWageType(numericJobId ? detail.wageType : null);
          return;
        }

        const values = createDefaultJobFormValues();
        setInitialServerWageType(null);
        const primaryWorkplace = workplaces[0];
        if (primaryWorkplace) {
          values.workplaceId = primaryWorkplace.workplaceId;
          values.workplace = primaryWorkplace.workplaceName;
          const industry = EMPLOYER_INDUSTRY_OPTIONS.find(
            (option) => option.id === primaryWorkplace.businessTypeId,
          );
          values.industry = industry?.value ?? '';
        }
        setInitialValues(values);
      })
      .catch((error: unknown) => {
        if (isActive) setFeedback(getSaveErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [jobId, loadJobDetail, loadWorkplaces, location.state]);

  const handleCancel = () => navigate('/employer/jobs');

  const handleSaveDraft = async (values: JobFormValues) => {
    if (!initialValues) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      if (mode === 'CREATE') {
        await createJob(buildCreateRequest(values, 'DRAFT'));
      } else {
        const numericJobId = Number(jobId);
        const request = buildUpdateRequest(
          initialValues,
          values,
          initialServerWageType,
          false,
        );
        if (Object.keys(request).length > 0) {
          await updateJob(numericJobId, request);
        }
      }
      navigate('/employer/jobs', {
        state: { feedback: '공고를 임시 저장했어요.' },
      });
    } catch (error: unknown) {
      setFeedback(getSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: JobFormValues) => {
    if (!initialValues) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      if (mode === 'CREATE') {
        await createJob(buildCreateRequest(values, 'RECRUITING'));
      } else {
        const request = buildUpdateRequest(
          initialValues,
          values,
          initialServerWageType,
          initialStatus === 'DRAFT',
        );
        if (Object.keys(request).length > 0) {
          await updateJob(Number(jobId), request);
        }
      }
      navigate('/employer/jobs', {
        state: {
          feedback:
            mode === 'CREATE' ? '공고를 등록했어요.' : '공고를 수정했어요.',
        },
      });
    } catch (error: unknown) {
      setFeedback(getSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <p className="pt-16 text-center text-[#70737c]">
        공고 정보를 불러오는 중이에요.
      </p>
    );
  }

  if (!initialValues) {
    return (
      <div className="pt-16 text-center">
        <p className="text-[#70737c]">
          {feedback ?? '공고 정보를 불러오지 못했어요.'}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="mt-4 rounded-xl bg-[#00b894] px-6 py-3 font-semibold text-white"
        >
          공고 목록으로
        </button>
      </div>
    );
  }

  return (
    <>
      <JobForm
        key={`${mode}-${jobId ?? 'new'}-${initialValues.workplaceId}`}
        mode={mode}
        initialStatus={initialStatus}
        initialValues={initialValues}
        workplaceOptions={workplaceOptions}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />
      {feedback && (
        <button
          type="button"
          role="alert"
          onClick={() => setFeedback(null)}
          className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 cursor-pointer rounded-lg bg-[#292a2d] px-6 py-3 text-sm font-medium whitespace-nowrap text-white shadow-lg"
        >
          {feedback}
        </button>
      )}
    </>
  );
}

export default EmployerJobFormPage;
