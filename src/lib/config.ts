// =============================================
// CONFIGURACIÓN CENTRAL DE SINAPSIS
// Cambia estos valores y se actualizan en toda la página
// =============================================

const PRESENCIAL_LOCATIONS = ["La Aurora, Heredia", "Santa Ana"] as const;
// Aliases para ubicaciones legacy (citas agendadas con nombre anterior)
export const PRESENCIAL_LOCATION_ALIASES: Record<string, string> = {
  "Heredia": "La Aurora, Heredia",
};
type PresencialLocation = (typeof PRESENCIAL_LOCATIONS)[number];
type LocationLinks = Record<PresencialLocation, { active: boolean; maps?: { waze?: string; google?: string } }>;

export const config = {
  // Datos de contacto
  phone: "50671398403",
  phoneDisplay: "+506 7139-8403",
  email: "info@sinapsiscr.com",
  website: "sinapsiscr.com",
  location: "La Aurora, Heredia, Costa Rica",

  // Redes sociales
  instagram: "https://www.instagram.com/sinapsis_psicologia_",
  instagramHandle: "@sinapsis_psicologia_",
  whatsappMessage: "Hola, vengo desde tu sitio web y me gustaría saber más sobre los servicios.",

  // Precios
  prices: {
    individual: 30000,
    pareja: 45000,
    familiar: 45000,
  },

  // Duración (en minutos)
  duration: {
    individual: 60,
    pareja: 90,
    familiar: 90,
  },

  // Horario (chatbot)
  schedule: "Lunes a viernes, usualmente de 8:00am - 5:00pm pero los horarios pueden variar según disponibilidad y modalidad de la cita.",

  // Ubicaciones presenciales (coworking)
  presencialLocations: PRESENCIAL_LOCATIONS,
  presencialLocationLinks: {
    "La Aurora, Heredia": { active: true, maps: { waze: "https://ul.waze.com/ul?ll=9.98943419,-84.14825678", google: "https://maps.app.goo.gl/H32i3h3FBtdn7qQ58" } },
    "Santa Ana":          { active: true, maps: { waze: "https://ul.waze.com/ul?ll=9.93429517,-84.18743849", google: "https://maps.app.goo.gl/BJWbANmFF1JvkE138" } },
  } satisfies LocationLinks,

  // Métodos de pago
  paymentMethods: "SINPE Móvil y transferencia bancaria",

  // Nombre de la profesional
  professional: {
    name: "Cinthya Chávez",
    title: "Licda.",
    fullTitle: "Licda. Cinthya Chávez",
    role: "Psicóloga clínica",
    approach: "cognitivo-conductual",
  },
};

// Helpers
export function formatPrice(amount: number): string {
  return `₡${amount.toLocaleString("es-CR")}`;
}

export function getWhatsAppLink(message?: string): string {
  const msg = encodeURIComponent(message || config.whatsappMessage);
  return `https://wa.me/${config.phone}?text=${msg}`;
}
