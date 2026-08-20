"use client";
import { useEffect, useRef } from "react";

const TUNNEL_DEPTH = 32;
const MIN_RADIUS = 0.3;
const RADIUS_SPREAD = 1.9;

const drawShape = (ctx, shape, size) => {
	ctx.beginPath();
	switch (shape) {
		case "circle":
			ctx.arc(0, 0, size, 0, Math.PI * 2);
			break;
		case "triangle":
			ctx.moveTo(0, -size);
			ctx.lineTo(size * 0.866, size * 0.5);
			ctx.lineTo(-size * 0.866, size * 0.5);
			ctx.closePath();
			break;
		case "diamond":
			ctx.moveTo(0, -size);
			ctx.lineTo(size, 0);
			ctx.lineTo(0, size);
			ctx.lineTo(-size, 0);
			ctx.closePath();
			break;
		case "hexagon":
			for (let i = 0; i < 6; i++) {
				const a = (Math.PI / 3) * i - Math.PI / 6;
				const x = Math.cos(a) * size;
				const y = Math.sin(a) * size;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.closePath();
			break;
		case "square":
		default:
			ctx.rect(-size, -size, size * 2, size * 2);
			break;
	}
};

const hexToRgb = (hex) => {
	const value = hex.replace("#", "");
	const n = Number.parseInt(value, 16);
	if (Number.isNaN(n) || value.length !== 6) return { r: 217, g: 217, b: 222 };
	return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const mix = (a, b, t) => {
	return Math.round(a + (b - a) * t);
};

const createParticle = () => {
	return {
		angle: Math.random() * Math.PI * 2,
		// sqrt distributes shapes evenly across the disc so the whole screen fills up
		radius: MIN_RADIUS + Math.sqrt(Math.random()) * RADIUS_SPREAD,
		z: Math.random() * TUNNEL_DEPTH,
		spin: Math.random() * Math.PI * 2,
		spinSpeed: (Math.random() - 0.5) * 0.04,
		drift: (Math.random() - 0.5) * 0.004, // slow orbit around the axis
		size: 0.05 + Math.random() * 0.07,
	};
};

const TunnelCanvas = ({
	shape,
	speed = 0.18,
	count = 320,
	color = "#d9d9de",
}) => {
	const canvasRef = useRef(null);
	const shapeRef = useRef(shape);
	shapeRef.current = shape;
	const speedRef = useRef(speed);
	speedRef.current = speed;
	const countRef = useRef(count);
	countRef.current = count;
	const colorRef = useRef(color);
	colorRef.current = color;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		const particles = [];
		let raf = 0;
		let time = 0;

		// VR-style camera: lateral offset in world units (same space as particle radius)
		const cam = { x: 0, y: 0, tx: 0, ty: 0 };
		const pointers = new Map();
		let mouseDragging = false;

		const clampCam = (v) => Math.max(-1.6, Math.min(1.6, v));

		const applyDrag = (dx, dy, divisor) => {
			// "Grab the world": dragging right moves the scene right (camera left)
			const k = 2.4 / Math.max(canvas.clientWidth, canvas.clientHeight);
			cam.tx = clampCam(cam.tx - (dx / divisor) * k);
			cam.ty = clampCam(cam.ty - (dy / divisor) * k);
		};

		const onPointerDown = (e) => {
			canvas.setPointerCapture(e.pointerId);
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (e.pointerType === "mouse" && e.button === 0) mouseDragging = true;
		};

		const onPointerMove = (e) => {
			const prev = pointers.get(e.pointerId);
			if (!prev) return;
			const dx = e.clientX - prev.x;
			const dy = e.clientY - prev.y;
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

			if (e.pointerType === "mouse") {
				if (mouseDragging) applyDrag(dx, dy, 1);
			} else if (pointers.size >= 2) {
				// Two-finger drag on touch: each finger contributes its share
				applyDrag(dx, dy, pointers.size);
			}
		};

		const onPointerEnd = (e) => {
			pointers.delete(e.pointerId);
			if (e.pointerType === "mouse") mouseDragging = false;
		};

		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", onPointerEnd);
		canvas.addEventListener("pointercancel", onPointerEnd);

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = canvas.clientWidth * dpr;
			canvas.height = canvas.clientHeight * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);

		const render = () => {
			time += 1;
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			const cx = w / 2;
			const cy = h / 2;
			// Base perspective on the larger dimension so shapes reach the corners
			const focal = Math.max(w, h) * 0.6;

			// Match the live particle count from the slider
			while (particles.length < countRef.current)
				particles.push(createParticle());
			if (particles.length > countRef.current)
				particles.length = countRef.current;

			// Smoothly ease the camera toward its target; drift home when released
			const anyDrag = mouseDragging || pointers.size >= 2;
			if (!anyDrag) {
				cam.tx += (0 - cam.tx) * 0.015;
				cam.ty += (0 - cam.ty) * 0.015;
			}
			cam.x += (cam.tx - cam.x) * 0.1;
			cam.y += (cam.ty - cam.y) * 0.1;

			// Near-black backdrop with vignette
			ctx.fillStyle = "#050505";
			ctx.fillRect(0, 0, w, h);

			const tint = hexToRgb(colorRef.current);

			// Light at the end of the tunnel (pulsing), tinted by the chosen color.
			// It sits at the far end, so it parallaxes the least.
			const glowShift = focal / TUNNEL_DEPTH;
			const gx = cx - cam.x * glowShift;
			const gy = cy - cam.y * glowShift;
			const pulse = 1 + Math.sin(time * 0.02) * 0.12;
			const glowRadius = Math.min(w, h) * 0.22 * pulse;
			const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowRadius * 3);
			glow.addColorStop(
				0,
				`rgba(${mix(tint.r, 255, 0.85)}, ${mix(tint.g, 255, 0.85)}, ${mix(tint.b, 255, 0.85)}, 0.95)`,
			);
			glow.addColorStop(
				0.12,
				`rgba(${mix(tint.r, 255, 0.35)}, ${mix(tint.g, 255, 0.35)}, ${mix(tint.b, 255, 0.35)}, 0.5)`,
			);
			glow.addColorStop(
				0.35,
				`rgba(${Math.round(tint.r * 0.5)}, ${Math.round(tint.g * 0.5)}, ${Math.round(tint.b * 0.5)}, 0.2)`,
			);
			glow.addColorStop(1, "rgba(5, 5, 5, 0)");
			ctx.fillStyle = glow;
			ctx.fillRect(0, 0, w, h);

			// Sort far -> near so near shapes draw on top
			particles.sort((a, b) => b.z - a.z);

			for (const p of particles) {
				p.z -= speedRef.current;
				p.spin += p.spinSpeed;
				p.angle += p.drift;
				if (p.z <= 0.1) {
					p.z = TUNNEL_DEPTH;
					p.angle = Math.random() * Math.PI * 2;
					p.radius = MIN_RADIUS + Math.sqrt(Math.random()) * RADIUS_SPREAD;
				}

				// Perspective projection with lateral camera offset:
				// near shapes (large scale) parallax more than distant ones
				const scale = focal / p.z;
				const x = cx + (Math.cos(p.angle) * p.radius - cam.x) * scale;
				const y = cy + (Math.sin(p.angle) * p.radius - cam.y) * scale;
				const size = p.size * scale;

				if (size < 0.4) continue;
				if (
					x < -size * 2 ||
					x > w + size * 2 ||
					y < -size * 2 ||
					y > h + size * 2
				)
					continue;

				const depthFactor = 1 - p.z / TUNNEL_DEPTH; // 0 far, 1 near
				const alpha = Math.min(0.9, 0.08 + depthFactor * 0.85);

				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(p.spin);

				// Shapes near the light glow bright; near the camera, a darker tint
				const warmth = 1 - depthFactor;
				const nearLight = {
					r: mix(tint.r, 255, 0.65),
					g: mix(tint.g, 255, 0.65),
					b: mix(tint.b, 255, 0.65),
				};
				const sr = mix(Math.round(tint.r * 0.35), nearLight.r, warmth);
				const sg = mix(Math.round(tint.g * 0.35), nearLight.g, warmth);
				const sb = mix(Math.round(tint.b * 0.35), nearLight.b, warmth);

				drawShape(ctx, shapeRef.current, size);
				ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha})`;
				ctx.lineWidth = Math.max(0.6, size * 0.14);
				ctx.stroke();
				ctx.fillStyle = `rgba(${Math.round(sr * 0.3)}, ${Math.round(sg * 0.3)}, ${Math.round(sb * 0.3)}, ${alpha * 0.35})`;
				ctx.fill();

				ctx.restore();
			}

			// Subtle vignette so edges stay dark
			const vignette = ctx.createRadialGradient(
				cx,
				cy,
				Math.min(w, h) * 0.5,
				cx,
				cy,
				Math.max(w, h) * 0.9,
			);
			vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
			vignette.addColorStop(1, "rgba(0, 0, 0, 0.45)");
			ctx.fillStyle = vignette;
			ctx.fillRect(0, 0, w, h);

			raf = requestAnimationFrame(render);
		};

		raf = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", onPointerEnd);
			canvas.removeEventListener("pointercancel", onPointerEnd);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="position-absolute top-0 start-0 w-100 h-100"
			style={{ touchAction: "none", cursor: "grab" }}
			aria-label="Animated tunnel with geometric shapes flying toward a light at the end. Drag with the mouse or two fingers to look around."
			role="img"
		/>
	);
};

export default TunnelCanvas;
