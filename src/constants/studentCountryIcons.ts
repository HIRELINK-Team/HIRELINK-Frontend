import chinaFlagIcon from '../assets/icons/student/country-china.svg';
import japanFlagIcon from '../assets/icons/student/country-japan.svg';
import mongoliaFlagIcon from '../assets/icons/student/country-mongolia.svg';
import otherCountryIcon from '../assets/icons/student/country-other.svg';
import uzbekistanFlagIcon from '../assets/icons/student/country-uzbekistan.svg';
import vietnamFlagImage from '../assets/images/student/vietnam-flag.png';
import type { CountryOption } from './studentOnboardingOptions';

export const COUNTRY_ICON_BY_NAME: Record<CountryOption, string> = {
  베트남: vietnamFlagImage,
  중국: chinaFlagIcon,
  몽골: mongoliaFlagIcon,
  우즈베키스탄: uzbekistanFlagIcon,
  일본: japanFlagIcon,
  기타: otherCountryIcon,
};
