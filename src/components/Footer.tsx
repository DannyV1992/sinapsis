import { config } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/80 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Sinapsis</h3>
            <p className="text-sm leading-relaxed">
              Psicología clínica y bienestar emocional. Tu salud mental es
              nuestra prioridad.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#sobre-mi" className="hover:text-white transition-colors">
                  Sobre mí
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>{config.email}</li>
              <li>{config.phoneDisplay}</li>
              <li>{config.location}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Sinapsis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
