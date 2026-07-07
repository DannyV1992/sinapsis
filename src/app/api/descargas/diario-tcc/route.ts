import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

const MARFIL   = rgb(0.969, 0.957, 0.945); // #f7f4f2
const CIRUELA  = rgb(0.290, 0.188, 0.251); // #4a3040
const ROSA     = rgb(0.769, 0.565, 0.561); // #c4908f
const SALVIA   = rgb(0.541, 0.667, 0.588); // #8aaa96
const GRIS     = rgb(0.45, 0.45, 0.45);
const GRIS_MID = rgb(0.65, 0.65, 0.65);
const BLANCO   = rgb(1, 1, 1);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawBox(page: PDFPage, x: number, y: number, w: number, h: number, label: string, font: PDFFont, fontBold: PDFFont) {
  page.drawRectangle({ x, y: y - h, width: w, height: h, color: BLANCO, borderColor: ROSA, borderWidth: 0.5 });
  page.drawText(label, { x: x + 8, y: y - 14, font: fontBold, size: 7, color: ROSA });
  // Líneas de escritura
  const lineSpacing = 16;
  const startY = y - 26;
  const lines = Math.floor((h - 30) / lineSpacing);
  for (let i = 0; i < lines; i++) {
    page.drawLine({
      start: { x: x + 8, y: startY - i * lineSpacing },
      end:   { x: x + w - 8, y: startY - i * lineSpacing },
      thickness: 0.3,
      color: GRIS_MID,
      opacity: 0.3,
    });
  }
}

export async function GET() {
  const doc = await PDFDocument.create();

  // ── Página 1: Portada + instrucciones ────────────────────────────────────────
  const portada = doc.addPage([595, 842]); // A4
  const font      = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold  = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Fondo
  portada.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: MARFIL });
  // Franja superior
  portada.drawRectangle({ x: 0, y: 742, width: 595, height: 100, color: CIRUELA });

  // Header
  portada.drawText("Sinapsis", { x: 48, y: 800, font: fontBold, size: 22, color: ROSA });
  portada.drawText("Psicología Clínica", { x: 48, y: 782, font, size: 10, color: ROSA, opacity: 0.7 });
  portada.drawText("sinapsiscr.com", { x: 48, y: 758, font, size: 9, color: BLANCO, opacity: 0.5 });

  // Título
  portada.drawText("Diario de Pensamientos", { x: 48, y: 700, font: fontBold, size: 28, color: CIRUELA });
  portada.drawText("Terapia Cognitivo-Conductual", { x: 48, y: 674, font, size: 14, color: SALVIA });
  portada.drawLine({ start: { x: 48, y: 660 }, end: { x: 200, y: 660 }, thickness: 1.5, color: ROSA });

  // Descripción
  const desc = "Este diario te ayuda a identificar y cuestionar pensamientos automáticos negativos, una de las herramientas centrales de la TCC. Con práctica regular, empezás a notar patrones y a construir perspectivas más equilibradas.";
  const descLines = wrapText(desc, font, 10, 499);
  let dy = 638;
  for (const l of descLines) {
    portada.drawText(l, { x: 48, y: dy, font, size: 10, color: GRIS });
    dy -= 15;
  }

  // Cómo usar
  dy -= 16;
  portada.drawText("¿Cómo usar este diario?", { x: 48, y: dy, font: fontBold, size: 11, color: CIRUELA });
  dy -= 18;

  const pasos = [
    ["1. Situación",    "¿Qué pasó? Describe brevemente el evento o circunstancia."],
    ["2. Emociones",    "¿Qué sentiste? Nombrá la emoción y su intensidad del 0 al 10."],
    ["3. Pensamientos", "¿Qué pensaste en ese momento? Escribí el pensamiento tal cual apareció."],
    ["4. Evidencia",    "¿Qué pruebas hay a favor y en contra de ese pensamiento?"],
    ["5. Alternativa",  "¿Hay una forma más equilibrada o realista de ver la situación?"],
    ["6. Resultado",    "¿Cómo te sentís ahora? ¿Cambió la intensidad emocional?"],
  ];

  for (const [titulo, texto] of pasos) {
    portada.drawText(titulo, { x: 48, y: dy, font: fontBold, size: 10, color: ROSA });
    dy -= 13;
    const ls = wrapText(texto, font, 9, 499);
    for (const l of ls) {
      portada.drawText(l, { x: 56, y: dy, font, size: 9, color: GRIS });
      dy -= 12;
    }
    dy -= 4;
  }

  dy -= 8;
  portada.drawRectangle({ x: 48, y: dy - 44, width: 499, height: 52, color: SALVIA, opacity: 0.12, borderColor: SALVIA, borderWidth: 0.5 });
  const nota = "Recomendación: completá el registro lo más cerca posible al momento en que ocurre la situación. La frecuencia importa más que la perfección — aunque sea una entrada breve por día es valioso.";
  const notaLines = wrapText(nota, fontOblique, 9, 483);
  let noteY = dy - 12;
  for (const l of notaLines) {
    portada.drawText(l, { x: 56, y: noteY, font: fontOblique, size: 9, color: SALVIA, opacity: 0.9 });
    noteY -= 12;
  }

  // Footer portada
  portada.drawText("Sinapsis — uso personal, no para reproducción comercial", { x: 48, y: 28, font, size: 7, color: GRIS_MID });

  // ── Páginas de registro (5 páginas) ──────────────────────────────────────────
  for (let p = 0; p < 5; p++) {
    const page = doc.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: MARFIL });

    // Header delgado
    page.drawRectangle({ x: 0, y: 812, width: 595, height: 30, color: CIRUELA, opacity: 0.9 });
    page.drawText("Sinapsis · Diario de Pensamientos TCC", { x: 48, y: 821, font, size: 8, color: BLANCO, opacity: 0.6 });
    page.drawText(`Registro ${p + 1}`, { x: 500, y: 821, font: fontBold, size: 8, color: ROSA });

    // Campo fecha y estado emocional
    const topY = 790;
    page.drawText("Fecha:", { x: 48, y: topY, font: fontBold, size: 8, color: CIRUELA });
    page.drawLine({ start: { x: 82, y: topY - 1 }, end: { x: 200, y: topY - 1 }, thickness: 0.4, color: GRIS_MID, opacity: 0.5 });
    page.drawText("Emoción inicial (0–10):", { x: 220, y: topY, font: fontBold, size: 8, color: CIRUELA });
    page.drawLine({ start: { x: 334, y: topY - 1 }, end: { x: 380, y: topY - 1 }, thickness: 0.4, color: GRIS_MID, opacity: 0.5 });
    page.drawText("Emoción final (0–10):", { x: 395, y: topY, font: fontBold, size: 8, color: CIRUELA });
    page.drawLine({ start: { x: 503, y: topY - 1 }, end: { x: 547, y: topY - 1 }, thickness: 0.4, color: GRIS_MID, opacity: 0.5 });

    const margin = 48;
    const colW   = 499;
    let y = topY - 20;

    // Situación
    drawBox(page, margin, y, colW, 90, "Situación — ¿Qué pasó?", font, fontBold);
    y -= 98;

    // Emociones + Pensamientos (lado a lado)
    const halfW = (colW - 8) / 2;
    drawBox(page, margin,         y, halfW, 80, "Emociones — ¿Qué sentiste?", font, fontBold);
    drawBox(page, margin + halfW + 8, y, halfW, 80, "Pensamientos automáticos", font, fontBold);
    y -= 88;

    // Evidencia a favor y en contra
    drawBox(page, margin,         y, halfW, 100, "Evidencia a FAVOR del pensamiento", font, fontBold);
    drawBox(page, margin + halfW + 8, y, halfW, 100, "Evidencia EN CONTRA del pensamiento", font, fontBold);
    y -= 108;

    // Pensamiento alternativo
    drawBox(page, margin, y, colW, 90, "Pensamiento alternativo / más equilibrado", font, fontBold);
    y -= 98;

    // Resultado
    drawBox(page, margin, y, colW, 72, "Resultado — ¿Cómo te sentís ahora?", font, fontBold);

    // Footer
    page.drawText("Sinapsis · sinapsiscr.com", { x: 48, y: 20, font, size: 7, color: GRIS_MID });
    page.drawText(`${p + 1} / 5`, { x: 540, y: 20, font, size: 7, color: GRIS_MID });
  }

  const bytes = await doc.save();

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="diario-tcc-sinapsis.pdf"',
    },
  });
}
