import cornersIcon from '../../../assets/icons/student/documents/transcript/camera-corners.svg';
import fileIcon from '../../../assets/icons/student/documents/transcript/camera-file.svg';
import scanIcon from '../../../assets/icons/student/documents/transcript/camera-scan.svg';
import { DocumentCapturePage } from './DocumentCapturePage';

type TranscriptCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

export function TranscriptCamera(props: TranscriptCameraProps) {
  return (
    <DocumentCapturePage
      cornersIcon={cornersIcon}
      fileIcon={fileIcon}
      scanIcon={scanIcon}
      {...props}
    />
  );
}
