// =============================================
// CONFIGURACIÓN CENTRAL DE SINAPSIS
// Cambia estos valores y se actualizan en toda la página
// =============================================

export const config = {
  // Datos de contacto
  phone: "50671398403",
  phoneDisplay: "+506 7139-8403",
  email: "info@sinapsiscr.com",
  website: "sinapsiscr.com",
  location: "Heredia, Costa Rica",

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
  presencialLocations: ["Heredia"], //"Santa Ana", "San Pedro", "Pinares"

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
