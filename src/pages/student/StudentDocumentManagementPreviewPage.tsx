import StudentDocumentManagementPage from './StudentDocumentManagementPage';

/** Development-only entry point for reviewing the student document flow. */
export default function StudentDocumentManagementPreviewPage() {
  const initialView =
    new URLSearchParams(window.location.search).get('view') === 'registration'
      ? 'registration'
      : 'guide';

  return <StudentDocumentManagementPage initialView={initialView} />;
}
