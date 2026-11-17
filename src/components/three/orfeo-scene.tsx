"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Variant = "hero" | "compact";

const CARD_LABELS: Array<[string, string, string]> = [
  // [titre, sous-titre, couleur d'accent]
  ["Devis envoyé", "Atelier Martin · 1 450 €", "#d6b26e"],
  ["Relance", "Facture n°24 · J+7", "#ff8a65"],
  ["Déclaration Urssaf", "avant le 31 janvier", "#5fe3b0"],
  ["Nouveau client", "Studio Lumen", "#6fc8ff"],
  ["CFE", "à payer avant le 15/12", "#ecd39b"],
  ["Proposition", "générée par l'IA", "#d6b26e"],
  ["Signé", "Boulangerie Rivière · 980 €", "#5fe3b0"],
];

/** Texture d'une petite carte d'interface, dessinée sur un canvas. */
function makeCardTexture(title: string, subtitle: string, accent: string) {
  const c = document.createElement("canvas");
  const s = 2;
  c.width = 360 * s;
  c.height = 150 * s;
  const g = c.getContext("2d");
  if (!g) return null;
  g.scale(s, s);
  const r = 22;
  const grad = g.createLinearGradient(0, 0, 0, 150);
  grad.addColorStop(0, "rgba(28,42,34,0.96)");
  grad.addColorStop(1, "rgba(12,19,15,0.96)");
  g.fillStyle = grad;
  g.beginPath();
  g.roundRect(2, 2, 356, 146, r);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.12)";
  g.lineWidth = 2;
  g.stroke();
  // pastille
  g.fillStyle = accent;
  g.globalAlpha = 0.18;
  g.beginPath();
  g.roundRect(24, 30, 52, 52, 14);
  g.fill();
  g.globalAlpha = 1;
  g.fillStyle = accent;
  g.beginPath();
  g.arc(50, 56, 9, 0, Math.PI * 2);
  g.fill();
  // textes
  g.fillStyle = "#f4f1e8";
  g.font = "600 26px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif";
  g.fillText(title, 96, 56);
  g.fillStyle = "#8fa198";
  g.font = "400 19px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif";
  g.fillText(subtitle, 96, 86);
  // barre de progression
  g.fillStyle = "rgba(255,255,255,0.07)";
  g.beginPath();
  g.roundRect(24, 110, 312, 8, 4);
  g.fill();
  g.fillStyle = accent;
  g.beginPath();
  g.roundRect(24, 110, 120 + ((title.length * 23) % 170), 8, 4);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Halo radial (sprite) pour le cœur lumineux. */
function makeGlowTexture(inner: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, "rgba(214,178,110,0.35)");
  grad.addColorStop(1, "rgba(214,178,110,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function OrfeoScene({ variant = "hero", className = "" }: { variant?: Variant; className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const container: HTMLDivElement = mount;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // pas de WebGL : le fond CSS reste visible
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = variant === "compact";
    const small = window.innerWidth < 768;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#060a08", compact ? 0.06 : 0.045);
    const camera = new THREE.PerspectiveCamera(compact ? 42 : 36, 1, 0.1, 100);
    camera.position.set(0, 0.4, compact ? 9.5 : small ? 13 : 11);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // Lumières
    scene.add(new THREE.AmbientLight("#ffffff", 0.35));
    const key = new THREE.PointLight("#ecd39b", 60, 30);
    key.position.set(3, 4, 6);
    scene.add(key);
    const mint = new THREE.PointLight("#5fe3b0", 35, 25);
    mint.position.set(-5, -2, 3);
    scene.add(mint);
    const coral = new THREE.PointLight("#ff8a65", 18, 20);
    coral.position.set(4, -3, -2);
    scene.add(coral);

    const world = new THREE.Group();
    world.position.x = compact ? 2.6 : small ? 0 : 3.1;
    world.position.y = 0;
    scene.add(world);

    // Cœur : icosaèdre facetté doré + fil de fer + halo
    const coreGeo = track(new THREE.IcosahedronGeometry(1.25, 1));
    const coreMat = track(
      new THREE.MeshStandardMaterial({
        color: "#d6b26e",
        emissive: "#9a7434",
        emissiveIntensity: 0.75,
        metalness: 0.7,
        roughness: 0.28,
        flatShading: true,
      }),
    );
    const core = new THREE.Mesh(coreGeo, coreMat);
    world.add(core);

    const wireGeo = track(new THREE.IcosahedronGeometry(1.75, 1));
    const wireMat = track(new THREE.MeshBasicMaterial({ color: "#ecd39b", wireframe: true, transparent: true, opacity: 0.14 }));
    const wire = new THREE.Mesh(wireGeo, wireMat);
    world.add(wire);

    const glowTex = makeGlowTexture("rgba(255,236,190,0.9)");
    if (glowTex) {
      track(glowTex);
      const glowMat = track(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      const glow = new THREE.Sprite(glowMat);
      glow.scale.setScalar(6.5);
      world.add(glow);
    }

    // Anneaux d'orbite
    const rings: THREE.Mesh[] = [];
    [
      [2.9, 0.012, 1.15, 0.2],
      [3.9, 0.008, 1.35, -0.35],
      [5.0, 0.006, 1.05, 0.55],
    ].forEach(([radius, tube, tiltX, tiltZ], i) => {
      const geo = track(new THREE.TorusGeometry(radius, tube, 8, 180));
      const mat = track(
        new THREE.MeshBasicMaterial({ color: i === 1 ? "#5fe3b0" : "#d6b26e", transparent: true, opacity: 0.35 - i * 0.07 }),
      );
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = tiltX;
      ring.rotation.z = tiltZ;
      world.add(ring);
      rings.push(ring);
    });

    // Cartes d'interface en orbite
    const cards: Array<{ mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number; bob: number }> = [];
    const labels = compact ? CARD_LABELS.slice(0, 5) : CARD_LABELS;
    const cardGeo = track(new THREE.PlaneGeometry(2.4, 1));
    labels.forEach(([title, subtitle, accent], i) => {
      const tex = makeCardTexture(title, subtitle, accent);
      if (!tex) return;
      track(tex);
      const mat = track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      const mesh = new THREE.Mesh(cardGeo, mat);
      const scale = compact ? 0.8 : 0.9;
      mesh.scale.setScalar(scale);
      world.add(mesh);
      cards.push({
        mesh,
        radius: 3.2 + (i % 3) * 0.85,
        speed: 0.12 + (i % 4) * 0.025,
        phase: (i / labels.length) * Math.PI * 2,
        tilt: ((i % 3) - 1) * 0.6,
        bob: i * 1.3,
      });
    });

    // Champ de particules
    const count = compact ? 500 : small ? 700 : 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#d6b26e"), new THREE.Color("#5fe3b0"), new THREE.Color("#f4f1e8"), new THREE.Color("#6fc8ff")];
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi) - 4;
      const col = palette[i % 7 === 0 ? 1 : i % 11 === 0 ? 3 : i % 3 === 0 ? 2 : 0];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = track(
      new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Taille
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Souris : léger effet de parallaxe
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Pause hors écran
    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    io.observe(container);

    const t0 = performance.now();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const t = reduce ? 4 : (performance.now() - t0) / 1000;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      camera.position.x = pointer.x * 0.8;
      camera.position.y = 0.4 - pointer.y * 0.5;
      camera.lookAt(world.position.x * 0.35, 0, 0);

      core.rotation.x = t * 0.18;
      core.rotation.y = t * 0.26;
      wire.rotation.y = -t * 0.1;
      wire.rotation.z = t * 0.05;
      rings.forEach((ring, i) => {
        ring.rotation.z += reduce ? 0 : 0.0008 * (i % 2 ? -1 : 1);
      });
      for (const c of cards) {
        const a = c.phase + t * c.speed;
        c.mesh.position.set(
          Math.cos(a) * c.radius,
          Math.sin(a * 1.3 + c.bob) * 0.8 + Math.sin(a) * c.tilt * 2.2,
          Math.sin(a) * c.radius * 0.55,
        );
        c.mesh.lookAt(camera.position.x - world.position.x, camera.position.y, camera.position.z);
        const depth = (c.mesh.position.z + c.radius) / (2 * c.radius);
        (c.mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 + depth * 0.65;
      }
      points.rotation.y = t * 0.015;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant]);

  return <div aria-hidden className={className} ref={mountRef} />;
}
