"use client";
import { useEffect, useRef, useState } from "react";
import TunnelCanvas from "@/components/tunnelcanvas";

const TIPS = [
	"The desert remembers every footstep.",
	"Sharpen your blade before the crimson dawn.",
	"A warrior of the Greymane clan never kneels.",
	"The tunnel narrows, but the light grows.",
	"Trust the wind. It has crossed the dunes before you.",
];

const LoaderScreen = ({ config }) => {
	const [progress, setProgress] = useState(0);
	const [tipIndex, setTipIndex] = useState(0);
	const audioRef = useRef(null);
	const iframeRef = useRef(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => {
				if (p >= 100) return 100;
				const step = p < 70 ? Math.random() * 3 + 0.5 : Math.random() * 0.8;
				return Math.min(100, p + step);
			});
		}, 120);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setTipIndex((i) => (i + 1) % TIPS.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const el = audioRef.current;
		if (config.audio.mode === "mp3" && el) {
			el.volume = (config.volume ?? 60) / 100;
			el.play().catch(() => {
				// Autoplay may be blocked until user interaction; the click that
				// started the loader normally satisfies it.
			});
		}
		return () => {
			if (config.audio.mode === "mp3") {
				if (el) el.pause();
				URL.revokeObjectURL(config.audio.src);
			}
		};
	}, [config]);

	useEffect(() => {
		if (config.audio.mode !== "youtube") return;

		const setYouTubeVolume = () => {
			const frame = iframeRef.current;
			if (!frame || !frame.contentWindow) return;
			frame.contentWindow.postMessage(
				JSON.stringify({
					event: "command",
					func: "setVolume",
					args: [config.volume ?? 60],
				}),
				"https://www.youtube.com",
			);
		};

		setYouTubeVolume();
		const interval = setInterval(setYouTubeVolume, 500);
		const stop = setTimeout(() => clearInterval(interval), 6000);
		return () => {
			clearInterval(interval);
			clearTimeout(stop);
		};
	}, [config]);

	return (
		<div className="position-relative w-100 h-100 bg-black overflow-hidden">
			<TunnelCanvas
				shape={config.shape}
				speed={config.speed ?? 0.18}
				count={config.count ?? 320}
				color={config.color ?? "#d9d9de"}
			/>
			{config.audio.mode === "mp3" && (
				<audio ref={audioRef} src={config.audio.src} loop>
					<track kind="captions" />
				</audio>
			)}
			{config.audio.mode === "youtube" && (
				<div
					className="position-absolute overflow-hidden"
					style={{
						width: "1px",
						height: "1px",
						opacity: 0,
						pointerEvents: "none",
					}}
					aria-hidden="true"
				>
					<iframe
						ref={iframeRef}
						title="Background soundtrack"
						width="1"
						height="1"
						src={`https://www.youtube.com/embed/${config.audio.videoId}?autoplay=1&loop=1&playlist=${config.audio.videoId}&controls=0&enablejsapi=1`}
						allow="autoplay; encrypted-media"
					/>
				</div>
			)}
			<div className="position-absolute top-0 start-0 w-100 p-4">
				<p
					className="text-light text-uppercase small fw-semibold mb-0"
					style={{ letterSpacing: "0.35em" }}
				>
					Crimson Desert
				</p>
				<p className="text-secondary small mb-0">
					Now entering: The Obsidian Tunnel
				</p>
			</div>
			<div className="position-absolute bottom-0 start-0 w-100 p-4">
				<div className="mx-auto" style={{ maxWidth: "720px" }}>
					<p
						className="text-light text-center small mb-3 fst-italic opacity-75"
						aria-live="polite"
					>
						{TIPS[tipIndex]}
					</p>
					<div className="d-flex align-items-center gap-3">
						<div
							className="progress flex-grow-1 bg-dark border border-secondary border-opacity-25"
							style={{ height: "6px" }}
							role="progressbar"
							aria-label="Loading progress"
							aria-valuenow={Math.floor(progress)}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className="progress-bar bg-light"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<span
							className="text-light small fw-semibold font-monospace"
							style={{ minWidth: "4ch", textAlign: "right" }}
						>
							{Math.floor(progress)}%
						</span>
					</div>
					<p
						className="text-secondary text-uppercase small text-center mt-2 mb-0"
						style={{ letterSpacing: "0.25em" }}
					>
						{progress >= 100 ? "Press any key" : "Loading"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoaderScreen;
