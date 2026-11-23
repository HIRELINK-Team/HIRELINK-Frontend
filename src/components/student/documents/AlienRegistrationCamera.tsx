import { useEffect, useRef, useState } from 'react';

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
        setCameraError('카메라를 사용할 수 없어요. 이미지를 업로드해주세요.');
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
            ? '카메라 권한이 거부되었어요. 권한을 허용하거나 이미지를 업로드해주세요.'
            : '카메라에 접근할 수 없어요. 이미지를 업로드해주세요.',
        );
      }
    };

    void startCamera();
    return () => {
      isActive = false;
      isActiveRef.current = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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
      setCameraError('이미지를 캡처하지 못했어요. 다시 시도해주세요.');
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
          setCameraError('이미지를 캡처하지 못했어요. 다시 시도해주세요.');
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
        aria-label="뒤로가기"
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        <img src={backIcon} alt="" />
      </button>

      <p className="mt-[19px] shrink-0 text-center text-[15px] leading-[1.4] font-normal text-[#F5F5F5]">
        영역 안에 등록증이 꽉 차도록 조절하면
        <br />
        자동으로 촬영돼요.
      </p>

      <div
        aria-label={`외국인등록증 ${side === 'front' ? '앞면' : '뒷면'} 촬영 영역`}
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
            빛 반사가 없도록
            <br />
            촬영해주세요
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img src={clarityIcon} alt="" className="h-[46px] w-[46px]" />
          <p className="mt-5">
            정보를 선명하게
            <br />
            보여주세요
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={landscapeIcon}
            alt=""
            className="mt-[7px] h-[35px] w-[35px]"
          />
          <p className="mt-6">
            가로 방향으로
            <br />
            촬영해주세요
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
          else setCameraError('이미지 파일을 선택해주세요.');
        }}
        onTakePhoto={handleCapture}
      />
    </AlienRegistrationOnboardingLayout>
  );
}
