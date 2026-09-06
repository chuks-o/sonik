"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref" | "color"> & {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  /** Dot colour. Any THREE colour representation, e.g. "#f08a3e" or 0xf08a3e. */
  color?: THREE.ColorRepresentation;
  /** Grid density. Lower on small screens keeps the vertex loop cheap. */
  columns?: number;
  rows?: number;
  separation?: number;
  /** Wave height in world units. */
  amplitude?: number;
  /** Freezes the loop on a single rendered frame. */
  paused?: boolean;
};

/**
 * An animated field of dots rippling on two sine waves — a waveform surface
 * rather than a decorative particle system.
 *
 * Differences from the stock implementation, all of them deliberate:
 * it sizes to its container instead of the window, caps device pixel ratio,
 * tears the render loop down whenever it scrolls out of view or the tab is
 * hidden, and renders a single static frame under reduced-motion.
 */
export function DottedSurface({
  className,
  size = 6,
  opacity = 0.5,
  sizeAttenuation = true,
  color = "#f08a3e",
  columns = 46,
  rows = 42,
  separation = 130,
  amplitude = 46,
  paused = false,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Latest values, so a prop change never forces a full scene rebuild.
  const stateRef = useRef({ paused, amplitude });

  useEffect(() => {
    stateRef.current = { paused, amplitude };
  }, [paused, amplitude]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(max-width: 768px)").matches;
    const cols = coarse ? Math.round(columns * 0.6) : columns;
    const rowCount = coarse ? Math.round(rows * 0.6) : rows;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 10000);
    camera.position.set(0, 300, 1150);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !coarse });
    } catch {
      // No WebGL: leave the container empty rather than throwing during render.
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const positions: number[] = [];
    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rowCount; iy++) {
        positions.push(
          ix * separation - (cols * separation) / 2,
          0,
          iy * separation - (rowCount * separation) / 2,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    const material = new THREE.PointsMaterial({
      size,
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      sizeAttenuation,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const attribute = geometry.attributes.position as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    let count = 0;

    const drawWave = () => {
      const { amplitude: amp } = stateRef.current;
      let i = 0;
      for (let ix = 0; ix < cols; ix++) {
        for (let iy = 0; iy < rowCount; iy++) {
          array[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * amp +
            Math.sin((iy + count) * 0.5) * amp;
          i++;
        }
      }
      attribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      drawWave();
    };

    let frame = 0;
    const loop = () => {
      if (!stateRef.current.paused) {
        count += 0.06;
        drawWave();
      }
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const start = () => {
      if (frame || reduced || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Only burn frames while the surface is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "150px" },
    );
    io.observe(container);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, opacity, sizeAttenuation, color, columns, rows, separation]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      {...props}
    />
  );
}

export default DottedSurface;
