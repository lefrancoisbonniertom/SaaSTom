"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BusinessConstellationScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const container = mount;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c1411");

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.6, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambientLight = new THREE.AmbientLight("#f7fff4", 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#dfffd7", 2.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight("#ff8a5b", 42, 18);
    rimLight.position.set(-4, 2.2, 3);
    scene.add(rimLight);

    const cyanLight = new THREE.PointLight("#52d6ff", 26, 16);
    cyanLight.position.set(3.4, -0.4, 2.2);
    scene.add(cyanLight);

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: "#18251f",
      emissive: "#0f2a20",
      emissiveIntensity: 0.22,
      metalness: 0.18,
      roughness: 0.5,
    });
    const accentMaterials = [
      new THREE.MeshStandardMaterial({
        color: "#e65f3c",
        emissive: "#7c2c1a",
        emissiveIntensity: 0.38,
        metalness: 0.24,
        roughness: 0.35,
      }),
      new THREE.MeshStandardMaterial({
        color: "#58c7ff",
        emissive: "#10445d",
        emissiveIntensity: 0.42,
        metalness: 0.2,
        roughness: 0.42,
      }),
      new THREE.MeshStandardMaterial({
        color: "#b9e885",
        emissive: "#365915",
        emissiveIntensity: 0.34,
        metalness: 0.12,
        roughness: 0.5,
      }),
      new THREE.MeshStandardMaterial({
        color: "#f4d35e",
        emissive: "#59470c",
        emissiveIntensity: 0.32,
        metalness: 0.18,
        roughness: 0.46,
      }),
    ];

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.025, 12, 96),
      accentMaterials[2],
    );
    ring.rotation.x = Math.PI / 2.9;
    ring.rotation.z = -0.4;
    group.add(ring);

    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.86, 1.05, 0.24, 6),
      plateMaterial,
    );
    core.rotation.y = Math.PI / 6;
    group.add(core);

    const panelGeometry = new THREE.BoxGeometry(1.45, 0.9, 0.08);
    const panels: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [
      { position: [-2.5, 0.92, -0.65], rotation: [0.08, 0.52, -0.1] },
      { position: [2.35, 0.68, -0.32], rotation: [-0.05, -0.62, 0.14] },
      { position: [-1.78, -1.0, 0.18], rotation: [0.15, 0.4, 0.2] },
      { position: [1.78, -1.08, 0.1], rotation: [-0.12, -0.48, -0.17] },
    ];

    panels.forEach((panel, index) => {
      const mesh = new THREE.Mesh(panelGeometry, accentMaterials[index]);
      mesh.position.set(...panel.position);
      mesh.rotation.set(...panel.rotation);
      group.add(mesh);
    });

    const barGeometry = new THREE.BoxGeometry(0.18, 1, 0.18);
    [0.35, 0.82, 0.54, 1.12, 0.72].forEach((height, index) => {
      const bar = new THREE.Mesh(
        barGeometry,
        index % 2 === 0 ? accentMaterials[1] : accentMaterials[3],
      );
      bar.scale.y = height;
      bar.position.set(-0.52 + index * 0.26, -0.6 + height / 2, 0.82);
      bar.rotation.y = -0.25;
      group.add(bar);
    });

    const chipGeometry = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const chipMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#4f6f57",
      emissiveIntensity: 0.24,
      roughness: 0.38,
    });
    const chips = new THREE.InstancedMesh(chipGeometry, chipMaterial, 90);
    const chipMatrix = new THREE.Matrix4();

    for (let index = 0; index < 90; index += 1) {
      const row = Math.floor(index / 15);
      const column = index % 15;
      chipMatrix.makeTranslation(
        (column - 7) * 0.42,
        (row - 3) * 0.38,
        -2.15 - ((row + column) % 4) * 0.08,
      );
      chips.setMatrixAt(index, chipMatrix);
    }

    chips.instanceMatrix.needsUpdate = true;
    group.add(chips);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#a8d59b",
      transparent: true,
      opacity: 0.42,
    });
    const linePoints = [
      new THREE.Vector3(-2.5, 0.92, -0.65),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.35, 0.68, -0.32),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.78, -1.08, 0.1),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1.78, -1, 0.18),
    ];
    const lines = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(linePoints),
      lineMaterial,
    );
    group.add(lines);

    group.position.set(1.2, -0.06, 0);
    group.rotation.x = -0.1;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function handlePointerMove(event: PointerEvent) {
      const rect = container.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    }

    function handlePointerLeave() {
      pointerX = 0;
      pointerY = 0;
    }

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const clock = new THREE.Clock();

    function render() {
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        group.rotation.x = -0.1 + pointerY * 0.12;
        group.rotation.y =
          Math.sin(elapsed * 0.22) * 0.18 - 0.08 + pointerX * 0.28;
        ring.rotation.z = elapsed * 0.16;
        chips.rotation.z = Math.sin(elapsed * 0.18) * 0.08;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }

    render();
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      container.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      data-three-scene="business-constellation"
      ref={mountRef}
    />
  );
}
