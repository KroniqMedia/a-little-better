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
  /** Pinned to "To come back to" at the top of Saved. */
  pinned?: boolean;
}

/** What someone wants right now. Each need is answered by a set of message tones. */
export type NeedId = 'comfort' | 'perspective' | 'step';

/** 'system' follows the device setting. */
export type AppearancePreference = 'system' | 'light' | 'dark';

export type ColorSchemeName = 'light' | 'dark';

/** App accent colour. Anything other than 'sage' is part of A Little Better+. */
export type AccentId = 'sage' | 'clay' | 'lavender' | 'sea';

/** 'discreet' keeps the message off the lock screen; 'full' shows it in the notification. */
export type NotificationStyle = 'discreet' | 'full';

export interface Preferences {
  notificationsEnabled: boolean;
  notificationHour: number;
  notificationMinute: number;
  notificationStyle: NotificationStyle;
  hapticsEnabled: boolean;
  language: LanguagePreference;
  appearance: AppearancePreference;
  accent: AccentId;
  /** The one-screen welcome has been seen. */
  welcomed: boolean;
  /** At least one message has been opened beyond today's (used to time the reminder offer). */
  hasTried: boolean;
  /** The reminder offer on Home has been answered (either way). */
  reminderAsked: boolean;
}
