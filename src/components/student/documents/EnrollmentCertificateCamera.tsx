import cornersIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-corners.svg';
import fileIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-file.svg';
import scanIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-scan.svg';
import { DocumentCapturePage } from './DocumentCapturePage';

type EnrollmentCertificateCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

export function EnrollmentCertificateCamera(
  props: EnrollmentCertificateCameraProps,
) {
  return (
    <DocumentCapturePage
      cornersIcon={cornersIcon}
      fileIcon={fileIcon}
      scanIcon={scanIcon}
      {...props}
    />
  );
}
