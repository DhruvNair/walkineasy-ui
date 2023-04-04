import { Container, Link, styled, Typography } from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NavLink as RouterLink } from "react-router-dom";
import { useToastContext } from "../../../App";
import { db } from "../../../firebase";
import { LoginForm } from "../../../forms/LoginForm";
import { ClinicUserObject, login } from "../../../slices/authSlice";
import { useAppDispatch } from "../../../store";

const StyledContent = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}));

const ClinicLogin = () => {
	const { showToast } = useToastContext();
	const dispatch = useAppDispatch();
	const onLogin = async (email: string, password: string) => {
		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const ref = doc(db, "Clinic Record", email);
			const docSnap = await getDoc(ref);
			if (docSnap.exists()) {
				const userData = docSnap.data() as ClinicUserObject;
				dispatch(login({ userType: "clinic", user: userData }));
				showToast(`Logged in as ${userData.name}!`, "success");
			} else {
				showToast("This account is registered as a Client!", "error");
			}
		} catch (error) {
			if (error instanceof Error) showToast(error.message, "error");
			else showToast("An unknown error has occured!", "error");
		}
	};
	return (
		<Container maxWidth="sm">
			<StyledContent>
				<Typography variant="h4" gutterBottom>
					Sign in as a Clinic
				</Typography>

				<Typography variant="body2" sx={{ mb: 5 }}>
					Not a clinic?{" "}
					<Link
						component={RouterLink}
						to="/client/auth/login"
						variant="subtitle2"
					>
						Sign in as a User
					</Link>
				</Typography>

				<LoginForm
					registerPath="/clinic/auth/register"
					forgotPath="/clinic/auth/forgot"
					onLogin={onLogin}
				/>
			</StyledContent>
		</Container>
	);
};

export default ClinicLogin;
