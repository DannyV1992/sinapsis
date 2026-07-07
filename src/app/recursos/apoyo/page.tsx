import Link from "next/link";

const emergencias = [
  {
    nombre: "Emergencias Nacionales",
    numero: "911",
    institucion: "Sistema de Emergencias 9-1-1",
    horario: "24/7",
    descripcion: "Policía, bomberos, Cruz Roja y emergencias médicas.",
    urgente: true,
  },
  {
    nombre: "Cruz Roja",
    numero: "118",
    institucion: "Cruz Roja Costarricense",
    horario: "24/7",
    descripcion: "Atención prehospitalaria y emergencias médicas.",
    urgente: true,
  },
  {
    nombre: "Fuerza Pública",
    numero: "117",
    institucion: "Ministerio de Seguridad Pública",
    horario: "24/7",
    descripcion: "Auxilio policial, violencia doméstica y situaciones de riesgo.",
    urgente: true,
  },
];

const saludMental = [
  {
    nombre: "Línea de la Vida",
    numero: "1322",
    institucion: "IAFA — Instituto sobre Alcoholismo y Farmacodependencia",
    horario: "24/7",
    descripcion: "Apoyo en crisis de salud mental, suicidio y adicciones. Línea gratuita y confidencial.",
  },
  {
    nombre: "Hospital Nacional Psiquiátrico",
    numero: "2242-1000",
    institucion: "CCSS — Caja Costarricense de Seguro Social",
    horario: "24/7",
    descripcion: "Urgencias psiquiátricas y atención en crisis. Servicio de emergencias del hospital de referencia nacional.",
  },
  {
    nombre: "Colegio de Psicólogos de Costa Rica",
    numero: "2280-4480",
    institucion: "Colegio Profesional de Psicólogos de Costa Rica",
    horario: "Lunes a viernes, horario de oficina",
    descripcion: "Orientación para encontrar psicólogos colegiados y servicios de salud mental en todo el país.",
  },
];

const niñezAdolescencia = [
  {
    nombre: "PANI — Protección a la Niñez",
    numero: "800-800-7264",
    institucion: "Patronato Nacional de la Infancia",
    horario: "24/7",
    descripcion: "Denuncias y apoyo para niñas, niños y adolescentes en situación de riesgo, abuso o desprotección.",
  },
  {
    nombre: "Clínica del Adolescente CCSS",
    numero: "2547-1000",
    institucion: "CCSS — Hospital Nacional de Niños",
    horario: "Lunes a viernes, 7am–4pm",
    descripcion: "Atención integral en salud mental para adolescentes. Requiere EDUS (seguro social activo).",
  },
];

const adultosMayores = [
  {
    nombre: "Línea Dorada",
    numero: "1165",
    institucion: "CONAPAM — Consejo Nacional de la Persona Adulta Mayor",
    horario: "24/7",
    descripcion: "Apoyo a adultos mayores en situación de riesgo social, abandono o violencia. Contención en crisis, orientación psicosocial y coordinación con instituciones.",
  },
];

const violenciaGenero = [
  {
    nombre: "Línea de Violencia contra las Mujeres",
    numero: "800-800-4628",
    institucion: "INAMU — Instituto Nacional de la Mujer",
    horario: "24/7",
    descripcion: "Apoyo, orientación y referencia a albergues para mujeres en situación de violencia doméstica o de género. Gratuita y confidencial.",
  },
  {
    nombre: "OIJ — Organismo de Investigación Judicial",
    numero: "800-8000-645",
    institucion: "Poder Judicial",
    horario: "24/7",
    descripcion: "Denuncias por delitos sexuales, violencia doméstica y personas desaparecidas.",
  },
];

export default function ApoyoPage() {
  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark font-[family-name:var(--font-playfair)] mb-4">
            Líneas de Apoyo en Costa Rica
          </h1>
          <p className="text-foreground/60 text-lg max-w-xl mx-auto">
            Si estás en crisis o necesitás ayuda inmediata, estos son los recursos disponibles en el país. Son gratuitos y confidenciales.
          </p>
        </div>

        {/* Aviso urgente */}
        <div className="mb-10 rounded-2xl bg-red-50 border border-red-200 px-6 py-5 flex gap-4 items-start">
          <span className="text-2xl mt-0.5">🚨</span>
          <div>
            <p className="font-semibold text-red-700 text-sm">Si tu vida o la de alguien más está en peligro inmediato</p>
            <p className="text-red-600 text-sm mt-1">Llamá al <strong>911</strong> ahora mismo. No esperes.</p>
          </div>
        </div>

        {/* Emergencias */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">
            Emergencias
          </h2>
          <div className="flex flex-col gap-3">
            {emergencias.map((linea) => (
              <a
                key={linea.numero}
                href={`tel:${linea.numero}`}
                className="group flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-foreground/6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {linea.nombre}
                    </span>
                    {linea.urgente && (
                      <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/50">{linea.descripcion}</p>
                  <p className="text-xs text-foreground/35 mt-1">{linea.institucion} · {linea.horario}</p>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">
                    {linea.numero}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Salud mental */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">
            Salud Mental y Apoyo Especializado
          </h2>
          <div className="flex flex-col gap-3">
            {saludMental.map((linea) => (
              <a
                key={linea.numero}
                href={`tel:${linea.numero}`}
                className="group flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-foreground/6 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <span className="text-base font-bold text-foreground group-hover:text-accent transition-colors block mb-1">
                    {linea.nombre}
                  </span>
                  <p className="text-sm text-foreground/50">{linea.descripcion}</p>
                  <p className="text-xs text-foreground/35 mt-1">{linea.institucion} · {linea.horario}</p>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-xl font-bold text-accent group-hover:text-primary transition-colors whitespace-nowrap">
                    {linea.numero}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Niñez y adolescencia */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">
            Niñez y Adolescencia
          </h2>
          <div className="flex flex-col gap-3">
            {niñezAdolescencia.map((linea) => (
              <a
                key={linea.numero}
                href={`tel:${linea.numero}`}
                className="group flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-foreground/6 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <span className="text-base font-bold text-foreground group-hover:text-accent transition-colors block mb-1">
                    {linea.nombre}
                  </span>
                  <p className="text-sm text-foreground/50">{linea.descripcion}</p>
                  <p className="text-xs text-foreground/35 mt-1">{linea.institucion} · {linea.horario}</p>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-xl font-bold text-accent group-hover:text-primary transition-colors whitespace-nowrap">
                    {linea.numero}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Adultos mayores */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">
            Adultos Mayores
          </h2>
          <div className="flex flex-col gap-3">
            {adultosMayores.map((linea) => (
              <a
                key={linea.numero}
                href={`tel:${linea.numero}`}
                className="group flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-foreground/6 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <span className="text-base font-bold text-foreground group-hover:text-accent transition-colors block mb-1">
                    {linea.nombre}
                  </span>
                  <p className="text-sm text-foreground/50">{linea.descripcion}</p>
                  <p className="text-xs text-foreground/35 mt-1">{linea.institucion} · {linea.horario}</p>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-xl font-bold text-accent group-hover:text-primary transition-colors whitespace-nowrap">
                    {linea.numero}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Violencia y género */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-4">
            Violencia Doméstica y de Género
          </h2>
          <div className="flex flex-col gap-3">
            {violenciaGenero.map((linea) => (
              <a
                key={linea.numero}
                href={`tel:${linea.numero}`}
                className="group flex items-center justify-between bg-white rounded-2xl px-6 py-5 shadow-sm border border-foreground/6 hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <span className="text-base font-bold text-foreground group-hover:text-accent transition-colors block mb-1">
                    {linea.nombre}
                  </span>
                  <p className="text-sm text-foreground/50">{linea.descripcion}</p>
                  <p className="text-xs text-foreground/35 mt-1">{linea.institucion} · {linea.horario}</p>
                </div>
                <div className="ml-6 text-right">
                  <span className="text-xl font-bold text-accent group-hover:text-primary transition-colors whitespace-nowrap">
                    {linea.numero}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Nota profesional */}
        <div className="rounded-2xl bg-accent/10 border border-accent/20 px-6 py-6 text-center">
          <p className="text-foreground/70 text-sm leading-relaxed">
            Estas líneas son un primer paso. Si estás pasando por un momento difícil y querés acompañamiento profesional continuo,{" "}
            <Link href="/agendar" className="font-semibold text-primary hover:text-primary-dark transition-colors underline underline-offset-2">
              podés agendar una consulta.
            </Link>
            {" "}
          </p>
        </div>

      </div>
    </main>
  );
}
