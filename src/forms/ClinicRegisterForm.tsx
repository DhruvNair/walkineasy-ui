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
import { NavLink as RouterLink } from "react-router-dom";

type Props = {
	loginPath: string;
	onRegister: (values: {
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
	}) => Promise<void>;
};

export const phoneRegExp =
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
	diagnosticEquipment: array().of(string()),
	laboratoryEquipment: array().of(string()),
	password: string()
		.required("Password is required!")
		.min(
			8,
			"Password is too short - should be 8 chars minimum with at least one of each: uppercase, lowercase, number and special characters."
		)
		.matches(
			new RegExp("(?=.*[a-z])"),
			"password must contain at least 1 lower case letter"
		)
		.matches(
			new RegExp("(?=.*[A-Z])"),
			"password must contain at least 1 upper case letter"
		)
		.matches(
			new RegExp("(?=.*[0-9])"),
			"password must contain at least 1 number"
		)
		.matches(
			new RegExp("(?=.*[-+_!@#$%^&*.,?])"),
			"password must contain at least 1 special character"
		),
	confirmPassword: string()
		.required("Password confirmation is required!")
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
	{ label: "Wall Diagnostic Boards", value: "Wall Diagnostic Boards" },
	{ label: "Vital Signs Monitors", value: "Vital Signs Monitors" },
	{ label: "Thermometers", value: "Thermometers" },
	{ label: "Patient Monitors", value: "Patient Monitors" },
	{ label: "Pulse Oximeters", value: "Pulse Oximeters" },
	{ label: "Spirometers", value: "Spirometers" },
	{ label: "Ophthalmoscopes", value: "Ophthalmoscopes" },
];

const diagnosticEquipment = [
	{ label: "X-Ray", value: "X-Ray" },
	{ label: "CT-Scan", value: "CT-Scan" },
	{ label: "Ultrasound Machine", value: "Ultrasound Machine" },
	{
		label: "Electrocardiograph Monitors(ECG)",
		value: "Electrocardiograph Monitors(ECG)",
	},
	{
		label: "Magnetic Resonance Imaging (MRI)",
		value: "Magnetic Resonance Imaging (MRI)",
	},
	{ label: "Incentive spirometer", value: "Incentive spirometer" },
	{
		label: "Automated External Defibrillator (AED)",
		value: "Automated External Defibrillator (AED)",
	},
	{ label: "Aspirators", value: "Aspirators" },
	{ label: "Resuscitation bags", value: "Resuscitation bags" },
];
const laboratoryEquipment = [
	{ label: "Chemistry analyzers", value: "Chemistry analyzers" },
	{
		label: "Deoxyribonucleic acid (DNA) analyzers",
		value: "Deoxyribonucleic acid (DNA) analyzers",
	},
	{ label: "Glucose analyzers", value: "Glucose analyzers" },
	{ label: "Hematology analyzers", value: "Hematology analyzers" },
	{ label: "Urine analyzers", value: "Urine analyzers" },
	{ label: "Blood analyzers", value: "Blood analyzers" },
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
			title: "Special Diagnostic Equipment",
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

const ClinicRegisterForm = ({ loginPath, onRegister }: Props) => {
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
			diagnosticEquipment: [] as string[],
			laboratoryEquipment: [] as string[],
			password: "",
			confirmPassword: "",
		},
		validationSchema: clinicRegisterSchema,
		onSubmit: async (values) => {
			const { confirmPassword, ...reqValues } = values;
			setLoading(true);
			await onRegister(reqValues);
			setLoading(false);
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

	async function handleNext() {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}
		if (activeStep === steps.length - 1) {
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
						<Link
							to={loginPath}
							component={RouterLink}
							variant="subtitle2"
						>
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
