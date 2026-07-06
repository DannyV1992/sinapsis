import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Conocé a Cinthya Chávez, psicóloga clínica en Costa Rica especializada en diversidad relacional, identidades no normativas y bienestar emocional.",
};

export default function SobreMiPage() {
  return (
    <main className="pt-16 lg:pt-20 font-[family-name:var(--font-lora)]">

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
            <p className="font-[family-name:var(--font-cormorant)] italic text-2xl font-light text-white/70 mb-3">
              Psicóloga clínica
            </p>
            <h1 className="font-[family-name:var(--font-cormorant)] text-6xl sm:text-7xl font-light tracking-wide text-white flex items-center gap-5">
              Cinthya Chávez
              <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[240px]" />
            </h1>
          </div>
        </div>
      </section>

      {/* Intro personal */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/cinthya.jpg"
                  alt="Cinthya Chávez"
                  width={400}
                  height={530}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="mt-6 space-y-2">
                {[
                  "Licenciada en Psicología Clínica",
                  "Terapia cognitivo-conductual",
                  "Diversidad relacional y de género",
                  "Cod. 14176 · Colegio de Psicología CR",
                ].map((item) => (
                  <p key={item} className="text-sm text-foreground/40 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <p className="italic text-2xl sm:text-3xl text-foreground/80 leading-relaxed">
                ¡¡Hola!! Que hayas llegado hasta acá a querer conocerme un poco más me parece un gesto hermoso — y me da gusto contarte quién soy.
              </p>
              <p className="italic text-xl text-foreground/65 leading-relaxed">
                Soy psicóloga clínica, pero lo que me mueve es algo más simple que eso: el interés y la curiosidad genuina por las personas — por cómo piensan, cómo sienten, cómo construyen su vida.
              </p>
              <div className="space-y-5">
                <p className="italic text-xl text-foreground/65 leading-relaxed">
                  Trabajo con personas que atraviesan ansiedad, depresión, duelo, estrés, crisis de pareja, decisiones difíciles, o simplemente la sensación de que algo no está bien y no saben exactamente qué. No hay un perfil de "paciente ideal" en mi consulta — hay personas reales con situaciones reales.
                </p>
                <p className="italic text-xl text-foreground/65 leading-relaxed">
                  Lo que sí traigo siempre es una mirada sin juicio. Me formé con la convicción de que el rol de una psicóloga no es decidir cómo debería ser la vida de alguien, sino acompañar a esa persona a entenderse mejor y a moverse hacia donde quiere ir. Eso aplica para cualquier historia, cualquier forma de vida, cualquier tipo de vínculo.
                </p>
                <p className="italic text-xl text-foreground/65 leading-relaxed">
                  Tengo especial interés en las relaciones — cómo nos vinculamos, cómo comunicamos, cómo nos herimos y cómo sanamos dentro de los vínculos. Y me apasiona la diversidad humana en todas sus formas: la de las identidades, la de las estructuras de vida, las de creencias, la de las experiencias que pocas veces encuentran un lugar donde ser nombradas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo soy en consulta */}
      <section className="py-20 lg:py-28 bg-section-alt border-t border-foreground/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-cormorant)] italic text-3xl font-light text-foreground/60 mb-14">En consulta</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Sin moldes",
                body: "No tengo un modelo de vida correcto en la cabeza. Lo que traés — tu historia, tu forma de amar, tus decisiones — no va a ser recibido con asombro. Empezamos desde donde estás, no desde donde supuestamente deberías estar.",
              },
              {
                title: "Con objetivos claros",
                body: "Desde la primera sesión definimos juntos para qué estamos ahí. El proceso tiene dirección — no es hablar por hablar esperando que algo mejore solo. Avanzamos con herramientas concretas, respaldadas por evidencia.",
              },
              {
                title: "A tu ritmo",
                body: "Algunos procesos son cortos y enfocados. Otros son más largos y van descubriendo capas nuevas. Los dos son válidos. Lo que importa es que cada sesión tenga sentido para vos.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="italic text-xl font-medium text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="italic text-lg text-foreground/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espacio seguro para lo no normativo */}
      <section className="py-20 lg:py-28 bg-background border-t border-foreground/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-cormorant)] italic text-3xl font-light text-foreground/60 mb-8">Mi plus</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-foreground leading-snug">
                Un lugar donde no tenés que justificar quién sos antes de pedir ayuda
              </h2>
            </div>
            <div className="space-y-5">
              <p className="italic text-xl text-foreground/65 leading-relaxed">
                Hay experiencias que no siempre encuentran un lugar en la terapia tradicional — no porque no sean válidas, sino porque muchos espacios no están preparados para recibirlas sin sorpresa ni moralización. Acá sí. Y eso cambia todo lo que viene después.
              </p>
              <p className="italic text-xl text-foreground/65 leading-relaxed">
                Si sos parte de la comunidad LGBTQ+, si tenés una estructura relacional no monógama, si estás atravesando un proceso de deconstrucción religiosa o de identidad, si tu vida simplemente no encaja en el molde normativo que la sociedad da por sentado — acá no vas a tener que justificar eso primero. Yo entiendo tu contexto. Podemos ir directo a lo que te trajo.
              </p>
              <p className="italic text-xl text-foreground/65 leading-relaxed">
                Eso no significa que no sea una psicóloga para vos si no pertenecés a ninguna de esas categorías. Significa que si pertenecés, acá tenés un lugar seguro donde eso es normal, no un tema a resolver.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              "Comunidad LGBTQ+",
              "Relaciones no monógamas",
              "Deconstrucción religiosa",
              "Identidades no normativas",
            ].map((tag) => (
              <div key={tag} className="border border-foreground/10 rounded-xl px-4 py-3 text-center">
                <p className="text-sm italic text-foreground/50">{tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué hago esto */}
      <section className="py-20 lg:py-28 bg-primary-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="font-[family-name:var(--font-cormorant)] italic text-3xl font-light text-white/50 mb-6">Por qué hago esto</p>
              <p className="italic text-xl text-white/65 leading-relaxed mb-5">
                Decidí dedicarme a la consulta privada porque creo que hay personas que merecen un espacio donde su forma de vivir y de existir sea tratada como válida desde el primer momento — sin tener que justificarse ni simplificarse para ser comprendidas.
              </p>
              <p className="italic text-xl text-white/65 leading-relaxed">
                Eso aplica para todo el mundo. Y es lo que intento construir en cada sesión.
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-cormorant)] italic text-3xl font-light text-white/50 mb-6">Cómo trabajo</p>
              <p className="italic text-xl text-white/65 leading-relaxed mb-5">
                Mi enfoque es cognitivo-conductual: trabajamos con objetivos concretos y herramientas prácticas. No es terapia de por vida — es un proceso con dirección, donde el cambio se construye paso a paso.
              </p>
              <p className="italic text-xl text-white/65 leading-relaxed">
                Al mismo tiempo, el proceso es tuyo. Yo acompaño, no dirijo. Me interesa entender tu contexto completo antes de proponer cualquier camino.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-section-alt border-t border-foreground/6 text-center">
        <p className="text-3xl sm:text-4xl text-foreground/70 mb-8 max-w-xl mx-auto px-4 leading-relaxed italic">
          Si algo de esto resuena, el siguiente paso es simple.
        </p>
        <Link
          href="/agendar"
          className="inline-block px-8 py-4 bg-primary text-white rounded-full text-sm font-medium hover:-translate-y-px transition-all duration-300"
        >
          Agendar mi cita
        </Link>
      </section>

    </main>
  );
}
