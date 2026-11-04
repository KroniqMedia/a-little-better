export type CategoryId =
  | 'confidence'
  | 'hope'
  | 'comfort'
  | 'fresh-start'
  | 'courage'
  | 'perspective';

/** Languages the app is written in. */
export type Locale = 'en' | 'es';

/** 'system' follows the device language (Spanish devices get Spanish, everything else English). */
export type LanguagePreference = 'system' | Locale;

export type MessageTone =
  | 'reassuring'
  | 'uplifting'
  | 'gentle-challenge'
  | 'reflective'
  | 'grounding';

export type MessageLength = 'short' | 'medium' | 'long';

export interface Message {
  id: string;
  text: string;
  support?: string;
  category: CategoryId;
  tone: MessageTone;
  length: MessageLength;
  tags: string[];
}

export interface Category {
  id: CategoryId;
  /** Friendly label shown in discovery, e.g. "Some Confidence". */
  title: string;
  /** Editorial theme name, e.g. "Self-worth & Confidence". */
  theme: string;
  description: string;
  /** Background tint for cards. */
  tint: string;
  /** Icon / detail color drawn on top of the tint. */
  ink: string;
}

export interface SavedEntry {
  id: string;
  savedAt: number;
}

export interface Preferences {
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  hapticsEnabled: boolean;
  language: LanguagePreference;
}
