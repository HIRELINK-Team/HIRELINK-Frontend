import guideBadgeIcon from '../assets/images/student/documents/guide-badge.png';
import guideEmploymentIcon from '../assets/images/student/documents/guide-employment.png';
import guideLightningIcon from '../assets/images/student/documents/guide-lightning.png';
import guideTargetIcon from '../assets/images/student/documents/guide-target.png';
import type {
  StudentDocument,
  StudentDocumentGuideItem,
} from '../types/studentDocument';

export const STUDENT_DOCUMENT_GUIDE_ITEMS: readonly StudentDocumentGuideItem[] =
  [
    {
      title: 'HIRELINK 인증 뱃지',
      description: '서류 확인된 프로필로 사장님에게 더 신뢰 받아요.',
      icon: guideBadgeIcon,
    },
    {
      title: '지원 가능한 공고만 추천',
      description: '내 조건에 맞지 않는 공고를 미리 거를 수 있어요.',
      icon: guideTargetIcon,
    },
    {
      title: '간편한 지원',
      description: '한 번 등록한 정보로 다음 지원부터 더 빠르게!',
      icon: guideLightningIcon,
    },
    {
      title: '취업허가 준비까지',
      description: '채용 후 필요한 서류와 절차를 안내해드려요.',
      icon: guideEmploymentIcon,
    },
  ];

export const STUDENT_BASIC_DOCUMENTS: readonly StudentDocument[] = [
  {
    id: 'alien-registration-card',
    title: '외국인 등록증',
    status: 'registered',
    registeredAt: '등록일 25.03.12',
  },
  {
    id: 'enrollment-certificate',
    title: '재학증명서',
    status: 'required',
  },
  {
    id: 'transcript',
    title: '성적증명서',
    status: 'registered',
    registeredAt: '등록일 25.03.12',
  },
  {
    id: 'topik-transcript',
    title: 'TOPIK 성적증명서',
    status: 'registered',
    registeredAt: '등록일 25.03.12',
  },
];

export const STUDENT_EMPLOYMENT_DOCUMENT: StudentDocument = {
  id: 'part-time-work-permit',
  title: '시간제 취업 허가',
  status: 'required',
};
