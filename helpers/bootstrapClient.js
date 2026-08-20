"use client";

import { useEffect } from "react";

export function BootstrapClient() {
	useEffect(() => {
		// Dynamically import Bootstrap JS on the client side
		import("@/src/js/bootstrap.js");
	}, []);

	return null;
}
