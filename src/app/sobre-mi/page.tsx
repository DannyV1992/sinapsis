import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Conocé a Cinthya Chávez, psicóloga clínica en Costa Rica especializada en diversidad relacional, identidades no normativas y bienestar emocional.",
};

export default function SobreMiPage() {
  return (
    <main className="pt-16 lg:pt-20">

      {/* Hero de página */}
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden bg-section-alt">
        <Image
          src="/cinthya.jpg"
          alt="Cinthya Chávez"
          fill
          className="object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl sm:text-6xl font-light tracking-[0.08em] text-foreground uppercase flex items-center gap-5">
              Sobre mí
              <span className="flex-1 h-px bg-foreground/15 hidden sm:block max-w-[200px]" />
            </h1>
          </div>
        </div>
      </section>

      {/* Bio principal */}
      <AboutSection />

      {/* Por qué hago esto */}
      <section className="py-24 lg:py-32 bg-primary-dark border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="font-[family-name:var(--font-dancing)] text-3xl text-white/40 mb-6">
                Por qué hago esto
              </p>
              <p className="text-white/65 text-base leading-relaxed mb-5">
                Crecí observando cómo muchas personas cargaban solos experiencias que no encontraban lugar en ningún espacio — ni en la familia, ni en la iglesia, ni en el consultorio. Personas que amaban diferente, que sentían diferente, que existían diferente, y que aprendieron a encogerse para caber.
              </p>
              <p className="text-white/65 text-base leading-relaxed">
                Decidí especializarme precisamente en ese espacio que la terapia tradicional muchas veces no cubre. No como activismo, sino como convicción: toda persona merece un lugar donde sea vista tal cual es, sin tener que justificarse primero.
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-dancing)] text-3xl text-white/40 mb-6">
                Cómo trabajo
              </p>
              <p className="text-white/65 text-base leading-relaxed mb-5">
                Mi enfoque es cognitivo-conductual, lo que significa que trabajamos con objetivos concretos y con herramientas prácticas respaldadas por evidencia. No es hablar por hablar — construimos cambios reales, medibles, que se sienten en el día a día.
              </p>
              <p className="text-white/65 text-base leading-relaxed">
                Al mismo tiempo, el proceso es tuyo. Yo acompaño, no dirijo. Propongo, no impongo. Y me interesa entender tu contexto completo — tu historia, tus vínculos, tu forma de existir — antes de proponer cualquier camino.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué podés esperar */}
      <section className="py-24 lg:py-32 bg-background border-t border-foreground/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-dancing)] text-3xl text-primary/60 mb-10">
            Qué podés esperar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Un espacio sin juicio",
                body: "Nada de lo que traés va a ser recibido con sorpresa, incomodidad o moralización. Trabajo con diversidad relacional, sexual e identitaria como parte natural de la experiencia humana.",
              },
              {
                title: "Claridad desde la primera sesión",
                body: "No vas a salir de la primera sesión con más preguntas que respuestas. Definimos juntos qué querés lograr y cómo vamos a trabajarlo.",
              },
              {
                title: "Herramientas concretas",
                body: "Cada sesión tiene sentido. No es solo hablar — es trabajar. Te vas con algo en la mano: una técnica, una perspectiva, una tarea, una comprensión.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light tracking-wide text-foreground uppercase mb-4 flex items-center gap-3">
                  {item.title}
                  <span className="flex-1 h-px bg-foreground/10" />
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-section-alt border-t border-foreground/6 text-center">
        <p className="font-[family-name:var(--font-cormorant)] text-3xl sm:text-4xl font-light italic text-foreground/70 mb-8 max-w-xl mx-auto px-4">
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
