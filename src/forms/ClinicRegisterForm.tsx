import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Link,
	Stack,
	StepContent,
	TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { FormikProps, useFormik } from "formik";
import * as React from "react";
import { useState } from "react";
import { array, object, ref, string } from "yup";
import Iconify from "../components/iconify";
import useResponsive from "../hooks/useResponsive";
import {setDoc, doc, getFirestore} from "firebase/firestore";

type Props = {
	loginPath: string;
};

const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const clinicRegisterSchema = object({
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
	clinicalEquipment: array().of(string()),
	diagnosticEquipment: array().of(string()),
	laboratoryEquipment: array().of(string()),
	password: string().required("Password is required!"),
	confirmPassword: string()
		.required("Password is required!")
		.oneOf([ref("password")], "Your passwords do not match!"),
});

type clinicRegistrationFields = {
	name: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	province: string;
	standardEquipment: string[];
	clinicalEquipment: string[];
	diagnosticEquipment: string[];
	laboratoryEquipment: string[];
	password: string;
	confirmPassword: string;
};

type StepItem = {
	label: string;
	optional?: boolean;
	component: React.ReactNode;
	fields: (keyof clinicRegistrationFields)[];
};

const standardEquipment = [
	{ label: "Standard Equipment 1", value: "standard1" },
	{ label: "Standard Equipment 2", value: "standard2" },
	{ label: "Standard Equipment 3", value: "standard3" },
	{ label: "Standard Equipment 4", value: "standard4" },
	{ label: "Standard Equipment 5", value: "standard5" },
	{ label: "Standard Equipment 6", value: "standard6" },
	{ label: "Standard Equipment 7", value: "standard7" },
	{ label: "Standard Equipment 8", value: "standard8" },
	{ label: "Standard Equipment 9", value: "standard9" },
	{ label: "Standard Equipment 10", value: "standard10" },
];
const clinicalEquipment = [
	{ label: "Clinical Equipment 1", value: "clinical1" },
	{ label: "Clinical Equipment 2", value: "clinical2" },
	{ label: "Clinical Equipment 3", value: "clinical3" },
	{ label: "Clinical Equipment 4", value: "clinical4" },
	{ label: "Clinical Equipment 5", value: "clinical5" },
	{ label: "Clinical Equipment 6", value: "clinical6" },
	{ label: "Clinical Equipment 7", value: "clinical7" },
	{ label: "Clinical Equipment 8", value: "clinical8" },
	{ label: "Clinical Equipment 9", value: "clinical9" },
	{ label: "Clinical Equipment 10", value: "clinical10" },
];
const diagnosticEquipment = [
	{ label: "Diagnostic Equipment 1", value: "diagnostic1" },
	{ label: "Diagnostic Equipment 2", value: "diagnostic2" },
	{ label: "Diagnostic Equipment 3", value: "diagnostic3" },
	{ label: "Diagnostic Equipment 4", value: "diagnostic4" },
	{ label: "Diagnostic Equipment 5", value: "diagnostic5" },
	{ label: "Diagnostic Equipment 6", value: "diagnostic6" },
	{ label: "Diagnostic Equipment 7", value: "diagnostic7" },
	{ label: "Diagnostic Equipment 8", value: "diagnostic8" },
	{ label: "Diagnostic Equipment 9", value: "diagnostic9" },
	{ label: "Diagnostic Equipment 10", value: "diagnostic10" },
];
const laboratoryEquipment = [
	{ label: "Laboratory Equipment 1", value: "laboratory1" },
	{ label: "Laboratory Equipment 2", value: "laboratory2" },
	{ label: "Laboratory Equipment 3", value: "laboratory3" },
	{ label: "Laboratory Equipment 4", value: "laboratory4" },
	{ label: "Laboratory Equipment 5", value: "laboratory5" },
	{ label: "Laboratory Equipment 6", value: "laboratory6" },
	{ label: "Laboratory Equipment 7", value: "laboratory7" },
	{ label: "Laboratory Equipment 8", value: "laboratory8" },
	{ label: "Laboratory Equipment 9", value: "laboratory9" },
	{ label: "Laboratory Equipment 10", value: "laboratory10" },
];

const Step1Component = ({
	formik,
}: {
	formik: FormikProps<clinicRegistrationFields>;
}) => {
	return (
		<Stack spacing={3}>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.name}
				error={formik.touched.name && !!formik.errors.name}
				helperText={formik.touched.name && formik.errors.name}
				placeholder="What's Your Name?"
				name="name"
				label="Name"
			/>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.email}
				error={formik.touched.email && !!formik.errors.email}
				helperText={formik.touched.email && formik.errors.email}
				placeholder="How Can We Reach You?"
				name="email"
				label="Email address"
			/>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.phone}
				error={formik.touched.phone && !!formik.errors.phone}
				helperText={formik.touched.phone && formik.errors.phone}
				placeholder="Ring, Ring!"
				name="phone"
				label="Phone number"
			/>
		</Stack>
	);
};

const Step2Component = ({
	formik,
}: {
	formik: FormikProps<clinicRegistrationFields>;
}) => {
	return (
		<Stack spacing={3}>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.street}
				error={formik.touched.street && !!formik.errors.street}
				helperText={formik.touched.street && formik.errors.street}
				placeholder="Where's Home?"
				name="street"
				label="Street"
			/>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.province}
				error={formik.touched.province && !!formik.errors.province}
				helperText={formik.touched.province && formik.errors.province}
				placeholder="Which Province?"
				name="province"
				label="Province"
			/>
			<TextField
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.city}
				error={formik.touched.city && !!formik.errors.city}
				helperText={formik.touched.city && formik.errors.city}
				placeholder="Which Province?"
				name="city"
				label="City"
			/>
		</Stack>
	);
};

const Step3Component = ({
	formik,
}: {
	formik: FormikProps<clinicRegistrationFields>;
}) => {
	const [expanded, setExpanded] = useState<string | false>(false);
	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};
	const accordions = [
		{
			title: "Standard Equipment",
			options: standardEquipment,
			id: "standardEquipment" as keyof clinicRegistrationFields,
		},
		{
			title: "Clinical Equipment",
			options: clinicalEquipment,
			id: "clinicalEquipment" as keyof clinicRegistrationFields,
		},
		{
			title: "Diagnostic Equipment",
			options: diagnosticEquipment,
			id: "diagnosticEquipment" as keyof clinicRegistrationFields,
		},
		{
			title: "Laboratory Equipment",
			options: laboratoryEquipment,
			id: "laboratoryEquipment" as keyof clinicRegistrationFields,
		},
	];
	return (
		<>
			{accordions.map((accordion) => (
				<Accordion
					key={accordion.id}
					expanded={expanded === accordion.title}
					onChange={handleChange(accordion.title)}
					sx={{ backgroundColor: "#e8ecf0" }}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={accordion.title + "-content"}
						id={accordion.title + "-header"}
					>
						<Typography sx={{ fontWeight: "bold" }}>
							{accordion.title}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box>
							{accordion.options.map((option) => (
								<FormControlLabel
									key={option.value}
									control={
										<Checkbox
											checked={formik.values[
												accordion.id
											].includes(option.value)}
											id={option.value}
											name={accordion.id}
											onChange={(e) => {
												let oldValue = formik.values[
													accordion.id
												] as string[];
												if (e.target.checked) {
													oldValue.push(option.value);
												} else {
													const index =
														oldValue.indexOf(
															option.value
														);
													oldValue.splice(index, 1);
												}
												formik.setFieldValue(
													accordion.id,
													oldValue
												);
											}}
										/>
									}
									label={option.label}
								/>
							))}
						</Box>
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
};

const Step4Component = ({
	formik,
}: {
	formik: FormikProps<clinicRegistrationFields>;
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	return (
		<Stack spacing={3}>
			<TextField
				name="password"
				label="Password"
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.password}
				error={formik.touched.password && !!formik.errors.password}
				helperText={formik.touched.password && formik.errors.password}
				type={showPassword ? "text" : "password"}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
							>
								<Iconify
									icon={
										showPassword
											? "eva:eye-fill"
											: "eva:eye-off-fill"
									}
								/>
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<TextField
				name="confirmPassword"
				label="Confirm Password"
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.confirmPassword}
				error={
					formik.touched.confirmPassword &&
					!!formik.errors.confirmPassword
				}
				helperText={
					formik.touched.password && formik.errors.confirmPassword
				}
				type={showConfirmPassword ? "text" : "password"}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								edge="end"
							>
								<Iconify
									icon={
										showConfirmPassword
											? "eva:eye-fill"
											: "eva:eye-off-fill"
									}
								/>
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</Stack>
	);
};

const ClinicRegisterForm = ({ loginPath }: Props) => {
	async function AddDocument_Clinic(){
		const db = getFirestore();

		const ref = doc(db,"Clinic Record", formik.values.email);

		const docRef = await setDoc(
			ref, {
				Name: formik.values.name,
				email: formik.values.email,
				phone:formik.values.phone,
				street: formik.values.street,
				city: formik.values.city,
				province: formik.values.province,
				confirmPass: formik.values.confirmPassword
			}
		).then(()=>{
			alert("data added successfully")
		}).catch((error: Error) => {
			alert("Unsuccessful operation, error:" + error);
		});

	}
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set<number>());
	const [loading, setLoading] = useState(false);
	const isMobile = useResponsive("down", "md");

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			phone: "",
			street: "",
			city: "",
			province: "",
			standardEquipment: [] as string[],
			clinicalEquipment: [] as string[],
			diagnosticEquipment: [] as string[],
			laboratoryEquipment: [] as string[],
			password: "",
			confirmPassword: "",
		},
		validationSchema: clinicRegisterSchema,
		onSubmit: (values) => {
			setLoading(true);
			console.log(values);
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		},
	});

	const validFieldArray = (array: (keyof clinicRegistrationFields)[]) =>
		activeStep === 2
			? array.some((field) => formik.values[field].length > 0)
			: array.every(
					(field) => !formik.errors[field] && formik.values[field]
			  );

	const steps: StepItem[] = [
		{
			label: "Tell Us About Your Clinic!",
			component: <Step1Component formik={formik} />,
			fields: ["name", "email", "phone"],
		},
		{
			label: "Clinic Location",
			component: <Step2Component formik={formik} />,
			fields: ["street", "city", "province"],
		},
		{
			label: "What equipment are you on?",
			component: <Step3Component formik={formik} />,
			fields: [
				"standardEquipment",
				"clinicalEquipment",
				"diagnosticEquipment",
				"laboratoryEquipment",
			],
		},
		{
			label: "Secure your account",
			component: <Step4Component formik={formik} />,
			fields: ["password", "confirmPassword"],
		},
	];

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	async function handleNext(){
	let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}
		if (activeStep === steps.length - 1) {
			await AddDocument_Clinic();
			formik.handleSubmit();
		} else {
			if (validFieldArray(steps[activeStep].fields)) {
				setActiveStep((previousStep) => previousStep + 1);
			}
		}
		setSkipped(newSkipped);
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (steps[activeStep].optional) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Stepper
				activeStep={activeStep}
				orientation={isMobile ? "vertical" : "horizontal"}
			>
				{steps.map((step, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};
					if (steps[index].optional) {
						labelProps.optional = (
							<Typography variant="caption">Optional</Typography>
						);
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={step.label} {...stepProps}>
							<StepLabel {...labelProps}>{step.label}</StepLabel>
							{isMobile && (
								<StepContent>
									<Box my={5}>
										{steps[activeStep].component}
									</Box>
									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										{!loading && (
											<Button
												color="inherit"
												disabled={activeStep === 0}
												onClick={handleBack}
												sx={{ mr: 1 }}
											>
												Back
											</Button>
										)}
										<Box sx={{ flex: "1 1 auto" }} />
										{steps[activeStep].optional &&
											!loading && (
												<Button
													color="inherit"
													onClick={handleSkip}
													sx={{ mr: 1 }}
												>
													Skip
												</Button>
											)}
										<LoadingButton
											disabled={
												!validFieldArray(
													steps[activeStep].fields
												)
											}
											loading={loading}
											onClick={handleNext}
										>
											{activeStep === steps.length - 1
												? "Finish"
												: "Next"}
										</LoadingButton>
									</Box>
								</StepContent>
							)}
						</Step>
					);
				})}
			</Stepper>
			{!isMobile && <Box mt={5}>{steps[activeStep].component}</Box>}
			{!loading && (
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ my: 2 }}
				>
					<Typography variant="subtitle2">
						Already have an account?{" "}
						<Link href={loginPath} variant="subtitle2">
							Login here
						</Link>
					</Typography>
				</Stack>
			)}
			{!isMobile && (
				<Box sx={{ display: "flex", flexDirection: "row" }}>
					{!loading && (
						<Button
							color="inherit"
							disabled={activeStep === 0}
							onClick={handleBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
					)}
					<Box sx={{ flex: "1 1 auto" }} />
					{steps[activeStep].optional && !loading && (
						<Button
							color="inherit"
							onClick={handleSkip}
							sx={{ mr: 1 }}
						>
							Skip
						</Button>
					)}
					<LoadingButton
						disabled={!validFieldArray(steps[activeStep].fields)}
						loading={loading}
						onClick={handleNext}
					>
						{activeStep === steps.length - 1 ? "Finish" : "Next"}
					</LoadingButton>
				</Box>
			)}
		</Box>
	);
};

export default ClinicRegisterForm;
