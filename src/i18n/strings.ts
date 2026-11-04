import type { CategoryId, Locale } from '@/types';
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
    checkinTitle: 'How do you feel today?',
    checkinHint: 'Pick the face that fits. There’s no wrong answer.',
    checkinChosen: (phrase: string) => `You said you’re feeling ${phrase}. Tap a face anytime.`,
    moodHint: 'Opens messages for how you feel',
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
  },

  category: {
    notFoundTitle: 'We couldn’t find that collection.',
    notFoundBody: 'It may have moved. Everything else is right where you left it.',
    backToExplore: 'Back to Explore',
    feeling: (phrase: string) => `Feeling ${phrase}`,
    another: 'Another message',
    backHome: 'Back home',
    backToCategories: 'Back to categories',
    count: (n: number) => `${n} messages`,
    rowLabel: (title: string, theme: string, n: number) => `${title}. ${theme}. ${n} messages.`,
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
    preview: (title: string) => `Preview: “${title}” followed by that day’s message.`,
    languageGroup: 'Language',
    languageSystem: 'Automatic',
    languageHint: 'Automatic follows your phone’s language.',
    feelGroup: 'Feel',
    haptics: 'Haptic feedback',
    hapticsDescription: 'A soft tap when you save or browse.',
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
          'The messages you save and your settings (reminder time, language, haptics) are stored only on this device. They aren’t sent to us or to anyone else.',
          'Deleting the app removes them.',
        ],
      },
      {
        title: 'Notifications',
        body: [
          'Reminders are scheduled locally on your phone. We only send them if you switch them on, and you can turn them off at any time in Settings or in your device’s notification settings.',
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
    templates: { ivory: 'Ivory', cream: 'Clay', sage: 'Sage', charcoal: 'Evening' },
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

  notification: { title: 'A little reminder for today.' },

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
    checkinTitle: '¿Cómo te sientes hoy?',
    checkinHint: 'Elige la cara que encaje. No hay respuestas incorrectas.',
    checkinChosen: (phrase: string) => `Hoy te sientes ${phrase}. Toca una cara cuando quieras.`,
    moodHint: 'Abre frases para cómo te sientes',
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
  },

  category: {
    notFoundTitle: 'No hemos encontrado esa colección.',
    notFoundBody: 'Puede que se haya movido. Todo lo demás sigue donde lo dejaste.',
    backToExplore: 'Volver a Explorar',
    feeling: (phrase: string) => `Te sientes ${phrase}`,
    another: 'Otra frase',
    backHome: 'Volver al inicio',
    backToCategories: 'Volver a las colecciones',
    count: (n: number) => `${n} frases`,
    rowLabel: (title: string, theme: string, n: number) => `${title}. ${theme}. ${n} frases.`,
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
    preview: (title: string) => `Vista previa: “${title}” seguido de la frase de ese día.`,
    languageGroup: 'Idioma',
    languageSystem: 'Automático',
    languageHint: 'Automático usa el idioma de tu teléfono.',
    feelGroup: 'Sensaciones',
    haptics: 'Vibración',
    hapticsDescription: 'Un toque suave al guardar o explorar.',
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
          'Las frases que guardas y tus ajustes (hora del recordatorio, idioma, vibración) se guardan solo en este dispositivo. No se nos envían ni a nosotros ni a nadie.',
          'Si borras la app, se borran con ella.',
        ],
      },
      {
        title: 'Notificaciones',
        body: [
          'Los recordatorios se programan en tu propio teléfono. Solo te llegan si los activas, y puedes desactivarlos cuando quieras en Ajustes o en los ajustes de notificaciones del teléfono.',
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
    templates: { ivory: 'Marfil', cream: 'Arcilla', sage: 'Salvia', charcoal: 'Noche' },
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

  notification: { title: 'Un pequeño recordatorio para hoy.' },

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
