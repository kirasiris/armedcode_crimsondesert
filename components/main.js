"use client";
import { useState } from "react";
import SetupPanel from "@/components/setuppanel";
import LoaderScreen from "@/components/loaderscreen";

const DEFAULT_CONFIG = {
	shape: "square",
	audio: { mode: "youtube", videoId: "1w3PgCqGzq0" },
	speed: 0.18,
	volume: 60,
	count: 320,
	color: "#d9d9de",
};

const MainComponent = () => {
	const [config, setConfig] = useState(DEFAULT_CONFIG);
	const [runId, setRunId] = useState(0);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const handleApply = (settings) => {
		setConfig(settings);
		setRunId((id) => id + 1);
	};

	return (
		<section className="vh-100 w-100 bg-black overflow-hidden position-relative">
			<div
				className="position-absolute top-0 start-0 w-100 h-100"
				aria-label="Loading screen preview"
			>
				<LoaderScreen key={runId} config={config} />
			</div>
			<button
				type="button"
				className="btn btn-dark border border-secondary border-opacity-50 position-fixed top-0 end-0 m-3 text-uppercase small fw-semibold"
				style={{ zIndex: 1060, letterSpacing: "0.1em" }}
				onClick={() => setSidebarOpen((o) => !o)}
				aria-expanded={sidebarOpen}
				aria-controls="settings-sidebar"
			>
				{sidebarOpen ? "Hide settings" : "Settings"}
			</button>
			Hola
			<aside
				id="settings-sidebar"
				className={`offcanvas offcanvas-start bg-dark text-light border-end border-secondary border-opacity-25 ${
					sidebarOpen ? "show" : ""
				}`}
				style={{
					width: "340px",
					maxWidth: "85vw",
					visibility: sidebarOpen ? "visible" : "hidden",
				}}
				tabIndex={-1}
				aria-label="Loader settings"
				aria-hidden={!sidebarOpen}
			>
				<div className="offcanvas-header pb-0 justify-content-end">
					<button
						type="button"
						className="btn-close btn-close-white"
						aria-label="Hide settings sidebar"
						onClick={() => setSidebarOpen(false)}
					/>
				</div>
				<div className="offcanvas-body pt-0">
					<SetupPanel config={config} onApply={handleApply} />
				</div>
			</aside>
		</section>
	);
};

export default MainComponent;
