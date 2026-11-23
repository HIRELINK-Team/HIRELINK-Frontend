import cornersIcon from '../../../assets/icons/student/documents/topik/camera-corners.svg';
import fileIcon from '../../../assets/icons/student/documents/topik/camera-file.svg';
import scanIcon from '../../../assets/icons/student/documents/topik/camera-scan.svg';
import { DocumentCapturePage } from './DocumentCapturePage';

type TopikCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

export function TopikCamera(props: TopikCameraProps) {
  return (
    <DocumentCapturePage
      cornersIcon={cornersIcon}
      fileIcon={fileIcon}
      scanIcon={scanIcon}
      {...props}
    />
  );
}
