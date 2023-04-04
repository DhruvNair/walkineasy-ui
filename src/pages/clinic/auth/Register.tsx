import { Container, Link, styled, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendSignInLinkToEmail,
} from "firebase/auth";
import ClinicRegisterForm from "../../../forms/ClinicRegisterForm";
import { useNavigate } from "react-router-dom";
import { NavLink as RouterLink } from "react-router-dom";
import { faker } from "@faker-js/faker";
import { useToastContext } from "../../../App";

const StyledContent = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}));

const ClinicRegister = () => {
	const { showToast } = useToastContext();
	const navigate = useNavigate();
	const auth = getAuth();
	const actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be in the authorized domains list in the Firebase Console.
		url: "http://localhost:3000/clinic/auth/emailVerified",
		//url: 'https://www.example.com/finishSignUp?cartId=1234',
		// This must be true.
		handleCodeInApp: true,
	};
	const onRegister = async ({
		name,
		email,
		phone,
		street,
		city,
		province,
		password,
		standardEquipment,
		diagnosticEquipment,
		laboratoryEquipment,
	}: {
		name: string;
		email: string;
		phone: string;
		street: string;
		city: string;
		province: string;
		password: string;
		standardEquipment: string[];
		diagnosticEquipment: string[];
		laboratoryEquipment: string[];
	}) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const ref = doc(db, "Clinic Record", email);
			const docSnap = await getDoc(ref);
			if (docSnap.exists()) {
				showToast(
					"Past account deletion was incomplete! Contact system administrator."
				);
			} else {
				try {
					await setDoc(ref, {
						name,
						email,
						phone,
						street,
						city,
						province,
						standardEquipment,
						clinicalEquipment: [],
						diagnosticEquipment,
						laboratoryEquipment,
						id: user.uid,
						doctors: [],
					});
					try {
						await sendSignInLinkToEmail(
							auth,
							email,
							actionCodeSettings
						);
						showToast(
							`A verification link has been sent to ${email}`,
							"success"
						);
						navigate("/clinic/");
					} catch (error) {
						if (error instanceof Error)
							showToast(
								"Error when sending the verification email: " +
									error.message,
								"error"
							);
						else
							showToast(
								"There was an unexpected error when sending the verification email.",
								"error"
							);
					}
				} catch (error) {
					if (error instanceof Error)
						showToast(
							"Error when saving data to the database: " +
								error.message,
							"error"
						);
					else
						showToast(
							"There was an unexpected error when saving data to the database. Contact system administrator.",
							"error"
						);
				}
			}
		} catch (error) {
			if (error instanceof Error)
				showToast(
					"Error when registering user: " + error.message,
					"error"
				);
			else
				showToast(
					"An unknown error has occured during user registration!",
					"error"
				);
		}
	};
	return (
		<Container maxWidth="sm">
			<StyledContent>
				<Typography variant="h4" gutterBottom>
					Register as a Clinic
				</Typography>

				<Typography variant="body2" sx={{ mb: 5 }}>
					Not a clinic?{" "}
					<Link
						component={RouterLink}
						to="/client/auth/register"
						variant="subtitle2"
					>
						Register as a client
					</Link>
				</Typography>
				<ClinicRegisterForm
					loginPath="/clinic/auth/login"
					onRegister={onRegister}
				/>
			</StyledContent>
		</Container>
	);
};

export default ClinicRegister;
