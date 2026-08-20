"use client";
import { useState, useRef } from "react";

const SHAPES = [
	{ id: "square", label: "Squares" },
	{ id: "triangle", label: "Triangles" },
	{ id: "diamond", label: "Diamonds" },
	{ id: "circle", label: "Circles" },
	{ id: "hexagon", label: "Hexagons" },
];

const DEFAULT_YT_URL =
	"https://www.youtube.com/watch?v=1w3PgCqGzq0&list=RD1w3PgCqGzq0&start_radio=1";

const getYouTubeId = (url) => {
	try {
		const u = new URL(url);
		if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
		if (u.hostname.includes("youtube.com")) {
			if (u.pathname === "/watch") return u.searchParams.get("v");
			const parts = u.pathname.split("/");
			if (["embed", "shorts", "live"].includes(parts[1]))
				return parts[2] || null;
		}
		return null;
	} catch {
		return null;
	}
};

const SetupPanel = ({ config, onApply }) => {
	const [shape, setShape] = useState(config.shape);
	const [audioMode, setAudioMode] = useState(config.audio.mode);
	const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_YT_URL);
	const [speed, setSpeed] = useState(config.speed);
	const [count, setCount] = useState(config.count);
	const [color, setColor] = useState(config.color);
	const [volume, setVolume] = useState(config.volume);
	const [error, setError] = useState("");
	const fileInputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		let audio = { mode: "none" };

		if (audioMode === "mp3") {
			const file = fileInputRef.current && fileInputRef.current.files[0];
			if (!file) {
				setError(
					"Please choose an MP3 file, or switch to another audio option.",
				);
				return;
			}
			audio = { mode: "mp3", src: URL.createObjectURL(file) };
		} else if (audioMode === "youtube") {
			const videoId = getYouTubeId(youtubeUrl.trim());
			if (!videoId) {
				setError(
					"That does not look like a valid YouTube URL. Try something like https://www.youtube.com/watch?v=...",
				);
				return;
			}
			audio = { mode: "youtube", videoId };
		}

		onApply({ shape, audio, speed, count, color, volume });
	};

	return (
		<div className="text-light">
			<p
				className="text-secondary text-uppercase small fw-semibold mb-1"
				style={{ letterSpacing: "0.3em" }}
			>
				Loading screen
			</p>
			<h1 className="h4 fw-bold mb-1">Crimson Desert</h1>
			<p className="text-secondary small mb-4">
				Tune the tunnel loader, then press Apply.
			</p>

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="shape-select" className="form-label fw-semibold">
						Geometric figure
					</label>
					<select
						id="shape-select"
						className="form-select bg-black text-light border-secondary"
						value={shape}
						onChange={(e) => setShape(e.target.value)}
					>
						{SHAPES.map((s) => (
							<option key={s.id} value={s.id}>
								{s.label}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label
						htmlFor="speed-range"
						className="form-label fw-semibold d-flex justify-content-between"
					>
						<span>Shape velocity</span>
						<span className="text-secondary font-monospace">
							{speed.toFixed(2)}
						</span>
					</label>
					<input
						id="speed-range"
						type="range"
						className="form-range"
						min="0.05"
						max="0.8"
						step="0.01"
						value={speed}
						onChange={(e) => setSpeed(Number(e.target.value))}
					/>
					<div className="d-flex justify-content-between form-text text-secondary mt-0">
						<span>Slow drift</span>
						<span>Warp speed</span>
					</div>
				</div>

				<div className="mb-4">
					<label
						htmlFor="count-range"
						className="form-label fw-semibold d-flex justify-content-between"
					>
						<span>Shape count</span>
						<span className="text-secondary font-monospace">{count}</span>
					</label>
					<input
						id="count-range"
						type="range"
						className="form-range"
						min="40"
						max="800"
						step="10"
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
					/>
					<div className="d-flex justify-content-between form-text text-secondary mt-0">
						<span>Sparse</span>
						<span>Dense storm</span>
					</div>
				</div>

				<div className="mb-4">
					<label
						htmlFor="canvas-color"
						className="form-label fw-semibold d-flex justify-content-between"
					>
						<span>Canvas color</span>
						<span className="text-secondary font-monospace text-uppercase">
							{color}
						</span>
					</label>
					<input
						id="canvas-color"
						type="color"
						className="form-control form-control-color bg-black border-secondary w-100"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						title="Pick the tunnel color"
					/>
					<div className="form-text text-secondary">
						Tints the shapes and the light at the end of the tunnel.
					</div>
				</div>

				<fieldset className="mb-4">
					<legend className="form-label fw-semibold fs-6">
						Background sound
					</legend>

					<div className="form-check">
						<input
							className="form-check-input"
							type="radio"
							name="audio-mode"
							id="audio-none"
							checked={audioMode === "none"}
							onChange={() => setAudioMode("none")}
						/>
						<label className="form-check-label" htmlFor="audio-none">
							No sound
						</label>
					</div>

					<div className="form-check">
						<input
							className="form-check-input"
							type="radio"
							name="audio-mode"
							id="audio-mp3"
							checked={audioMode === "mp3"}
							onChange={() => setAudioMode("mp3")}
						/>
						<label className="form-check-label" htmlFor="audio-mp3">
							MP3 file
						</label>
					</div>

					<div className="form-check">
						<input
							className="form-check-input"
							type="radio"
							name="audio-mode"
							id="audio-youtube"
							checked={audioMode === "youtube"}
							onChange={() => setAudioMode("youtube")}
						/>
						<label className="form-check-label" htmlFor="audio-youtube">
							YouTube URL (audio only)
						</label>
					</div>

					{audioMode === "mp3" && (
						<div className="mt-3">
							<label
								htmlFor="mp3-file"
								className="form-label small text-secondary"
							>
								Choose an audio file
							</label>
							<input
								ref={fileInputRef}
								id="mp3-file"
								type="file"
								accept="audio/mpeg,audio/mp3,audio/*"
								className="form-control bg-black text-light border-secondary"
							/>
						</div>
					)}

					{audioMode === "youtube" && (
						<div className="mt-3">
							<label
								htmlFor="yt-url"
								className="form-label small text-secondary"
							>
								YouTube video URL
							</label>
							<input
								id="yt-url"
								type="url"
								className="form-control bg-black text-light border-secondary"
								placeholder="https://www.youtube.com/watch?v=..."
								value={youtubeUrl}
								onChange={(e) => setYoutubeUrl(e.target.value)}
							/>
							<div className="form-text text-secondary">
								The video is hidden; only its audio plays in the background.
							</div>
						</div>
					)}
					{audioMode !== "none" && (
						<div className="mt-3">
							<label
								htmlFor="volume-range"
								className="form-label small text-secondary d-flex justify-content-between"
							>
								<span>Volume</span>
								<span className="font-monospace">{volume}%</span>
							</label>
							<input
								id="volume-range"
								type="range"
								className="form-range"
								min="0"
								max="100"
								step="1"
								value={volume}
								onChange={(e) => setVolume(Number(e.target.value))}
							/>
						</div>
					)}
				</fieldset>

				{error && (
					<div className="alert alert-danger py-2" role="alert">
						{error}
					</div>
				)}

				<button
					type="submit"
					className="btn btn-secondary w-100 fw-semibold text-uppercase py-2"
				>
					Apply
				</button>
			</form>
		</div>
	);
};

export default SetupPanel;
