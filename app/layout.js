import "@/src/css/bootstrap.css";
import "@/src/css/global.css";
import "@/src/css/app.css";
import { BootstrapClient } from "@/helpers/bootstrapClient";

const RootLayout = async ({ children }) => {
	return (
		<html lang="en">
			{/* HEAD SHOULD NEVER BE WITHIN LAYOUT FILE AS IT WILL ALWAYS TRY TO FETCH INFORMATION FROM ITSELF UNLESS CHILD PAGES USE THEIR OWN LAYOUT FILES WHICH ARE NOT BEING USED */}
			<body>
				<main>{children}</main>
				<BootstrapClient />
			</body>
		</html>
	);
};

export default RootLayout;
