import { useState } from 'react';

import StudentDocumentManagementPage from './StudentDocumentManagementPage';
import StudentMyPage from './StudentMyPage';

/** Development-only entry point for reviewing the student My screen. */
export default function StudentMyPreviewPage() {
  const [isDocumentManagementOpen, setIsDocumentManagementOpen] =
    useState(false);

  if (isDocumentManagementOpen) {
    return (
      <StudentDocumentManagementPage
        onExit={() => setIsDocumentManagementOpen(false)}
      />
    );
  }

  return (
    <StudentMyPage
      onDocumentManagementClick={() => setIsDocumentManagementOpen(true)}
    />
  );
}
