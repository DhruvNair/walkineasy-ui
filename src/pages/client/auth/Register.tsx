import { Container, Link, styled, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ClientRegisterForm from "../../../forms/ClientRegisterForm";
import { useNavigate } from "react-router-dom";
import { NavLink as RouterLink } from "react-router-dom";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useToastContext } from "../../../App";
import { UserObject } from "../../../slices/authSlice";

const StyledContent = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}));

const ClientRegister = () => {
	const { showToast } = useToastContext();
	const navigate = useNavigate();
	const auth = getAuth();
	// send email to verify account
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
	}: UserObject & { password: string }) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const ref = doc(db, "Client Record", email);
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
						navigate("/client/");
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
					Register as a Client
				</Typography>

				<Typography variant="body2" sx={{ mb: 5 }}>
					Not a client?{" "}
					<Link
						to="/clinic/auth/register"
						component={RouterLink}
						variant="subtitle2"
					>
						Register as a clinic
					</Link>
				</Typography>
				<ClientRegisterForm
					loginPath="/client/auth/login"
					onRegister={onRegister}
				/>
			</StyledContent>
		</Container>
	);
};

export default ClientRegister;
