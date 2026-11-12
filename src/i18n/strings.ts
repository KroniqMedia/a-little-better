import type { ActionId } from '@/data/actions';
import type { AccentId, AppearancePreference, CategoryId, Locale, NeedId, NotificationStyle } from '@/types';
import type { MoodId } from '@/data/moods';

/**
 * Every interface string, per language. Messages live in data/messages.
 * `es` is typed against `en`, so a missing or extra key is a type error.
 */
const en = {
  tabs: { home: 'Home', explore: 'Explore', saved: 'Saved' },

  greeting: {
    night: 'Still up? Be gentle with yourself',
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },

  home: {
    todayLabel: 'Today’s message',
    settings: 'Settings',
    somethingElse: 'I need something else today',
    somethingElseHint: 'Moves to how you feel',
    checkinTitle: 'How do you feel today?',
    checkinHint: 'Pick the face that fits. There’s no wrong answer.',
    checkinChosen: (phrase: string) => `You said you’re feeling ${phrase}. Tap another face anytime.`,
    moodHint: 'Opens messages for how you feel',
    needDirect: 'Or go straight to what would help:',
    needA11yHint: 'Opens a message for this',
  },

  needs: {
    comfort: { label: 'Comfort', description: 'Kind words. Nothing you need to do.' },
    perspective: { label: 'Another view', description: 'A different way of looking at it.' },
    step: { label: 'A small step', description: 'Something gentle you can do now.' },
  } satisfies Record<NeedId, { label: string; description: string }>,

  reminderOffer: {
    title: 'Would a daily reminder help?',
    body: (time: string) => `One message a day at ${time}. You can change the time, or turn it off, in Settings.`,
    yes: 'Yes, remind me',
    no: 'Not now',
    done: (time: string) => `Done. See you at ${time}.`,
    denied: 'Notifications are off for this app. You can allow them later in Settings.',
  },

  welcome: {
    body: [
      'A small place for kind, honest words, on ordinary days and difficult ones.',
      'There’s one message a day for everyone. Whenever you need something else, tell the app what would help: comfort, another view or a small step.',
      'No account. Everything stays on your phone.',
    ],
    start: 'Show me today’s message',
  },

  explore: {
    title: 'Explore',
    intro: 'Six small collections, written for different kinds of days. Take your time.',
  },

  saved: {
    title: 'Saved',
    count: (n: number) => (n === 1 ? 'One message worth keeping.' : `${n} messages worth keeping.`),
    emptyTitle: 'Nothing saved just yet.',
    emptyBody: 'Whenever something speaks to you, keep it here.',
    emptyAction: 'Find something',
    pinnedTitle: 'To come back to',
    pinnedEmpty: 'Pin up to 3 messages that helped, and they’ll wait for you here.',
    allTitle: 'Everything saved',
    pin: 'Pin to “To come back to”',
    unpin: 'Unpin from “To come back to”',
    pinFull: 'You already have 3 pinned. Unpin one to make room.',
  },

  category: {
    notFoundTitle: 'We couldn’t find that collection.',
    notFoundBody: 'It may have moved. Everything else is right where you left it.',
    backToExplore: 'Back to Explore',
    feeling: (phrase: string) => `Feeling ${phrase}`,
    another: 'Another message',
    rowLabel: (title: string, theme: string) => `${title}. ${theme}.`,
  },

  moment: {
    forNow: 'For right now',
    needsLabel: 'What would help',
    needChipHint: 'Shows messages of this kind. Tap again to see all kinds.',
    pause: 'Take a breath with it. There’s no rush.',
    done: 'That’s enough for now',
    notForMe: 'This one isn’t for me',
    notForMeDone: 'Got it. You’ll see fewer like that.',
    undo: 'Undo',
  },

  actions: {
    breathe: { title: 'Four slow breaths', body: 'Breathe in while you count to four, and out while you count to six. Do it four times.' },
    'see-five': { title: 'Five things you can see', body: 'Look around and name, quietly, five things you can see.' },
    shoulders: { title: 'Drop your shoulders', body: 'Lift your shoulders up to your ears, hold for a moment, and let them fall. Twice.' },
    water: { title: 'A glass of water', body: 'Get a glass of water and drink it slowly, doing nothing else while you do.' },
    'warm-hands': { title: 'Warm hands', body: 'Hold something warm, or rub your palms together, and notice the warmth spreading.' },
    'one-for-today': { title: 'Just one for today', body: 'Think of what’s on your mind. Which one thing really belongs to today? The rest can wait.' },
    'leave-for-tomorrow': { title: 'Leave one thing for tomorrow', body: 'Pick one thing on your mind that can wait until tomorrow. Tell yourself: not today.' },
    'kinder-sentence': { title: 'Say it more kindly', body: 'Take one harsh thing you’ve said to yourself today and say it again, the way a good friend would.' },
    'did-well': { title: 'One thing you did well', body: 'Think of one thing you did well this week. Say it to yourself in a full sentence.' },
    'look-forward': { title: 'Something to look forward to', body: 'Think of one small thing coming up that you’d enjoy. Picture it for a moment.' },
    'good-surprise': { title: 'A good surprise', body: 'Remember one thing that went better than you expected lately. Stay with it for a few breaths.' },
    'fresh-air': { title: 'Different air', body: 'Open a window or step outside the door. Take three breaths of different air.' },
    'one-good-thing': { title: 'One good thing, right here', body: 'Find one good thing around you right now, however small. Look at it for a few breaths.' },
    listen: { title: 'Listen', body: 'Close your eyes and listen. What’s the furthest sound you can hear?' },
    'tiny-first-step': { title: 'The tiniest first step', body: 'Think of the thing you’re putting off. What’s a first step small enough to do in two minutes? Just name it.' },
  } satisfies Record<ActionId, { title: string; body: string }>,

  practical: {
    offer: (seconds: number) => `Try this · ${seconds} seconds`,
    start: 'Start',
    remaining: (seconds: number) => `${seconds} s`,
    done: 'Done',
    finished: 'That’s it. Nothing else to do.',
    close: 'Close',
  },

  helpful: {
    question: 'Did this help?',
    yes: 'Yes',
    no: 'Not really',
    thanks: 'Glad it did.',
    keep: 'Keep it to come back to',
    kept: 'Kept in “To come back to”.',
    keptSaved: 'Saved. “To come back to” is full, so it’s with your other saved messages.',
    noReply: 'Thanks for saying. Try a different kind?',
    tryDifferent: 'Show a different kind',
  },

  plus: {
    title: 'A Little Better+',
    lede: 'A one-time purchase for a few extra touches. Everything that helps stays free.',
    includedTitle: 'What it adds',
    included: [
      'Four more share-card styles: Dawn, Mist, Forest and Night.',
      'An accent colour for the app: Sage, Clay, Lavender or Sea.',
    ],
    freeTitle: 'Always free',
    free: 'Today’s message, all six collections, choosing what would help, saving, reminders, dark mode and accessibility, privacy controls and backups.',
    accentTitle: 'Accent colour',
    accents: { sage: 'Sage', clay: 'Clay', lavender: 'Lavender', sea: 'Sea' } satisfies Record<AccentId, string>,
    locked: 'Part of A Little Better+',
    buy: (price: string) => `Unlock for ${price}`,
    comingSoon: 'Coming soon',
    comingSoonNote: 'Purchases aren’t open yet in this version of the app.',
    owned: 'You have A Little Better+. Thank you.',
    restore: 'Restore purchase',
    restoreNone: 'No previous purchase was found.',
    error: 'The purchase didn’t go through. You haven’t been charged.',
    devUnlock: 'Unlock for testing (development only)',
    devLock: 'Lock again (development only)',
  },

  message: {
    save: 'Save message',
    unsave: 'Remove from saved',
    share: 'Share message',
  },

  nav: { back: 'Go back', close: 'Close' },

  settings: {
    title: 'Settings',
    reminderGroup: 'Daily reminder',
    dailyMessage: 'Daily message',
    reminderOn: (time: string) => `One gentle reminder at ${time}.`,
    reminderOff: 'One gentle reminder a day. Never more.',
    reminderUnsupported: 'Reminders are available in the iOS and Android apps.',
    reminderTime: 'Reminder time',
    noticeError: 'Reminders couldn’t be set up just now. Please try again in a moment.',
    noticeDenied:
      'Notifications are turned off for A Little Better in your device settings. You can allow them there, then switch the reminder on again.',
    openDeviceSettings: 'Open device settings',
    styleLabel: 'What the reminder shows',
    styles: { discreet: 'Discreet', full: 'Full message' } satisfies Record<NotificationStyle, string>,
    styleHint: {
      discreet: (title: string) => `Shows only “${title.replace(/\.$/, '')}”. The message waits inside the app.`,
      full: 'Shows that day’s message, which may be visible on your lock screen.',
    },
    languageGroup: 'Language',
    languageSystem: 'Automatic',
    languageHint: 'Automatic follows your phone’s language.',
    appearanceGroup: 'Appearance',
    appearance: { system: 'Automatic', light: 'Light', dark: 'Dark' } satisfies Record<AppearancePreference, string>,
    appearanceHint: 'Automatic follows your phone’s light or dark setting.',
    feelGroup: 'Feel',
    haptics: 'Haptic feedback',
    hapticsDescription: 'A soft tap when you save or browse.',
    dataGroup: 'Your data',
    exportLabel: 'Export a backup',
    exportDescription: 'Saved messages and settings, in a file you keep.',
    exportError: 'The backup couldn’t be created. Please try again.',
    importLabel: 'Restore a backup',
    importDescription: 'Adds saved messages and settings from a backup file.',
    importDone: (n: number) =>
      n === 0
        ? 'Backup restored. Your saved messages were already here.'
        : n === 1
          ? 'Backup restored. 1 saved message added.'
          : `Backup restored. ${n} saved messages added.`,
    importError: 'That file doesn’t look like an A Little Better backup.',
    dataUnsupported: 'Backups are available in the iOS and Android apps.',
    helpedLabel: 'What has helped you',
    helpedDescription: (n: number, need: string | null) =>
      (n === 1 ? '1 message helped' : `${n} messages helped`) + (need ? `, most often “${need}”.` : '.'),
    helpedReset: 'Forget these answers',
    plusLabel: 'A Little Better+',
    plusDescription: 'Extra card styles and accent colours. Optional.',
    plusOwned: 'Unlocked. Thank you.',
    resetNotForMe: 'Bring back hidden messages',
    resetNotForMeDescription: (n: number) => (n === 1 ? '1 message marked “not for me”.' : `${n} messages marked “not for me”.`),
    aboutGroup: 'About',
    privacy: 'Privacy',
    about: 'About A Little Better',
    version: 'Version',
  },

  time: {
    earlier: '15 minutes earlier',
    later: '15 minutes later',
    label: (time: string) => `Reminder time ${time}`,
    presets: { early: 'Early', morning: 'Morning', midday: 'Midday', evening: 'Evening' },
  },

  privacy: {
    title: 'Privacy',
    lede: 'Your moments stay yours.',
    sections: [
      {
        title: 'No account needed',
        body: ['A Little Better works without signing up. We don’t ask for your name, email or any personal details.'],
      },
      {
        title: 'What stays on your device',
        body: [
          'The messages you save, your answers to “Did this help?”, the ones you mark as not for you, how you said you feel today and your settings are stored only on this device. They aren’t sent to us or to anyone else.',
          'Deleting the app, or moving to a new phone, leaves them behind. To keep them, export a backup in Settings › Your data and restore it on the new phone. The backup is a file you keep; we never see it.',
        ],
      },
      {
        title: 'Notifications',
        body: [
          'Reminders are scheduled locally on your phone. We only send them if you switch them on, and you can turn them off at any time in Settings or in your device’s notification settings.',
          'By default the reminder is discreet: it doesn’t show the message itself, so nothing personal appears on your lock screen. You can choose to show the full message in Settings.',
        ],
      },
      {
        title: 'Sharing',
        body: [
          'When you share a message, the image or text is created on your device and handed to the app you choose. We don’t see what you share or who you share it with.',
        ],
      },
      {
        title: 'No tracking',
        body: ['There are no ads, no analytics and no third-party trackers in this version of the app.'],
      },
    ],
  },

  about: {
    tagline: 'A little reminder. A little perspective. A little better.',
    whyTitle: 'Why this exists',
    why: [
      'Sometimes you need motivation. Sometimes you need reassurance. Sometimes you just need to hear something kind. A Little Better is a small place to find the right words at the right moment.',
      'It isn’t trying to change your whole life. It’s trying to make today a little better.',
    ],
    messagesTitle: 'The messages',
    messages: (n: number) => [
      `Every one of the ${n} messages was written for this app. No borrowed quotes, no famous names. Just honest, gentle words meant to sound like a good friend.`,
      'Each day brings a new message, the same one all day long. When you need something specific, the six collections are always there.',
    ],
    noteTitle: 'A gentle note',
    note: 'A Little Better is a source of encouragement, not a substitute for professional care. If you’re struggling, please reach out to someone you trust or a local support service.',
    version: (v: string) => `Version ${v}`,
  },

  share: {
    title: 'Share this message',
    unavailableTitle: 'This message isn’t available.',
    unavailableBody: 'Try sharing it again from Home or Saved.',
    error: 'Sharing didn’t work this time. Please try again.',
    cardStyle: 'Card style',
    styleLabel: (name: string) => `${name} style`,
    templates: { ivory: 'Ivory', cream: 'Clay', sage: 'Sage', charcoal: 'Evening', dawn: 'Dawn', mist: 'Mist', forest: 'Forest', night: 'Night' },
    lockedStyle: (name: string) => `${name} style, part of A Little Better+`,
    shareImage: 'Share image',
    shareText: 'Share as text',
    cardTagline: 'A little reminder. A little perspective.',
    cardPreview: (text: string) => `Share card preview: ${text}`,
  },

  notFound: {
    title: 'This page wandered off.',
    body: 'Let’s get you back somewhere familiar.',
    goHome: 'Go home',
  },

  notification: { title: 'A little reminder for today.', discreetBody: 'Your message is here whenever you want it.' },

  moods: {
    good: { label: 'Good', phrase: 'good', reply: 'Love that. Here’s something to help you notice it.' },
    down: { label: 'A bit down', phrase: 'a bit down', reply: 'That’s alright. Here’s a little hope, for whenever you’re ready.' },
    overwhelmed: { label: 'Overwhelmed', phrase: 'overwhelmed', reply: 'Let’s slow things down for a moment. Here’s some comfort.' },
    nervous: { label: 'Nervous', phrase: 'nervous', reply: 'Nerves usually mean it matters. Here’s a little courage.' },
    unsure: { label: 'Unsure of me', phrase: 'unsure of yourself', reply: 'You’re more capable than it feels right now. Here’s some confidence.' },
    stuck: { label: 'Stuck', phrase: 'stuck', reply: 'Sometimes the way forward starts with letting go. Here’s a fresh start.' },
  } satisfies Record<MoodId, { label: string; phrase: string; reply: string }>,

  categories: {
    confidence: {
      title: 'Some Confidence',
      theme: 'Self-worth & Confidence',
      description:
        'For the days you forget what you bring to the room. Gentle reminders about self-acceptance, believing in yourself and letting go of comparison.',
    },
    hope: {
      title: 'A Little Hope',
      theme: 'Hope & Positivity',
      description: 'Realistic optimism for when the road ahead feels long. Small reasons to keep looking up.',
    },
    comfort: {
      title: 'Some Comfort',
      theme: 'Difficult Days & Comfort',
      description: 'Soft words for heavy days. For stress, loneliness, disappointment, and the permission to simply rest.',
    },
    'fresh-start': {
      title: 'A Fresh Start',
      theme: 'Letting Go & Moving Forward',
      description: 'For endings, mistakes and changes you didn’t choose. Making peace with what was, and room for what’s next.',
    },
    perspective: {
      title: 'Some Perspective',
      theme: 'Happiness & Gratitude',
      description: 'A wider view of an ordinary day. Noticing the small good things that are already here.',
    },
    courage: {
      title: 'A Little Courage',
      theme: 'Courage & Personal Growth',
      description: 'For the moment before you begin. About fear, trying again, and growing at your own pace.',
    },
  } satisfies Record<CategoryId, { title: string; theme: string; description: string }>,
};

export type Strings = typeof en;

const es: Strings = {
  tabs: { home: 'Inicio', explore: 'Explorar', saved: 'Guardados' },

  greeting: {
    night: '¿Todavía sin dormir? Trátate con cariño',
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  },

  home: {
    todayLabel: 'La frase de hoy',
    settings: 'Ajustes',
    somethingElse: 'Hoy necesito otra cosa',
    somethingElseHint: 'Lleva a cómo te sientes',
    checkinTitle: '¿Cómo te sientes hoy?',
    checkinHint: 'Elige la cara que encaje. No hay respuestas incorrectas.',
    checkinChosen: (phrase: string) => `Hoy te sientes ${phrase}. Toca otra cara cuando quieras.`,
    moodHint: 'Abre frases para cómo te sientes',
    needDirect: 'O elige directamente lo que te vendría bien:',
    needA11yHint: 'Abre una frase para esto',
  },

  needs: {
    comfort: { label: 'Consuelo', description: 'Palabras amables. Sin tener que hacer nada.' },
    perspective: { label: 'Otra perspectiva', description: 'Otra forma de mirarlo.' },
    step: { label: 'Un pequeño paso', description: 'Algo suave que puedes hacer ahora.' },
  },

  reminderOffer: {
    title: '¿Te ayudaría un recordatorio diario?',
    body: (time: string) => `Una frase al día a las ${time}. Puedes cambiar la hora o desactivarlo en Ajustes.`,
    yes: 'Sí, recuérdamelo',
    no: 'Ahora no',
    done: (time: string) => `Hecho. Nos vemos a las ${time}.`,
    denied: 'Las notificaciones están desactivadas para esta app. Puedes permitirlas más tarde en Ajustes.',
  },

  welcome: {
    body: [
      'Un pequeño lugar con palabras amables y sinceras, para los días normales y para los difíciles.',
      'Cada día hay una frase para todo el mundo. Cuando necesites otra cosa, dile a la app qué te vendría bien: consuelo, otra perspectiva o un pequeño paso.',
      'Sin cuenta. Todo se queda en tu teléfono.',
    ],
    start: 'Ver la frase de hoy',
  },

  explore: {
    title: 'Explorar',
    intro: 'Seis pequeñas colecciones, escritas para distintos tipos de días. Sin prisa.',
  },

  saved: {
    title: 'Guardados',
    count: (n: number) => (n === 1 ? 'Una frase que merece la pena guardar.' : `${n} frases que merece la pena guardar.`),
    emptyTitle: 'Todavía no hay nada guardado.',
    emptyBody: 'Cuando algo te llegue, guárdalo aquí.',
    emptyAction: 'Buscar algo',
    pinnedTitle: 'Para volver aquí',
    pinnedEmpty: 'Fija hasta 3 frases que te ayudaron y te esperarán aquí.',
    allTitle: 'Todo lo guardado',
    pin: 'Fijar en “Para volver aquí”',
    unpin: 'Quitar de “Para volver aquí”',
    pinFull: 'Ya tienes 3 fijadas. Quita una para hacer sitio.',
  },

  category: {
    notFoundTitle: 'No hemos encontrado esa colección.',
    notFoundBody: 'Puede que se haya movido. Todo lo demás sigue donde lo dejaste.',
    backToExplore: 'Volver a Explorar',
    feeling: (phrase: string) => `Te sientes ${phrase}`,
    another: 'Otra frase',
    rowLabel: (title: string, theme: string) => `${title}. ${theme}.`,
  },

  moment: {
    forNow: 'Para ahora',
    needsLabel: 'Lo que te vendría bien',
    needChipHint: 'Muestra frases de este tipo. Tócalo otra vez para ver de todo.',
    pause: 'Respira con ella. No hay prisa.',
    done: 'Suficiente por ahora',
    notForMe: 'Esta no me encaja',
    notForMeDone: 'Entendido. Verás menos frases así.',
    undo: 'Deshacer',
  },

  actions: {
    breathe: { title: 'Cuatro respiraciones lentas', body: 'Inspira mientras cuentas hasta cuatro y suelta el aire mientras cuentas hasta seis. Cuatro veces.' },
    'see-five': { title: 'Cinco cosas que ves', body: 'Mira a tu alrededor y nombra, en silencio, cinco cosas que veas.' },
    shoulders: { title: 'Suelta los hombros', body: 'Sube los hombros hacia las orejas, aguanta un momento y déjalos caer. Dos veces.' },
    water: { title: 'Un vaso de agua', body: 'Sírvete un vaso de agua y bébelo despacio, sin hacer nada más mientras tanto.' },
    'warm-hands': { title: 'Manos calientes', body: 'Sostén algo caliente, o frótate las palmas, y nota cómo se extiende el calor.' },
    'one-for-today': { title: 'Solo una para hoy', body: 'Piensa en lo que te ronda la cabeza. ¿Qué cosa es de verdad para hoy? El resto puede esperar.' },
    'leave-for-tomorrow': { title: 'Deja una cosa para mañana', body: 'Elige algo que te preocupe y que pueda esperar a mañana. Dite: hoy no.' },
    'kinder-sentence': { title: 'Dilo con más cariño', body: 'Toma algo duro que te hayas dicho hoy y repítelo como te lo diría una buena amistad.' },
    'did-well': { title: 'Algo que hiciste bien', body: 'Piensa en algo que hayas hecho bien esta semana. Dítelo en una frase completa.' },
    'look-forward': { title: 'Algo que te haga ilusión', body: 'Piensa en algo pequeño que esté por llegar y que te vaya a gustar. Imagínalo un momento.' },
    'good-surprise': { title: 'Una buena sorpresa', body: 'Recuerda algo que te haya salido mejor de lo que esperabas. Quédate con ello unas respiraciones.' },
    'fresh-air': { title: 'Otro aire', body: 'Abre una ventana o asómate a la puerta. Respira tres veces un aire distinto.' },
    'one-good-thing': { title: 'Algo bueno, aquí mismo', body: 'Busca algo bueno a tu alrededor ahora mismo, por pequeño que sea. Míralo durante unas respiraciones.' },
    listen: { title: 'Escucha', body: 'Cierra los ojos y escucha. ¿Cuál es el sonido más lejano que oyes?' },
    'tiny-first-step': { title: 'El primer paso más pequeño', body: 'Piensa en eso que vas aplazando. ¿Qué primer paso es tan pequeño que cabe en dos minutos? Solo ponle nombre.' },
  },

  practical: {
    offer: (seconds: number) => `Prueba esto · ${seconds} segundos`,
    start: 'Empezar',
    remaining: (seconds: number) => `${seconds} s`,
    done: 'Hecho',
    finished: 'Ya está. No hace falta nada más.',
    close: 'Cerrar',
  },

  helpful: {
    question: '¿Te ha servido?',
    yes: 'Sí',
    no: 'No mucho',
    thanks: 'Me alegro.',
    keep: 'Guárdala para volver aquí',
    kept: 'Guardada en “Para volver aquí”.',
    keptSaved: 'Guardada. “Para volver aquí” está lleno, así que está con el resto de tus guardados.',
    noReply: 'Gracias por decirlo. ¿Probamos otro tipo de frase?',
    tryDifferent: 'Ver otro tipo',
  },

  plus: {
    title: 'A Little Better+',
    lede: 'Una compra única para algunos detalles extra. Todo lo que ayuda sigue siendo gratis.',
    includedTitle: 'Qué añade',
    included: [
      'Cuatro estilos más para las tarjetas que compartes: Alba, Bruma, Bosque y Noche.',
      'Un color de acento para la app: Salvia, Arcilla, Lavanda o Mar.',
    ],
    freeTitle: 'Siempre gratis',
    free: 'La frase de hoy, las seis colecciones, elegir lo que te vendría bien, los guardados, los recordatorios, el modo oscuro y la accesibilidad, los controles de privacidad y las copias.',
    accentTitle: 'Color de acento',
    accents: { sage: 'Salvia', clay: 'Arcilla', lavender: 'Lavanda', sea: 'Mar' },
    locked: 'Parte de A Little Better+',
    buy: (price: string) => `Desbloquear por ${price}`,
    comingSoon: 'Muy pronto',
    comingSoonNote: 'Las compras todavía no están abiertas en esta versión de la app.',
    owned: 'Tienes A Little Better+. Gracias.',
    restore: 'Restaurar compra',
    restoreNone: 'No hemos encontrado ninguna compra anterior.',
    error: 'La compra no se ha completado. No se te ha cobrado nada.',
    devUnlock: 'Desbloquear para probar (solo desarrollo)',
    devLock: 'Volver a bloquear (solo desarrollo)',
  },

  message: {
    save: 'Guardar frase',
    unsave: 'Quitar de guardados',
    share: 'Compartir frase',
  },

  nav: { back: 'Volver', close: 'Cerrar' },

  settings: {
    title: 'Ajustes',
    reminderGroup: 'Recordatorio diario',
    dailyMessage: 'Frase del día',
    reminderOn: (time: string) => `Un recordatorio suave a las ${time}.`,
    reminderOff: 'Un recordatorio suave al día. Nunca más.',
    reminderUnsupported: 'Los recordatorios están disponibles en las apps de iOS y Android.',
    reminderTime: 'Hora del recordatorio',
    noticeError: 'No hemos podido activar los recordatorios. Vuelve a intentarlo en un momento.',
    noticeDenied:
      'Las notificaciones de A Little Better están desactivadas en los ajustes del teléfono. Puedes permitirlas allí y luego volver a activar el recordatorio.',
    openDeviceSettings: 'Abrir ajustes del teléfono',
    styleLabel: 'Qué muestra el recordatorio',
    styles: { discreet: 'Discreto', full: 'Frase completa' },
    styleHint: {
      discreet: (title: string) => `Solo muestra “${title.replace(/\.$/, '')}”. La frase te espera dentro de la app.`,
      full: 'Muestra la frase del día, que puede verse en la pantalla bloqueada.',
    },
    languageGroup: 'Idioma',
    languageSystem: 'Automático',
    languageHint: 'Automático usa el idioma de tu teléfono.',
    appearanceGroup: 'Apariencia',
    appearance: { system: 'Automático', light: 'Claro', dark: 'Oscuro' },
    appearanceHint: 'Automático sigue el modo claro u oscuro de tu teléfono.',
    feelGroup: 'Sensaciones',
    haptics: 'Vibración',
    hapticsDescription: 'Un toque suave al guardar o explorar.',
    dataGroup: 'Tus datos',
    exportLabel: 'Exportar una copia',
    exportDescription: 'Tus guardados y ajustes, en un archivo que conservas tú.',
    exportError: 'No se ha podido crear la copia. Vuelve a intentarlo.',
    importLabel: 'Restaurar una copia',
    importDescription: 'Añade guardados y ajustes desde un archivo de copia.',
    importDone: (n: number) =>
      n === 0
        ? 'Copia restaurada. Tus frases guardadas ya estaban aquí.'
        : n === 1
          ? 'Copia restaurada. Se ha añadido 1 frase guardada.'
          : `Copia restaurada. Se han añadido ${n} frases guardadas.`,
    importError: 'Ese archivo no parece una copia de A Little Better.',
    dataUnsupported: 'Las copias están disponibles en las apps de iOS y Android.',
    helpedLabel: 'Lo que te ha servido',
    helpedDescription: (n: number, need: string | null) =>
      (n === 1 ? 'Te ha servido 1 frase' : `Te han servido ${n} frases`) + (need ? `, sobre todo de “${need}”.` : '.'),
    helpedReset: 'Olvidar estas respuestas',
    plusLabel: 'A Little Better+',
    plusDescription: 'Estilos de tarjeta y colores de acento extra. Opcional.',
    plusOwned: 'Desbloqueado. Gracias.',
    resetNotForMe: 'Recuperar frases ocultas',
    resetNotForMeDescription: (n: number) =>
      n === 1 ? '1 frase marcada como “no me encaja”.' : `${n} frases marcadas como “no me encaja”.`,
    aboutGroup: 'Información',
    privacy: 'Privacidad',
    about: 'Sobre A Little Better',
    version: 'Versión',
  },

  time: {
    earlier: '15 minutos antes',
    later: '15 minutos después',
    label: (time: string) => `Hora del recordatorio: ${time}`,
    presets: { early: 'Temprano', morning: 'Mañana', midday: 'Mediodía', evening: 'Noche' },
  },

  privacy: {
    title: 'Privacidad',
    lede: 'Tus momentos son solo tuyos.',
    sections: [
      {
        title: 'Sin cuenta',
        body: ['A Little Better funciona sin registrarte. No te pedimos tu nombre, tu correo ni ningún dato personal.'],
      },
      {
        title: 'Lo que se queda en tu teléfono',
        body: [
          'Las frases que guardas, tus respuestas a “¿Te ha servido?”, las que marcas como “no me encaja”, cómo dijiste que te sientes hoy y tus ajustes se guardan solo en este dispositivo. No se nos envían ni a nosotros ni a nadie.',
          'Si borras la app o cambias de teléfono, no vienen contigo. Para conservarlos, exporta una copia en Ajustes › Tus datos y restáurala en el teléfono nuevo. La copia es un archivo que guardas tú; nosotros no lo vemos.',
        ],
      },
      {
        title: 'Notificaciones',
        body: [
          'Los recordatorios se programan en tu propio teléfono. Solo te llegan si los activas, y puedes desactivarlos cuando quieras en Ajustes o en los ajustes de notificaciones del teléfono.',
          'Por defecto, el recordatorio es discreto: no muestra la frase, así que no aparece nada personal en la pantalla bloqueada. Si prefieres ver la frase completa, puedes elegirlo en Ajustes.',
        ],
      },
      {
        title: 'Compartir',
        body: [
          'Cuando compartes una frase, la imagen o el texto se crean en tu teléfono y se entregan a la app que elijas. No vemos qué compartes ni con quién.',
        ],
      },
      {
        title: 'Sin rastreo',
        body: ['En esta versión de la app no hay anuncios, ni analíticas, ni rastreadores de terceros.'],
      },
    ],
  },

  about: {
    tagline: 'Un pequeño recordatorio. Un poco de perspectiva. Un poco mejor.',
    whyTitle: 'Por qué existe',
    why: [
      'A veces necesitas motivación. A veces, que te tranquilicen. Y a veces solo necesitas oír algo bonito. A Little Better es un pequeño lugar para encontrar las palabras adecuadas en el momento adecuado.',
      'No intenta cambiarte la vida entera. Intenta que hoy sea un poco mejor.',
    ],
    messagesTitle: 'Las frases',
    messages: (n: number) => [
      `Las ${n} frases se escribieron para esta app. Sin citas prestadas ni nombres famosos. Solo palabras sinceras y amables, como las de una buena amistad.`,
      'Cada día trae una frase nueva, la misma durante todo el día. Cuando necesites algo concreto, las seis colecciones siempre están ahí.',
    ],
    noteTitle: 'Una nota importante',
    note: 'A Little Better es una fuente de ánimo, no un sustituto de la ayuda profesional. Si lo estás pasando mal, habla con alguien de confianza o con un servicio de apoyo de tu zona.',
    version: (v: string) => `Versión ${v}`,
  },

  share: {
    title: 'Compartir esta frase',
    unavailableTitle: 'Esta frase no está disponible.',
    unavailableBody: 'Prueba a compartirla de nuevo desde Inicio o Guardados.',
    error: 'No se ha podido compartir esta vez. Vuelve a intentarlo.',
    cardStyle: 'Estilo de la tarjeta',
    styleLabel: (name: string) => `Estilo ${name}`,
    templates: { ivory: 'Marfil', cream: 'Arcilla', sage: 'Salvia', charcoal: 'Atardecer', dawn: 'Alba', mist: 'Bruma', forest: 'Bosque', night: 'Noche' },
    lockedStyle: (name: string) => `Estilo ${name}, parte de A Little Better+`,
    shareImage: 'Compartir imagen',
    shareText: 'Compartir como texto',
    cardTagline: 'Un pequeño recordatorio. Un poco de perspectiva.',
    cardPreview: (text: string) => `Vista previa de la tarjeta: ${text}`,
  },

  notFound: {
    title: 'Esta página se ha perdido.',
    body: 'Vamos a llevarte a un sitio conocido.',
    goHome: 'Ir al inicio',
  },

  notification: { title: 'Un pequeño recordatorio para hoy.', discreetBody: 'Tu frase te espera cuando quieras.' },

  // Phrases avoid gendered adjectives ("nervioso/a") so they fit everyone.
  moods: {
    good: { label: 'Bien', phrase: 'bien', reply: 'Qué bien. Aquí tienes algo para saborearlo.' },
    down: { label: 'Sin ánimo', phrase: 'sin ánimo', reply: 'No pasa nada. Aquí tienes un poco de esperanza, para cuando la necesites.' },
    overwhelmed: { label: 'Con agobio', phrase: 'con agobio', reply: 'Vamos a bajar el ritmo un momento. Aquí tienes un poco de consuelo.' },
    nervous: { label: 'Con nervios', phrase: 'con nervios', reply: 'Los nervios suelen significar que te importa. Aquí tienes un poco de valor.' },
    unsure: { label: 'Con dudas', phrase: 'con dudas sobre ti', reply: 'Eres más capaz de lo que parece ahora mismo. Aquí tienes un poco de confianza.' },
    stuck: { label: 'Sin rumbo', phrase: 'sin rumbo', reply: 'A veces el camino empieza por soltar. Aquí tienes un nuevo comienzo.' },
  },

  categories: {
    confidence: {
      title: 'Un poco de confianza',
      theme: 'Autoestima y confianza',
      description:
        'Para los días en que olvidas todo lo que aportas. Recordatorios suaves sobre aceptarte, creer en ti y dejar de compararte.',
    },
    hope: {
      title: 'Un poco de esperanza',
      theme: 'Esperanza y optimismo',
      description: 'Optimismo realista para cuando el camino se hace largo. Pequeños motivos para seguir mirando hacia arriba.',
    },
    comfort: {
      title: 'Un poco de consuelo',
      theme: 'Días difíciles y consuelo',
      description: 'Palabras suaves para días pesados. Para el estrés, la soledad, la decepción y el permiso para simplemente descansar.',
    },
    'fresh-start': {
      title: 'Un nuevo comienzo',
      theme: 'Soltar y seguir adelante',
      description: 'Para finales, errores y cambios que no elegiste. Hacer las paces con lo que fue y dejar sitio a lo que viene.',
    },
    perspective: {
      title: 'Un poco de perspectiva',
      theme: 'Felicidad y gratitud',
      description: 'Una mirada más amplia a un día cualquiera. Fijarse en las pequeñas cosas buenas que ya están aquí.',
    },
    courage: {
      title: 'Un poco de valor',
      theme: 'Valor y crecimiento personal',
      description: 'Para el momento antes de empezar. Sobre el miedo, volver a intentarlo y crecer a tu ritmo.',
    },
  },
};

export const STRINGS: Record<Locale, Strings> = { en, es };
