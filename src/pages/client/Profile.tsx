import { doc, getDoc, setDoc } from "@firebase/firestore";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { object, string } from "yup";
import { useToastContext } from "../../App";
import { db } from "../../firebase";
import { phoneRegExp } from "../../forms/ClinicRegisterForm";
import { UserObject, setUserObject } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store";

const clientProfileSchema = object({
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
});

export default function ClientProfile() {
	useEffect(() => {
		fetchClientData();
	}, []);
	const { showToast } = useToastContext();
	const [loading, setLoading] = useState(false);
	const user = useAppSelector((state) => state.auth.user) as UserObject;
	const dispatch = useAppDispatch();
	const formik = useFormik({
		initialValues: user,
		validationSchema: clientProfileSchema,
		onSubmit: async (values) => {
			setLoading(true);
			await updateDetails(values);
			await fetchClientData();
			setLoading(false);
		},
		isInitialValid: false,
	});

	const fetchClientData = async () => {
		const ref = doc(db, "Client Record", user.email);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			formik.setValues(docSnap.data() as UserObject);
			const data = docSnap.data() as UserObject;
			dispatch(setUserObject(data));
			formik.setValues(data);
		} else {
			showToast("Couldn't find data associated with this user");
		}
	};
	const updateDetails = async (details: UserObject) => {
		try {
			const ref = doc(db, "Client Record", user.email);
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
				<Typography variant="h3">Client Details</Typography>
			</Stack>
			<Stack p={5}>
				<Stack
					direction={{ lg: "row", sm: "column" }}
					justifyContent="space-evenly"
				>
					<Card>
						<CardContent>
							<Stack>
								<Typography variant="subtitle1">
									Contact details
								</Typography>
								<Stack mt={2} py={5} px={{ lg: 5 }} spacing={5}>
									<TextField
										name="name"
										label="Name"
										error={
											formik.touched.name &&
											!!formik.errors.name
										}
										helperText={
											formik.touched.name &&
											formik.errors.name
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
											formik.touched.phone &&
											formik.errors.phone
										}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.phone}
									/>
								</Stack>
							</Stack>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
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
											formik.touched.city &&
											!!formik.errors.city
										}
										helperText={
											formik.touched.city &&
											formik.errors.city
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
						</CardContent>
					</Card>
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
