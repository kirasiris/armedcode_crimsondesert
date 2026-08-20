import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import MainComponent from "@/components/main";

const Home = async () => {
	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={settings?.data?.title}
				description={settings?.data?.text}
				favicon={settings?.data?.favicon}
				postImage={settings?.data?.showcase_image}
				imageWidth="800"
				imageHeight="450"
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url="/"
				author={settings?.data?.author}
				createdAt={settings?.data?.createdAt}
				updatedAt={settings?.data?.updatedAt}
				locales=""
				posType="website"
			/>
			{settings.data?.maintenance === false ? (
				<MainComponent />
			) : (
				<p>Server Error</p>
			)}
		</>
	);
};

export default Home;
