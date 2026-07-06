"use client";

import { useEffect, useRef } from "react";

interface Neuron {
  x: number;
  y: number;
  radius: number;
  dendrites: { angle: number; length: number; branches: { angle: number; length: number }[] }[];
  axon: { angle: number; length: number; curve: number };
  pulse: number;
  colorIndex: number;
  activation: number;
  nextFire: number;
}

interface Synapse {
  from: number;
  to: number;
  progress: number;
  life: number;
  vesicles: { offset: number; size: number; speed: number }[];
}

export default function NeuronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const neuronCount = isMobile ? 18 : 35;
    const connectionDist = isMobile ? 200 : 250;

    const neurons: Neuron[] = [];
    const synapses: Synapse[] = [];

    const colors = [
      [196, 144, 143],  // palo rosa
      [218, 175, 174],  // palo rosa claro
      [168, 108, 107],  // palo rosa oscuro
      [207, 159, 158],  // palo rosa medio
    ];

    // Distribute neurons evenly using a grid with jitter
    const cols = Math.ceil(Math.sqrt(neuronCount * (width / height)));
    const rows = Math.ceil(neuronCount / cols);
    const cellW = width / cols;
    const cellH = height / rows;

    for (let i = 0; i < neuronCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Center of cell + random jitter (up to 40% of cell size)
      const baseX = cellW * (col + 0.5);
      const baseY = cellH * (row + 0.5);
      const jitterX = (Math.random() - 0.5) * cellW * 0.7;
      const jitterY = (Math.random() - 0.5) * cellH * 0.7;

      const dendriteCount = 4 + Math.floor(Math.random() * 4);
      const dendrites = [];

      for (let d = 0; d < dendriteCount; d++) {
        const angle = (Math.PI * 2 * d) / dendriteCount + (Math.random() - 0.5) * 0.4;
        const length = 25 + Math.random() * 45;
        const branchCount = 2 + Math.floor(Math.random() * 3);
        const branches = [];
        for (let b = 0; b < branchCount; b++) {
          branches.push({
            angle: angle + (Math.random() - 0.5) * 1.0,
            length: 10 + Math.random() * 20,
          });
        }
        dendrites.push({ angle, length, branches });
      }

      const axonAngle = Math.random() * Math.PI * 2;
      const axon = {
        angle: axonAngle,
        length: 50 + Math.random() * 60,
        curve: (Math.random() - 0.5) * 0.4,
      };

      neurons.push({
        x: Math.max(50, Math.min(width - 50, baseX + jitterX)),
        y: Math.max(50, Math.min(height - 50, baseY + jitterY)),
        radius: 6 + Math.random() * 4,
        dendrites,
        axon,
        pulse: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * colors.length),
        activation: 0,
        nextFire: Math.random() * 200 + 80,
      });
    }

    let time = 0;
    const mouse = { x: -1000, y: -1000, active: false };
    const mouseRadius = 120;

    function triggerSynapse(fromIdx: number, toIdx: number) {
      const exists = synapses.some(
        (s) => s.from === fromIdx && s.to === toIdx && s.life > 0
      );
      if (exists) return;

      const vesicleCount = 4 + Math.floor(Math.random() * 4);
      const vesicles = [];
      for (let i = 0; i < vesicleCount; i++) {
        vesicles.push({
          offset: (Math.random() - 0.5) * 5,
          size: 1.5 + Math.random() * 1.5,
          speed: 0.8 + Math.random() * 0.4,
        });
      }
      synapses.push({ from: fromIdx, to: toIdx, progress: 0, life: 1, vesicles });
    }

    function animate() {
      if (!ctx || !canvas) return;
      time += 0.005;

      // Clear with slight fade
      ctx.fillStyle = "rgba(247, 244, 242, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Update neuron activation
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i];
        neuron.activation *= 0.97;

        // Mouse stimulation — activate neurons near cursor
        if (mouse.active) {
          const dx = mouse.x - neuron.x;
          const dy = mouse.y - neuron.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            // Strong activation near mouse
            neuron.activation = Math.min(1, neuron.activation + force * 0.15);
            // Trigger rapid firing — many more synapses than spontaneous
            if (force > 0.4 && neuron.nextFire > 10) {
              neuron.nextFire = Math.min(neuron.nextFire, 3);
            }
            // Fire to MORE neighbors when stimulated by mouse
            if (neuron.nextFire <= 0) {
              for (let j = 0; j < neurons.length; j++) {
                if (i === j) continue;
                const ndx = neurons[i].x - neurons[j].x;
                const ndy = neurons[i].y - neurons[j].y;
                const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
                if (ndist < connectionDist && Math.random() < 0.6) {
                  triggerSynapse(i, j);
                }
              }
            }
          }
        }

        neuron.nextFire--;
        if (neuron.nextFire <= 0) {
          neuron.activation = 1;
          // Slower spontaneous firing — longer intervals
          neuron.nextFire = 300 + Math.random() * 500;

          // Less spontaneous synapses (fewer vesicles when idle)
          for (let j = 0; j < neurons.length; j++) {
            if (i === j) continue;
            const dx = neurons[i].x - neurons[j].x;
            const dy = neurons[i].y - neurons[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist && Math.random() < 0.2) {
              triggerSynapse(i, j);
            }
          }
        }
      }

      // Draw axon connections (thin, always visible)
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x;
          const dy = neurons[i].y - neurons[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.18;
            const activeBoost = Math.max(neurons[i].activation, neurons[j].activation);

            // Curved axon path
            const midX = (neurons[i].x + neurons[j].x) / 2 + (neurons[i].y - neurons[j].y) * 0.1;
            const midY = (neurons[i].y + neurons[j].y) / 2 + (neurons[j].x - neurons[i].x) * 0.1;

            ctx.beginPath();
            ctx.moveTo(neurons[i].x, neurons[i].y);
            ctx.quadraticCurveTo(midX, midY, neurons[j].x, neurons[j].y);
            ctx.strokeStyle = `rgba(196, 144, 143, ${opacity + activeBoost * 0.15})`;
            ctx.lineWidth = 0.3 + activeBoost * 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw and update synapses (neurotransmitter vesicles traveling)
      for (let s = synapses.length - 1; s >= 0; s--) {
        const synapse = synapses[s];
        synapse.progress += 0.015;
        synapse.life -= 0.01;

        if (synapse.life <= 0) {
          // Signal arrives — activate receiving neuron
          neurons[synapse.to].activation = Math.min(1, neurons[synapse.to].activation + 0.7);
          // Chain reaction probability
          if (Math.random() < 0.25) {
            neurons[synapse.to].nextFire = Math.min(neurons[synapse.to].nextFire, 15);
          }
          synapses.splice(s, 1);
          continue;
        }

        const from = neurons[synapse.from];
        const to = neurons[synapse.to];
        const midX = (from.x + to.x) / 2 + (from.y - to.y) * 0.12;
        const midY = (from.y + to.y) / 2 + (to.x - from.x) * 0.12;

        for (const v of synapse.vesicles) {
          const t = Math.min(1, synapse.progress * v.speed + v.offset * 0.005);
          if (t < 0 || t > 1) continue;

          // Position along bezier curve
          const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
          const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;

          // Perpendicular scatter
          const tangentX = 2 * (1 - t) * (midX - from.x) + 2 * t * (to.x - midX);
          const tangentY = 2 * (1 - t) * (midY - from.y) + 2 * t * (to.y - midY);
          const len = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;
          const finalX = px + (-tangentY / len) * v.offset;
          const finalY = py + (tangentX / len) * v.offset;

          // Glow around vesicle
          const glow = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, v.size * 5);
          glow.addColorStop(0, `rgba(138, 170, 150, ${synapse.life * 0.45})`);
          glow.addColorStop(1, "rgba(138, 170, 150, 0)");
          ctx.beginPath();
          ctx.arc(finalX, finalY, v.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Vesicle body (round)
          ctx.beginPath();
          ctx.arc(finalX, finalY, v.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(158, 196, 172, ${synapse.life * 0.85})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(110, 148, 124, ${synapse.life * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Receptor glow at destination when close to arrival
        if (synapse.progress > 0.7) {
          const glowSize = (synapse.progress - 0.7) / 0.3 * 15;
          const glowOp = (synapse.progress - 0.7) / 0.3 * synapse.life * 0.2;
          ctx.beginPath();
          ctx.arc(to.x, to.y, to.radius + glowSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(138, 170, 150, ${glowOp})`;
          ctx.fill();
        }
      }

      // Draw neurons (static structures)
      for (const neuron of neurons) {
        const pulse = Math.sin(time * 2 + neuron.pulse) * 0.5 + 0.5;
        const color = colors[neuron.colorIndex];
        const act = neuron.activation;
        const baseOpacity = 0.55 + pulse * 0.1 + act * 0.35;

        // Dendrites — fixed, no movement
        for (const dendrite of neuron.dendrites) {
          const endX = neuron.x + Math.cos(dendrite.angle) * dendrite.length;
          const endY = neuron.y + Math.sin(dendrite.angle) * dendrite.length;

          // Main dendrite curved
          const cpX = neuron.x + Math.cos(dendrite.angle + 0.2) * dendrite.length * 0.5;
          const cpY = neuron.y + Math.sin(dendrite.angle + 0.2) * dendrite.length * 0.5;

          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.4})`;
          ctx.lineWidth = 1.2 + act * 0.5;
          ctx.stroke();

          // Dendritic spine (terminal)
          ctx.beginPath();
          ctx.arc(endX, endY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.5})`;
          ctx.fill();

          // Branches (smaller dendrites)
          for (const branch of dendrite.branches) {
            const bEndX = endX + Math.cos(branch.angle) * branch.length;
            const bEndY = endY + Math.sin(branch.angle) * branch.length;

            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(bEndX, bEndY);
            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Spine
            ctx.beginPath();
            ctx.arc(bEndX, bEndY, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.3})`;
            ctx.fill();
          }
        }

        // Axon (longer, single path)
        const axEnd = {
          x: neuron.x + Math.cos(neuron.axon.angle) * neuron.axon.length,
          y: neuron.y + Math.sin(neuron.axon.angle) * neuron.axon.length,
        };
        const axCp = {
          x: neuron.x + Math.cos(neuron.axon.angle + neuron.axon.curve) * neuron.axon.length * 0.6,
          y: neuron.y + Math.sin(neuron.axon.angle + neuron.axon.curve) * neuron.axon.length * 0.6,
        };
        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.quadraticCurveTo(axCp.x, axCp.y, axEnd.x, axEnd.y);
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.3})`;
        ctx.lineWidth = 1 + act * 0.5;
        ctx.stroke();

        // Axon terminal (bouton)
        ctx.beginPath();
        ctx.arc(axEnd.x, axEnd.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.45})`;
        ctx.fill();

        // Cell body (soma) — organic shape
        ctx.beginPath();
        for (let i = 0; i <= 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const wobble = 1 + Math.sin(angle * 4 + neuron.pulse) * 0.08;
          const r = neuron.radius * wobble;
          const px = neuron.x + Math.cos(angle) * r;
          const py = neuron.y + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Fill with activation-dependent color (terracota accent on fire)
        const terracotaMix = act * 0.5;
        const fillR = Math.round(color[0] * (1 - terracotaMix) + 138 * terracotaMix);
        const fillG = Math.round(color[1] * (1 - terracotaMix) + 170 * terracotaMix);
        const fillB = Math.round(color[2] * (1 - terracotaMix) + 150 * terracotaMix);

        const somaGrad = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, neuron.radius
        );
        somaGrad.addColorStop(0, `rgba(${fillR}, ${fillG}, ${fillB}, ${baseOpacity})`);
        somaGrad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${baseOpacity * 0.4})`);
        ctx.fillStyle = somaGrad;
        ctx.fill();

        // Nucleus
        ctx.beginPath();
        ctx.arc(neuron.x - 1, neuron.y - 1, neuron.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(color[0] * 0.4)}, ${Math.round(color[1] * 0.4)}, ${Math.round(color[2] * 0.4)}, ${baseOpacity * 0.6})`;
        ctx.fill();

        // Activation flash
        if (act > 0.3) {
          const flashGrad = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, neuron.radius * 3
          );
          flashGrad.addColorStop(0, `rgba(138, 170, 150, ${act * 0.2})`);
          flashGrad.addColorStop(1, "rgba(138, 170, 150, 0)");
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, neuron.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = flashGrad;
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-default"
      style={{ pointerEvents: "auto" }}
    />
  );
}
