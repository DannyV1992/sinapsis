import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consentimiento informado",
  description:
    "Consentimiento informado para el proceso de psicoterapia en Sinapsis. Derechos, confidencialidad y responsabilidades del consultante.",
  alternates: {
    canonical: "https://sinapsiscr.com/consentimiento",
  },
};

export default function ConsentimientoPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-8">
          Consentimiento informado
        </h1>

        <div className="p-4 bg-section-alt rounded-xl mb-8">
          <p className="text-sm text-foreground/60">
            Por favor lee este documento antes de tu primera sesión. Se revisará y firmará al inicio de tu primer encuentro con la psicóloga, ya sea presencial o virtual.
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/70">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Naturaleza del servicio</h2>
            <p>
              Sinapsis ofrece servicios de psicología clínica a través de sesiones de
              psicoterapia individual y de pareja, enfocadas en el bienestar emocional y el
              crecimiento personal. Se trabaja desde un enfoque integrador, adaptándose
              a las particularidades de cada consultante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Confidencialidad</h2>
            <p>
              Todo lo compartido en sesión se mantiene bajo estricta confidencialidad,
              amparado por el secreto profesional según lo establecido por el Colegio de
              Profesionales en Psicología de Costa Rica.
            </p>
            <p>
              Situaciones en que la confidencialidad podría romperse (por obligación legal):
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Riesgo inminente para la vida del consultante o de terceros.</li>
              <li>Sospecha fundamentada de abuso o negligencia hacia menores de edad.</li>
              <li>Requerimiento judicial formal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Duración y frecuencia</h2>
            <p>
              La duración de cada sesión varía según el servicio: las sesiones individuales
              tienen una duración de 1 hora, mientras que las sesiones de pareja o familia
              duran 1 hora y media. La frecuencia se define de manera conjunta entre
              consultante y profesional según las necesidades del proceso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Derechos del consultante</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Recibir información clara y transparente sobre el proceso terapéutico.</li>
              <li>Realizar preguntas en cualquier momento del proceso.</li>
              <li>Decidir interrumpir o finalizar la terapia cuando lo considere necesario.</li>
              <li>Solicitar referencia a otro profesional si así lo desea.</li>
              <li>Que toda su información sea tratada con absoluta reserva.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Responsabilidades del consultante</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Asistir de forma puntual a las sesiones programadas.</li>
              <li>Comunicar cancelaciones con al menos 24 horas de anticipación.</li>
              <li>Participar de manera activa y comprometida en el proceso.</li>
              <li>Informar sobre cambios relevantes en su estado de salud física o emocional.</li>
              <li>Estar dispuesto/a a implementar cambios y actividades sugeridas por la profesional.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Alcances y limitaciones</h2>
            <p>
              La psicoterapia es un proceso que demanda tiempo, constancia y compromiso.
              No es posible garantizar resultados específicos, dado que estos dependen de
              múltiples factores, incluyendo la disposición del consultante a realizar
              cambios en su vida cotidiana. La psicóloga no prescribe medicamentos;
              de ser necesario, se referirá con un profesional en psiquiatría.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Atención virtual</h2>
            <p>
              La modalidad virtual tiene la misma eficacia terapéutica que la atención
              presencial. La diferencia en costos (si la hubiera) se debe a factores
              operativos del consultorio. Para sesiones virtuales, el consultante
              se compromete a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Estar en un espacio privado, sin interrupciones y donde no pueda ser escuchado por terceros.</li>
              <li>Mantener la cámara encendida durante toda la sesión.</li>
              <li>No realizar otras actividades de forma simultánea.</li>
              <li>Disponer de una conexión estable a internet.</li>
              <li>No grabar la sesión sin autorización previa y mutua.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Claves para un proceso terapéutico efectivo</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Acción, no solo conversación:</strong> Los avances terapéuticos se consolidan
                a través de acciones concretas. Esto incluye la disposición a realizar tareas
                o ejercicios fuera del consultorio como parte del proceso. Si se continúa
                haciendo lo mismo de siempre, los resultados difícilmente cambiarán.
              </li>
              <li>
                <strong>Abrazar la incomodidad:</strong> Algunos momentos del proceso pueden ser
                retadores o incómodos. Esto es esperable y necesario — las terapias que generan
                cambios reales implican salir de la zona de confort con miras a un bienestar
                más profundo y sostenible.
              </li>
              <li>
                <strong>Sostener la constancia:</strong> El progreso requiere regularidad. Cuando
                las sesiones se espacian demasiado o se cancelan con frecuencia, la motivación
                disminuye y se dificulta alcanzar los objetivos. La cercanía entre citas
                potencia los resultados.
              </li>
              <li>
                <strong>Confiar en el cierre profesional:</strong> Es común sentirse mejor antes
                de que el proceso esté completo. Abandonar prematuramente suele llevar a
                recaídas, ya que pueden quedar aspectos pendientes por trabajar.
                La recomendación es mantener el proceso hasta recibir el alta del profesional.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Terapia de pareja</h2>
            <p>
              Para iniciar un proceso de terapia de pareja, es indispensable que ambas
              personas tengan la voluntad y disposición de participar. Si uno de los
              miembros no desea asistir o no cree en el proceso, se sugiere que la
              persona interesada inicie con sesiones individuales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Firma</h2>
            <p>
              Este consentimiento se revisa y firma al inicio de la primera sesión,
              ya sea de forma presencial o virtual según la modalidad elegida.
              Al firmarlo, el consultante declara haber leído, comprendido y aceptado
              las condiciones aquí descritas, y se compromete a participar activamente
              en su proceso terapéutico.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
