"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "bot" | "user";
  text: string;
  options?: string[];
}

const faqData: { keywords: string[]; answer: string; showWhatsApp?: boolean }[] = [
  {
    keywords: ["precio", "costo", "cuanto", "cuánto", "tarifa", "cobr"],
    answer: "La sesión individual tiene un costo de ₡25,000. La primera sesión de valoración tiene el mismo precio. Aceptamos transferencia, SINPE Móvil y efectivo.",
  },
  {
    keywords: ["horario", "hora", "cuando", "cuándo", "disponib", "atiend"],
    answer: "Atiendo de lunes a viernes de 8:00 AM a 5:00 PM. Puedes ver la disponibilidad exacta en la sección de agendar cita.",
  },
  {
    keywords: ["duracion", "duración", "dura", "largo", "tiempo sesion", "tiempo sesión"],
    answer: "Las sesiones individuales duran 1 hora. Las de pareja o familia duran 1 hora y media. La primera sesión puede extenderse un poco más para conocerte mejor.",
  },
  {
    keywords: ["online", "virtual", "distancia", "videollamada", "zoom"],
    answer: "Sí, ofrezco sesiones online por videollamada. Tienen la misma duración y calidad que las presenciales. Solo necesitas un espacio privado y buena conexión.",
  },
  {
    keywords: ["ubicacion", "ubicación", "donde", "dónde", "dirección", "direccion", "llegar"],
    answer: "El consultorio está ubicado en San José, Costa Rica. La dirección exacta la comparto al confirmar tu cita.",
  },
  {
    keywords: ["servicio", "ofrec", "tipo", "tratamiento", "especializ"],
    answer: "Ofrezco terapia individual, terapia de pareja, manejo de ansiedad, orientación vocacional, terapia online y talleres grupales.",
  },
  {
    keywords: ["ansiedad", "nervios", "pánico", "panico", "preocup"],
    answer: "El manejo de ansiedad es una de mis especialidades. Trabajo con técnicas cognitivo-conductuales y mindfulness. Si quieres, puedes hacer el test de ansiedad en la sección 'Conócete' para explorar cómo te sientes.",
  },
  {
    keywords: ["pareja", "relacion", "relación", "conflicto", "comunicación", "comunicacion"],
    answer: "La terapia de pareja ayuda a mejorar la comunicación, resolver conflictos y fortalecer el vínculo. Ambos deben asistir a las sesiones.",
  },
  {
    keywords: ["primera", "primer", "empezar", "inicio", "comenzar", "nunca he ido"],
    answer: "En la primera sesión nos conocemos, hablamos sobre lo que te trae aquí y definimos juntos los objetivos del proceso. Es un espacio seguro y sin juicios. No necesitas preparar nada especial.",
  },
  {
    keywords: ["confidencial", "privado", "secreto", "nadie se enter"],
    answer: "Absolutamente todo lo que compartas en sesión es confidencial y está protegido por el secreto profesional. Tu información es completamente privada.",
  },
  {
    keywords: ["cancelar", "reprogramar", "cambiar cita", "no puedo ir"],
    answer: "Puedes reprogramar tu cita si avisas con al menos 48 horas de anticipación. No se hacen devoluciones pero sí reprogramación dentro de los próximos 7 días hábiles. Si cancelas con menos de 48 horas o no asistes, se debe pagar de nuevo para agendar.",
  },
  {
    keywords: ["seguro", "póliza", "poliza", "ins"],
    answer: "Por el momento no trabajo directamente con seguros. Te puedo dar factura para que tramites el reembolso con tu aseguradora si aplica.",
  },
  {
    keywords: ["whatsapp", "wsp", "telefono", "teléfono", "numero", "número", "celular", "contacto", "llamar", "escribir"],
    answer: "Nuestro WhatsApp es +506 8888-8888. ¿Quieres que te abra la conversación?",
    showWhatsApp: true,
  },
];

function findAnswer(input: string): { answer: string; showWhatsApp?: boolean } | null {
  const normalized = input.toLowerCase();

  for (const faq of faqData) {
    for (const keyword of faq.keywords) {
      if (normalized.includes(keyword)) {
        return { answer: faq.answer, showWhatsApp: faq.showWhatsApp };
      }
    }
  }
  return null;
}

const quickOptions = [
  "¿Cuánto cuesta?",
  "¿Cuál es el horario?",
  "¿Ofrecen sesiones online?",
  "¿Cómo es la primera sesión?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "¡Hola! Soy Neurón, tu asistente en Sinapsis. ¿En qué puedo ayudarte?",
      options: quickOptions,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: userMessage },
    ];

    const result = findAnswer(userMessage);

    if (result) {
      const botMsg: Message = { role: "bot", text: result.answer };
      if (result.showWhatsApp) {
        botMsg.options = ["Abrir WhatsApp"];
      }
      newMessages.push(botMsg);
    } else {
      newMessages.push({
        role: "bot",
        text: "Disculpa, no tengo esa información aún. Voy a anotar tu pregunta para mejorar. Si necesitas más ayuda, puedes contactar directamente a la psicóloga.",
        options: ["Escribir por WhatsApp", "Hacer otra pregunta"],
      });
    }

    // Guardar la pregunta en el log
    fetch("/api/chat-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMessage, answered: !!result }),
    }).catch(() => {});

    setMessages(newMessages);
    setInput("");
  };

  const handleOption = (option: string) => {
    if (option === "Abrir WhatsApp" || option === "Escribir por WhatsApp") {
      window.open(
        "https://wa.me/50671398403?text=" +
          encodeURIComponent("Hola, tengo una consulta sobre los servicios de Sinapsis."),
        "_blank"
      );
      return;
    }
    if (option === "Hacer otra pregunta") {
      setMessages([
        ...messages,
        { role: "bot", text: "Claro, pregúntame lo que necesites.", options: quickOptions },
      ]);
      return;
    }
    handleSend(option);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-dark hover:scale-105 transition-all duration-300"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[70vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Neurón</p>
              <p className="text-xs text-white/70">Asistente de Sinapsis</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-section-alt text-foreground rounded-bl-md"
                      : "bg-primary text-white ml-auto rounded-br-md"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOption(opt)}
                        className="text-xs px-3 py-1.5 border border-primary/30 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
