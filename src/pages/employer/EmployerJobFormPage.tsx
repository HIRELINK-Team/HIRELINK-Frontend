import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import JobForm from "../../components/employer/JobForm";
import {
  createDefaultJobFormValues,
  getEditJobFormValues,
  getPreviousJobFormValues,
} from "../../data/employerJobFormData";

interface PreviousJobRouteState {
  previousJob?: {
    id: string;
  };
}

function EmployerJobFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const mode = jobId ? "EDIT" : "CREATE";
  const [feedback, setFeedback] = useState<string | null>(null);
  const initialValues = useMemo(() => {
    if (jobId) {
      return getEditJobFormValues(jobId);
    }

    const previousJobId = (location.state as PreviousJobRouteState | null)
      ?.previousJob?.id;
    return previousJobId
      ? (getPreviousJobFormValues(previousJobId) ??
          createDefaultJobFormValues())
      : createDefaultJobFormValues();
  }, [jobId, location.state]);

  const handleCancel = () => {
    navigate("/employer/jobs");
  };

  const handleSaveDraft = () => {
    setFeedback("현재 입력값을 임시 저장한 것으로 처리했어요.");
  };

  const handleSubmit = () => {
    setFeedback(
      mode === "CREATE"
        ? "공고 등록을 위한 입력값 검증을 완료했어요."
        : "공고 수정값 검증을 완료했어요.",
    );
  };

  return (
    <>
      <JobForm
        key={`${mode}-${jobId ?? "new"}`}
        mode={mode}
        initialValues={initialValues}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />

      {feedback && (
        <button
          type="button"
          role="status"
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
