export interface QuizOption {
  label: string;
  value: number;
}

export interface QuizResult {
  level: string;
  color: string;
  bg: string;
  border: string;
  message: string;
  recommendation: string;
}

export interface QuizConfig {
  title: string;
  subtitle: string;
  questions: string[];
  options: QuizOption[];
  getResult: (score: number) => QuizResult;
  maxScore: number;
}

export const quizzes: Record<string, QuizConfig> = {
  ansiedad: {
    title: "¿Cómo está mi ansiedad?",
    subtitle: "Piensa en las últimas 2 semanas al responder.",
    questions: [
      "¿Te has sentido nervioso/a, ansioso/a o con los nervios de punta?",
      "¿No has podido dejar de preocuparte o controlar la preocupación?",
      "¿Te has preocupado demasiado por diferentes cosas?",
      "¿Has tenido dificultad para relajarte?",
      "¿Te has sentido tan inquieto/a que es difícil permanecer sentado/a?",
      "¿Te has irritado o molestado con facilidad?",
      "¿Has sentido miedo, como si algo terrible pudiera pasar?",
    ],
    options: [
      { label: "Nunca", value: 0 },
      { label: "Varios días", value: 1 },
      { label: "Más de la mitad de los días", value: 2 },
      { label: "Casi todos los días", value: 3 },
    ],
    maxScore: 21,
    getResult(score) {
      if (score <= 4) return { level: "Mínimo", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tus respuestas sugieren un nivel mínimo de ansiedad. Es una buena señal.", recommendation: "Mantén hábitos saludables: ejercicio, sueño regular y conexiones sociales." };
      if (score <= 9) return { level: "Leve", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Tus respuestas indican un nivel leve de ansiedad. Muchas personas experimentan esto.", recommendation: "Técnicas de respiración y mindfulness pueden ayudarte. Si persiste, una consulta profesional te dará herramientas personalizadas." };
      if (score <= 14) return { level: "Moderado", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", message: "Tus respuestas sugieren un nivel moderado de ansiedad que puede estar afectando tu día a día.", recommendation: "Te recomendamos hablar con un profesional. La terapia cognitivo-conductual es altamente efectiva." };
      return { level: "Severo", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", message: "Tus respuestas indican un nivel significativo de ansiedad que probablemente impacta tu vida diaria.", recommendation: "Es importante buscar ayuda profesional. No tienes que manejar esto solo/a." };
    },
  },

  depresion: {
    title: "¿Cómo está mi ánimo?",
    subtitle: "Piensa en las últimas 2 semanas al responder.",
    questions: [
      "¿Has tenido poco interés o placer en hacer cosas?",
      "¿Te has sentido decaído/a, deprimido/a o sin esperanza?",
      "¿Has tenido problemas para dormir, o has dormido demasiado?",
      "¿Te has sentido cansado/a o con poca energía?",
      "¿Has tenido poco apetito o has comido en exceso?",
      "¿Te has sentido mal contigo mismo/a, o que eres un fracaso?",
      "¿Has tenido dificultad para concentrarte en cosas como leer o ver TV?",
      "¿Te has movido o hablado tan lento que otros lo notaron? ¿O lo contrario, muy inquieto/a?",
      "¿Has tenido pensamientos de que estarías mejor muerto/a o de hacerte daño?",
    ],
    options: [
      { label: "Nunca", value: 0 },
      { label: "Varios días", value: 1 },
      { label: "Más de la mitad de los días", value: 2 },
      { label: "Casi todos los días", value: 3 },
    ],
    maxScore: 27,
    getResult(score) {
      if (score <= 4) return { level: "Mínimo", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tus respuestas no indican señales significativas de depresión.", recommendation: "Sigue cultivando las cosas que te dan bienestar." };
      if (score <= 9) return { level: "Leve", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Hay algunas señales leves. Podrías estar pasando por un momento difícil.", recommendation: "El autocuidado activo (ejercicio, rutinas, conexión social) puede ayudar mucho. Si persiste, considera hablar con alguien." };
      if (score <= 14) return { level: "Moderado", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", message: "Tus respuestas sugieren un nivel moderado que merece atención.", recommendation: "Hablar con un profesional puede darte claridad y herramientas concretas para este momento." };
      if (score <= 19) return { level: "Moderadamente severo", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", message: "Tus respuestas indican un nivel considerable que está afectando tu funcionamiento.", recommendation: "Te recomendamos buscar apoyo profesional pronto. Hay tratamientos muy efectivos disponibles." };
      return { level: "Severo", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", message: "Tus respuestas indican un nivel importante. No tienes que cargar con esto solo/a.", recommendation: "Por favor busca ayuda profesional. Si tienes pensamientos de hacerte daño, contacta una línea de crisis inmediatamente." };
    },
  },

  estres: {
    title: "¿Cuánto estrés cargo?",
    subtitle: "Piensa en el último mes al responder.",
    questions: [
      "¿Con qué frecuencia te has sentido molesto/a por algo inesperado?",
      "¿Con qué frecuencia has sentido que no podías controlar las cosas importantes?",
      "¿Con qué frecuencia te has sentido nervioso/a o estresado/a?",
      "¿Con qué frecuencia has sentido que NO podías manejar todo lo que debías hacer?",
      "¿Con qué frecuencia te has sentido enfadado/a por cosas fuera de tu control?",
      "¿Con qué frecuencia has sentido que las dificultades se acumulaban tanto que no podías superarlas?",
      "¿Con qué frecuencia has podido controlar las irritaciones en tu vida?",
      "¿Con qué frecuencia has sentido que tenías todo bajo control?",
      "¿Con qué frecuencia has manejado exitosamente los problemas cotidianos?",
      "¿Con qué frecuencia has sentido que las cosas iban por buen camino?",
    ],
    options: [
      { label: "Nunca", value: 0 },
      { label: "Casi nunca", value: 1 },
      { label: "A veces", value: 2 },
      { label: "Frecuentemente", value: 3 },
      { label: "Muy frecuentemente", value: 4 },
    ],
    maxScore: 40,
    getResult(score) {
      if (score <= 13) return { level: "Bajo", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tu nivel de estrés percibido es bajo. Tienes buenas herramientas de manejo.", recommendation: "Sigue con lo que funciona. El equilibrio que tienes ahora es valioso — cuídalo." };
      if (score <= 26) return { level: "Moderado", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Estás experimentando un nivel moderado de estrés. Es el rango más común.", recommendation: "Identifica qué te está demandando más energía. Técnicas de manejo del tiempo y establecer límites puede ayudar." };
      return { level: "Alto", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", message: "Tu nivel de estrés percibido es alto. Esto puede estar afectando tu salud y bienestar.", recommendation: "Es importante tomar acción. Un profesional puede ayudarte a identificar fuentes de estrés y desarrollar estrategias." };
    },
  },

  autoestima: {
    title: "¿Cómo me veo a mí mismo/a?",
    subtitle: "Responde según cómo te sientes generalmente.",
    questions: [
      "Siento que soy una persona digna de aprecio, al menos tanto como los demás.",
      "Siento que tengo cualidades positivas.",
      "En general, me inclino a pensar que soy un fracaso.",
      "Puedo hacer las cosas tan bien como la mayoría.",
      "Siento que no tengo mucho de qué sentirme orgulloso/a.",
      "Tengo una actitud positiva hacia mí mismo/a.",
      "En general, estoy satisfecho/a conmigo mismo/a.",
      "Desearía poder tener más respeto por mí mismo/a.",
      "A veces me siento verdaderamente inútil.",
      "A veces pienso que no sirvo para nada.",
    ],
    options: [
      { label: "Muy de acuerdo", value: 3 },
      { label: "De acuerdo", value: 2 },
      { label: "En desacuerdo", value: 1 },
      { label: "Muy en desacuerdo", value: 0 },
    ],
    maxScore: 30,
    getResult(score) {
      if (score >= 25) return { level: "Alta", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tienes una autoestima saludable. Te valoras y reconoces tus cualidades.", recommendation: "Sigue cultivando esa relación contigo. La autoestima se fortalece con la coherencia entre lo que piensas, sientes y haces." };
      if (score >= 15) return { level: "Media", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Tu autoestima fluctúa. A veces te sientes bien contigo y otras no tanto.", recommendation: "Trabajar en el autoconocimiento y desafiar creencias limitantes puede ayudarte a construir una base más sólida." };
      return { level: "Baja", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", message: "Tus respuestas sugieren que te cuesta valorarte. Esto es más común de lo que crees, y se puede trabajar.", recommendation: "La terapia es muy efectiva para reconstruir la relación contigo mismo/a. Mereces sentirte bien con quien eres." };
    },
  },

  apego: {
    title: "¿Cómo me vinculo con otros?",
    subtitle: "Piensa en cómo te sientes en tus relaciones cercanas.",
    questions: [
      "Me resulta fácil acercarme emocionalmente a los demás.",
      "Me preocupa que los demás no me quieran tanto como yo a ellos.",
      "Me siento cómodo/a dependiendo de otras personas.",
      "Me preocupa que me abandonen.",
      "Prefiero no mostrar mis sentimientos a los demás.",
      "Me frustro cuando mi pareja o amigos no están disponibles.",
      "Me siento incómodo/a cuando alguien se acerca demasiado.",
      "Necesito mucha validación de las personas cercanas a mí.",
      "Me cuesta confiar completamente en los demás.",
      "Cuando discuto con alguien cercano, temo perder la relación.",
      "Valoro mi independencia más que la intimidad.",
      "Me cuesta pedir ayuda aunque la necesite.",
    ],
    options: [
      { label: "Muy de acuerdo", value: 3 },
      { label: "De acuerdo", value: 2 },
      { label: "En desacuerdo", value: 1 },
      { label: "Muy en desacuerdo", value: 0 },
    ],
    maxScore: 36,
    getResult(score) {
      if (score <= 12) return { level: "Seguro", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tus respuestas sugieren un estilo de apego seguro. Te sientes cómodo/a con la intimidad y la independencia.", recommendation: "Tus relaciones probablemente son tu fortaleza. Sigue cultivando esa capacidad de conexión." };
      if (score <= 22) return { level: "Mixto", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Tienes rasgos de diferentes estilos. A veces buscas cercanía y otras te proteges.", recommendation: "Explorar tus patrones relacionales con un profesional puede darte mucha claridad sobre por qué reaccionas como reaccionas." };
      return { level: "Inseguro", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", message: "Tus respuestas sugieren patrones de apego que pueden generar dificultad en tus relaciones.", recommendation: "El estilo de apego se puede trabajar y transformar. La terapia es una herramienta poderosa para construir relaciones más satisfactorias." };
    },
  },

  bienestar: {
    title: "¿Cómo está mi bienestar?",
    subtitle: "Piensa en las últimas 2 semanas.",
    questions: [
      "Me he sentido alegre y de buen ánimo.",
      "Me he sentido tranquilo/a y relajado/a.",
      "Me he sentido activo/a y con energía.",
      "Me he despertado sintiéndome fresco/a y descansado/a.",
      "Mi vida diaria ha estado llena de cosas que me interesan.",
    ],
    options: [
      { label: "Nunca", value: 0 },
      { label: "Algunas veces", value: 1 },
      { label: "Menos de la mitad del tiempo", value: 2 },
      { label: "Más de la mitad del tiempo", value: 3 },
      { label: "La mayor parte del tiempo", value: 4 },
      { label: "Todo el tiempo", value: 5 },
    ],
    maxScore: 25,
    getResult(score) {
      if (score >= 18) return { level: "Alto", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", message: "Tu bienestar general es alto. Te sientes bien con tu vida en este momento.", recommendation: "Lo que sea que estés haciendo, está funcionando. Cuida esos hábitos y relaciones." };
      if (score >= 10) return { level: "Moderado", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", message: "Tu bienestar está en un rango medio. Hay áreas de tu vida que podrían mejorar.", recommendation: "Identifica qué te da energía y qué te la quita. Pequeños ajustes pueden hacer una gran diferencia." };
      return { level: "Bajo", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", message: "Tu bienestar percibido es bajo. Probablemente sientes que algo no está funcionando como quisieras.", recommendation: "Hablar con alguien puede ayudarte a ver las cosas con otra perspectiva. No es debilidad — es inteligencia emocional." };
    },
  },
};
