import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-back.svg';
import bulbIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-bulb.svg';
import clarityIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-clarity.svg';
import landscapeIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-landscape.svg';
import { AlienRegistrationOnboardingLayout } from '../onboarding/AlienRegistrationOnboardingLayout';
import { DocumentCaptureActions } from './DocumentCaptureActions';

type AlienRegistrationCameraProps = {
  onBack: () => void;
  onCapture: (image: File) => void;
  side?: 'front' | 'back';
};

export function AlienRegistrationCamera({
  onBack,
  onCapture,
  side = 'front',
}: AlienRegistrationCameraProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActiveRef = useRef(false);
  const [cameraError, setCameraError] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true;
    isActiveRef.current = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(t('my.documents.cameraError'));
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        if (!isActive) return;
        setCameraError(
          error instanceof DOMException &&
            (error.name === 'NotAllowedError' || error.name === 'SecurityError')
            ? t('my.documents.cameraDenied')
            : t('my.documents.cameraAccessError'),
        );
      }
    };

    void startCamera();
    return () => {
      isActive = false;
      isActiveRef.current = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [t]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight || isCapturing)
      return;
    const canvas = document.createElement('canvas');
    const targetRatio = 342 / 207;
    const videoRatio = video.videoWidth / video.videoHeight;
    const width =
      videoRatio > targetRatio
        ? video.videoHeight * targetRatio
        : video.videoWidth;
    const height =
      videoRatio > targetRatio
        ? video.videoHeight
        : video.videoWidth / targetRatio;
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError(t('my.documents.captureError'));
      return;
    }
    context.drawImage(
      video,
      (video.videoWidth - width) / 2,
      (video.videoHeight - height) / 2,
      width,
      height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setIsCapturing(true);
    canvas.toBlob(
      (blob) => {
        if (!isActiveRef.current) return;
        setIsCapturing(false);
        if (!blob) {
          setCameraError(t('my.documents.captureError'));
          return;
        }
        onCapture(
          new File([blob], `alien-registration-${side}.jpg`, {
            type: 'image/jpeg',
          }),
        );
      },
      'image/jpeg',
      0.92,
    );
  };

  return (
    <AlienRegistrationOnboardingLayout variant="camera">
      <button
        type="button"
        onClick={onBack}
        aria-label={t('common.back')}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        <img src={backIcon} alt="" />
      </button>

      <p className="mt-[19px] shrink-0 text-center text-[15px] leading-[1.4] font-normal text-[#F5F5F5]">
        {t('my.alien.capturePrompt').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
      </p>

      <div
        aria-label={t('my.alien.captureArea', { side: t(side === 'front' ? 'my.documents.front' : 'my.documents.backSide') })}
        className="relative mt-[8dvh] aspect-[342/207] w-full max-w-[min(100%,45dvh)] shrink-0 self-center overflow-hidden rounded-[10px] border border-white/90 [@media(max-height:700px)]:mt-[4dvh] [@media(max-height:600px)]:max-w-[min(100%,36dvh)]"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onCanPlay={() => setIsCameraReady(true)}
          className="h-full w-full object-cover"
        />
        {cameraError ? (
          <p
            role="alert"
            className="absolute inset-0 flex items-center justify-center px-4 text-center text-[14px] leading-[1.5] text-white"
          >
            {cameraError}
          </p>
        ) : null}
      </div>

      <section className="mt-[8dvh] grid shrink-0 grid-cols-3 gap-1 text-center text-[clamp(12px,3.85vw,15px)] leading-[1.5] font-normal text-[#F5F5F5]/50 [@media(max-height:700px)]:mt-[4dvh]">
        <div className="flex flex-col items-center">
          <img src={bulbIcon} alt="" className="h-[50px] w-[50px]" />
          <p className="mt-4">
            {t('my.alien.noGlare').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img src={clarityIcon} alt="" className="h-[46px] w-[46px]" />
          <p className="mt-5">
            {t('my.alien.clearInfo').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={landscapeIcon}
            alt=""
            className="mt-[7px] h-[35px] w-[35px]"
          />
          <p className="mt-6">
            {t('my.alien.landscape').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </div>
      </section>

      <DocumentCaptureActions
        accept="image/*"
        className="mt-auto shrink-0 pt-6 [@media(max-height:700px)]:pt-3"
        isTakePhotoDisabled={
          !isCameraReady || isCapturing || Boolean(cameraError)
        }
        onFileUpload={(file) => {
          if (file.type.startsWith('image/')) onCapture(file);
          else setCameraError(t('my.documents.chooseImage'));
        }}
        onTakePhoto={handleCapture}
      />
    </AlienRegistrationOnboardingLayout>
  );
}
