import Script from "next/script";
import AdBlockingRecovery from "@/components/global/adblockingrecovery";

export default async function Head({
	title = ``,
	description = ``,
	favicon = "",
	postImage = `https://w0.peakpx.com/wallpaper/61/145/HD-wallpaper-m4-carbine-assault-rifle-m4-rifle-gun-assault-rifle-weapon-carbine.jpg`,
	imageWidth = ``,
	imageHeight = ``,
	videoWidth = "1873",
	videoHeight = "900",
	card = "",
	robots = "",
	category = "",
	url = "",
	author = "Kevin Uriel Fonseca",
	createdAt = "",
	updatedAt = "",
	locales = "",
	posType = "post",
	cssLink,
}) {
	return (
		<>
			{title !== "" && <title>{title}</title>}
			{description !== "" && <meta name="description" content={description} />}
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			{favicon !== "" && <link rel="icon" href={favicon} />}
			<link rel="canonical" href={process.env.NEXT_PUBLIC_WEBSITE_URL} />
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<meta property="og:locale" key={i} content={locale} />
				))}
			{locales?.length > 0 &&
				locales.map((locale, i) => (
					<link
						rel="alternate"
						href={process.env.NEXT_PUBLIC_WEBSITE_URL + "/" + locale}
						key={locale}
						hrefLang={locale}
					/>
				))}
			{posType !== "" && <meta property="og:type" content={posType} />}
			{title !== "" && <meta property="og:title" content={title} />}
			{description !== "" && (
				<meta property="og:description" content={description} />
			)}
			{url !== "" && (
				<meta
					property="og:url"
					content={process.env.NEXT_PUBLIC_WEBSITE_URL + url}
				/>
			)}
			{title !== "" && <meta property="og:site_name" content={`${title}`} />}
			{author !== "" && <meta property="article:author" content={author} />}
			{category !== "" && (
				<meta property="article:section" content={category} />
			)}
			{createdAt !== "" && (
				<meta property="article:published_time" content={createdAt} />
			)}
			{updatedAt !== "" && (
				<meta property="article:modified_time" content={updatedAt} />
			)}
			{updatedAt !== "" && (
				<meta property="og:updated_time" content={updatedAt} />
			)}
			{postImage !== `` && <meta property="og:image" content={postImage} />}
			{postImage !== `` && (
				<meta property="og:image:secure_url" content={postImage} />
			)}
			{postImage !== `` && imageWidth && (
				<meta property="og:image:width" content={imageWidth} />
			)}
			{postImage !== `` && imageHeight && (
				<meta property="og:image:height" content={imageHeight} />
			)}
			{videoWidth !== "" && (
				<meta property="og:video:width" content={videoWidth} />
			)}
			{videoHeight !== "" && (
				<meta property="og:video:height" content={videoHeight} />
			)}
			{card !== "" && <meta name="twitter:card" content={card} />}
			{description !== "" && (
				<meta name="twitter:description" content={description} />
			)}
			{title !== "" && <meta name="twitter:title" content={title} />}
			<meta name="twitter:site" content={`@kirasiris`} />
			{url !== "" && (
				<meta
					property="twitter:url"
					content={process.env.NEXT_PUBLIC_WEBSITE_URL + url}
				/>
			)}
			{videoWidth !== "" && (
				<meta property="twitter:player:width" content={videoWidth} />
			)}
			{videoHeight !== "" && (
				<meta property="twitter:player:height" content={videoHeight} />
			)}
			{postImage !== `` && <meta name="twitter:image" content={postImage} />}
			<meta name="twitter:creator" content={`@kirasiris`} />
			{cssLink && (
				<link
					rel="stylesheet"
					href={cssLink}
					media="print and screen and speech"
				/>
			)}
			<meta name="google-adsense-account" content="ca-pub-7136941557526274" />
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7136941557526274"
				crossOrigin="anonymous"
			/>
			{/* Ad Blocking Recovery */}
			<Script
				src="https://fundingchoicesmessages.google.com/i/pub-7136941557526274?ers=1"
				async
			/>
			<AdBlockingRecovery />
			<Script
				src="https://kit.fontawesome.com/4cde37f226.js"
				crossOrigin="anonymous"
				async
				defer={true}
			/>
		</>
	);
}
