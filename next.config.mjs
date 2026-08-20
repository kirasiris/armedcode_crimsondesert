/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	devIndicators: {
		position: "bottom-right",
	},
	poweredByHeader: false,
	reactStrictMode: true,
	experimental: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
