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
  location: "San José, Costa Rica",

  // Redes sociales
  whatsappMessage: "Hola, me gustaría consultar sobre los servicios de Sinapsis.",

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

  // Horario
  schedule: "Lunes a viernes, 8:00am - 5:00pm",

  // Métodos de pago
  paymentMethods: "SINPE Móvil, transferencia bancaria y efectivo",

  // Nombre de la profesional
  professional: {
    name: "Cinthya Chavez",
    title: "Licda.",
    fullTitle: "Licda. Cinthya Chavez",
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
