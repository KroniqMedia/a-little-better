import { LOCALE_NAMES, LOCALES } from '@/i18n/locale';
import type { LanguagePreference } from '@/types';
import { ChoiceChips } from './ChoiceChips';

interface LanguagePickerProps {
  value: LanguagePreference;
  onChange: (value: LanguagePreference) => void;
  /** "Automatic" in the current language. */
  systemLabel: string;
  label: string;
}

/** Automatic · English · Español. Language names stay in their own language. */
export function LanguagePicker({ value, onChange, systemLabel, label }: LanguagePickerProps) {
  const options: { id: LanguagePreference; label: string }[] = [
    { id: 'system', label: systemLabel },
    ...LOCALES.map((l) => ({ id: l, label: LOCALE_NAMES[l] })),
  ];
  return <ChoiceChips options={options} value={value} onChange={onChange} label={label} />;
}
