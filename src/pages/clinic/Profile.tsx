import { doc, getDoc, setDoc } from "@firebase/firestore";
import { Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { array, object, string } from "yup";
import { useToastContext } from "../../App";
import { db } from "../../firebase";
import { phoneRegExp } from "../../forms/ClinicRegisterForm";
import { ClinicUserObject } from "../../slices/authSlice";
import { useAppSelector } from "../../store";
import _ from "lodash";
import { LoadingButton } from "@mui/lab";

const clinicProfileSchema = object({
	name: string().required("We need to call you something!"),
	email: string()
		.email("Please enter a valid email!")
		.required("Email is required!"),
	phone: string()
		.matches(phoneRegExp, "That doesn't look like a phone number")
		.required("Phone number is required!"),
	street: string().required("Street is required!"),
	city: string().required("City is required!"),
	province: string().required("Province is required!"),
	standardEquipment: array().of(string()),
	diagnosticEquipment: array().of(string()),
	laboratoryEquipment: array().of(string()),
});

export default function ClinicProfile() {
	useEffect(() => {
		fetchClinicData();
	}, []);
	const { showToast } = useToastContext();
	const [loading, setLoading] = useState(false);
	const user = useAppSelector((state) => state.auth.user) as ClinicUserObject;
	const formik = useFormik({
		initialValues: user,
		validationSchema: clinicProfileSchema,
		onSubmit: async (values) => {
			setLoading(true);
			await updateDetails(values);
			await fetchClinicData();
			setLoading(false);
		},
		isInitialValid: false,
	});

	const fetchClinicData = async () => {
		const ref = doc(db, "Clinic Record", user.email);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			formik.setValues(docSnap.data() as ClinicUserObject);
		} else {
			showToast("Couldn't find data associated with this user");
		}
	};
	const updateDetails = async (details: ClinicUserObject) => {
		try {
			const ref = doc(db, "Clinic Record", user.email);
			await setDoc(ref, details);
			showToast("Changes saved successfully!", "success");
		} catch (error) {
			if (error instanceof Error)
				showToast(
					`Error when saving changes: ${error.message}`,
					"error"
				);
			else
				showToast("There was an unexpected error when saving changes.");
		}
	};
	const navigate = useNavigate();

	return (
		<Container>
			<Stack direction="row">
				<Typography variant="h3">Clinic Details</Typography>
			</Stack>
			<Stack p={5}>
				<Stack
					direction={{ lg: "row", sm: "column" }}
					justifyContent="space-evenly"
				>
					<Stack>
						<Typography variant="subtitle1">
							Contact details
						</Typography>
						<Stack mt={2} py={5} px={{ lg: 5 }} spacing={5}>
							<TextField
								name="name"
								label="Name"
								error={
									formik.touched.name && !!formik.errors.name
								}
								helperText={
									formik.touched.name && formik.errors.name
								}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.name}
							/>
							<TextField
								label="Email"
								disabled
								value={formik.values.email}
							/>
							<TextField
								name="phone"
								label="Phone"
								error={
									formik.touched.phone &&
									!!formik.errors.phone
								}
								helperText={
									formik.touched.phone && formik.errors.phone
								}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.phone}
							/>
						</Stack>
					</Stack>
					<Stack>
						<Typography variant="subtitle1">
							Address details
						</Typography>
						<Stack mt={2} py={5} px={{ lg: 5 }} spacing={5}>
							<TextField
								name="street"
								label="Street"
								error={
									formik.touched.street &&
									!!formik.errors.street
								}
								helperText={
									formik.touched.street &&
									formik.errors.street
								}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.street}
							/>
							<TextField
								name="city"
								label="City"
								error={
									formik.touched.city && !!formik.errors.city
								}
								helperText={
									formik.touched.city && formik.errors.city
								}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.city}
							/>
							<TextField
								name="province"
								label="Province"
								error={
									formik.touched.province &&
									!!formik.errors.province
								}
								helperText={
									formik.touched.province &&
									formik.errors.province
								}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.province}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			<Stack
				direction="row"
				spacing={5}
				alignItems="center"
				justifyContent="flex-end"
			>
				<Button onClick={() => navigate(-1)}>Go Back</Button>
				<LoadingButton
					variant="contained"
					type="submit"
					loading={loading}
					size="large"
					disabled={_.isEqual(formik.values, user)}
					onClick={() => formik.handleSubmit()}
				>
					Save changes
				</LoadingButton>
			</Stack>
		</Container>
	);
}
