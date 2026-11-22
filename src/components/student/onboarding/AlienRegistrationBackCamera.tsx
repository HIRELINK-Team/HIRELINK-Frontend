import { AlienRegistrationCamera } from '../documents/AlienRegistrationCamera';

type AlienRegistrationBackCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

export function AlienRegistrationBackCamera({
  onBack,
  onCapture,
}: AlienRegistrationBackCameraProps) {
  return (
    <AlienRegistrationCamera
      onBack={onBack}
      onCapture={onCapture}
      side="back"
    />
  );
}
