"use server";
// import { cookies } from "next/headers";

export const fetchurl = async (
	url = ``,
	method,
	cache = "default",
	bodyData,
	signal = undefined || null || {},
	multipart = false,
	isRemote = false,
) => {
	// const myCookies = await cookies();
	// const token = myCookies.get("xAuthToken");

	let requestBody = null;

	let myHeaders = new Headers();
	// myHeaders.append("Authorization", `Bearer ${token?.value}`);
	myHeaders.append("Content-Type", "application/json");
	// myHeaders.append("credentials", "include");

	if (
		bodyData &&
		typeof bodyData === "object" &&
		!Array.isArray(bodyData) &&
		bodyData !== null &&
		!multipart
	) {
		// Check if bodyData is a plain object before stringifying
		requestBody = JSON.stringify(bodyData);
	}

	if (multipart) {
		// When bodyData  is FormData, send it directly and let fetch generate
		// the multipart boundary itself (a manual Content-Type would break it).
		if (bodyData instanceof FormData) {
			requestBody = bodyData;
		}
		myHeaders.delete("Content-Type");
	}

	// If no signal is provided, create a new AbortController signal
	if (!signal || typeof signal.aborted !== "boolean") {
		const controller = new AbortController();
		signal = controller.signal;
	}

	const response = await fetch(
		isRemote ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`,
		{
			method: method,
			cache: cache,
			body: method !== "GET" && method !== "HEAD" ? requestBody : null,
			signal: signal,
			headers: myHeaders,
			redirect: "manual",
		},
	)
		.then(async (res) => {
			// Might need to delete
			if (res.status === 303) {
				const redirectUrl = res.headers.get("Location");
				return fetch(redirectUrl, { method, headers: myHeaders });
			}
			if (!res.ok) {
				// check if there was JSON
				const contentType = res.headers.get("Content-Type");
				if (contentType && contentType.includes("application/json")) {
					// return a rejected Promise that includes the JSON
					return res.json().then((json) => Promise.reject(json));
				}
				// no JSON, just throw an error
				throw new Error("Something went horribly wrong 💩");
			}
			return res.json();
		})
		.catch((err) => {
			console.log("Error from console.log in fetchurl file xD", err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from fetchurl file xD", err);
			}
			return err;
		});

	return response;
};
