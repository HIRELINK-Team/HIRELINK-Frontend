import type { StudentOnboardingTermAgreements } from '../pages/student/StudentTermsAgreementPage';
import type {
  SocialSignupTerm,
  SocialSignupTermsRequest,
} from '../types/socialTerms';

type AgreementId = keyof StudentOnboardingTermAgreements;
type MappedSocialTerm = SocialSignupTerm & { agreementId: AgreementId };

export function mapStudentSocialTerms(
  terms: SocialSignupTerm[],
): MappedSocialTerm[] | null {
  const seen = new Set<AgreementId>();
  const mapped: MappedSocialTerm[] = [];
  for (const term of terms) {
    const name = term.termTypeName
      .replace(/[\s·ㆍ.]/g, '')
      .replace(/동의$/, '');
    let agreementId: AgreementId | undefined;
    if (name === '서비스이용약관') agreementId = 'serviceTerms';
    else if (name === '개인정보수집이용' || name === '개인정보수집및이용')
      agreementId = 'personalInformationCollection';
    else if (name === '개인정보제3자제공') agreementId = 'thirdPartyProvision';
    else if (
      name === '고유식별정보수집이용' ||
      name === '고유식별정보수집및이용'
    )
      agreementId = 'uniqueIdentification';
    else if (name === '마케팅정보수신') agreementId = 'marketing';
    if (!agreementId || seen.has(agreementId) || !term.currentVersion)
      return null;
    seen.add(agreementId);
    mapped.push({ ...term, agreementId });
  }
  return mapped.length > 0 ? mapped : null;
}

export function mapStudentSocialTermAgreements(
  terms: MappedSocialTerm[],
  agreements: StudentOnboardingTermAgreements,
): SocialSignupTermsRequest {
  return {
    agreements: terms.map((term) => ({
      termTypeId: term.termTypeId,
      version: term.currentVersion!,
      isAgreed: agreements[term.agreementId],
    })),
  };
}
