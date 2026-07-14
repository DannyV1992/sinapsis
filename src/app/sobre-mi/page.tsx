import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MiPlusCards from "./MiPlusCards";

export const metadata: Metadata = {
  title: "Sobre mí — Cinthya Chávez, Psicóloga Clínica",
  description: "Conocé a Cinthya Chávez, psicóloga clínica en Costa Rica. Espacio afirmativo para comunidad LGBTQ+, relaciones no monógamas, deconstrucción religiosa, duelo reproductivo e identidades no normativas. Terapia individual, de pareja y familiar.",
};

export default function SobreMiPage() {
  return (
    <main className="pt-16 lg:pt-20 font-[family-name:var(--font-lora)] italic">

      {/* Hero */}
      <section className="relative bg-primary-dark pt-20 pb-14 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-2xl font-light text-white/70 mb-3">
            Psicóloga clínica
          </p>
          <h1 className="text-6xl sm:text-7xl font-light tracking-wide text-white flex items-center gap-5">
            Cinthya Chávez
            <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[240px]" />
          </h1>
          <p className="mt-5 text-xl font-light text-white/55 max-w-xl leading-relaxed">
            La persona detrás del proceso.
          </p>
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
                  "8+ años en bienestar organizacional",
                  "Cod. 14176 · Colegio de Psicología CR",
                ].map((item) => (
                  <p key={item} className="text-sm text-foreground/65 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed">
                ¡¡Hola!! Me alegra que estés acá, con ganas de conocerme un poco antes de dar el paso. Así que te cuento quién soy.
              </p>
              <p className="text-lg text-foreground/65 leading-relaxed">
                Soy psicóloga clínica y amo la ciencia — pero no la ciencia por la ciencia. Uso terapia cognitivo-conductual porque funciona de verdad, y la uso desde un lugar de comprensión y cercanía. Para mí, rigor y calidez no son opuestos: son las dos cosas que hacen que una terapia sirva.
              </p>
              <p className="text-lg text-foreground/65 leading-relaxed">
                No hay un perfil de "paciente ideal" en mi consulta — hay personas reales con situaciones reales. Debido a esto es que tengo especial interés en la diversidad humana en todas sus formas y singularidades: la de identidades, la de estructuras de vida, las de creencias, la de experiencias que pocas veces encuentran un lugar donde ser nombradas.
              </p>
              <p className="text-lg text-foreground/65 leading-relaxed">
                Fuera de la consulta soy risueña. Me mueven el arte y la música, el ejercicio es parte fundamental de cómo cuido mi propia mente, además soy amante de los animales y comparto mi casa con dos pequeños gatos que siempre tienen una opinión para todo.
              </p>
              <p className="text-lg text-foreground/65 leading-relaxed">
                Con todo lo anterior, creo que la terapia puede ser un lugar serio sin ser un lugar tenso — y la persona que soy afuera es la misma que te va a recibir adentro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mi plus */}
      <section className="py-20 lg:py-28 bg-primary-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-3xl font-light text-white/50 mb-8">Mi plus</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-1 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white leading-snug">
                Un lugar donde no tenés que justificar quién sos antes de pedir ayuda
              </h2>
            </div>
            <div>
              <p className="text-lg text-white/70 leading-relaxed">
                Casi toda terapia promete ser "libre de juicio". Pero hay temas que aun así siguen sintiéndose tabú del otro lado del sillón, y se nota: tenés que explicar y cuidar cómo lo decís para que no te miren distinto. Acá no. Para mí, tu forma de vivir no es un tema por resolver — es simplemente parte de cómo somos las personas.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-5">
            <p className="text-lg text-white/70 leading-relaxed">
              Si sos parte de la comunidad LGBTQ+, tenés una estructura relacional no monógama, estás en un proceso de deconstrucción religiosa o de identidad, o tu vida no encaja en lo normativo — no tenés que justificarlo primero. Entiendo el contexto sin que me lo dibujes, y vamos directo a lo que te trajo.
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              Y si no te reconocés en nada de esto, también soy tu psicóloga. Acá tu forma de vivir es el punto de partida, no el problema a tratar.
            </p>
          </div>

          <MiPlusCards />
        </div>
      </section>

      {/* Cómo trabajo — fusión de "Por qué hago esto" + "En consulta" */}
      <section className="py-20 lg:py-28 bg-background border-t border-foreground/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start mb-16">
            <div>
              <p className="text-3xl font-light text-foreground/60 mb-6">Cómo trabajo</p>
              <p className="text-xl text-foreground/70 leading-relaxed mb-5">
                Mi enfoque es cognitivo-conductual porque tiene décadas de evidencia, pero la evidencia es el mapa, no el destino: lo que importa es que vos te sientas visto, entendido y con herramientas que de verdad te sirvan.
              </p>
              <p className="text-xl text-foreground/70 leading-relaxed">
                No es terapia de por vida. Es un proceso con dirección, objetivos claros y un fin — y lo que aprendés se queda con vos. La autonomía es la meta, no la dependencia.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 border-t border-foreground/25 pt-14">
            {[
              {
                title: "Lo que traés importa",
                body: "No leo un protocolo mientras te escucho. Cada sesión parte de lo que traés ese día — de cómo vas y de lo que apareció. Eso es lo que guía.",
              },
              {
                title: "Con objetivos claros",
                body: "Desde la primera sesión definimos para qué estamos ahí. No es hablar por hablar esperando que algo mejore solo: avanzamos con herramientas concretas y respaldadas por evidencia.",
              },
              {
                title: "A tu ritmo",
                body: "No hay un número fijo de sesiones. Hay procesos cortos y enfocados, y otros que descubren capas nuevas. Los dos son válidos. Dura lo que necesita durar.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-lg text-foreground/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent/20 border-t border-accent/15 text-center">
        <p className="text-3xl sm:text-4xl text-foreground/70 mb-8 max-w-xl mx-auto px-4 leading-relaxed">
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
