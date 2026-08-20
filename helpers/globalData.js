// helpers/globalData.js
import { fetchurl } from "@/helpers/fetchurl";

async function getSetting(params) {
	const res = await fetchurl(
		`/global/settings/${params}`,
		"GET",
		"force-cache",
	);
	return res;
}

export async function getGlobalData() {
	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);

	return { settings };
}
