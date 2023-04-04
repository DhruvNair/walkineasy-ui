import { faker } from "@faker-js/faker";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import UnavailableIcon from "@mui/icons-material/Cancel";
import AvailableIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Rating } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { get, onValue, ref, set } from "firebase/database";
import * as React from "react";
import { useEffect, useState } from "react";
import BasicModal from "../../components/modal";
import { db, rtdb } from "../../firebase";
import useResponsive from "../../hooks/useResponsive";
import {
	ClinicUserObject,
	DoctorLiveDetails,
	RTDBObject,
} from "../../slices/authSlice";
import { useAppSelector } from "../../store";
import palette from "../../theme/palette";
import { useToastContext } from "../../App";

const specializations = [
	"Allergy and immunology",
	"Anesthesiology",
	"Dermatology",
	"Diagnostic radiology",
	"Emergency medicine",
	"Family medicine",
	"Internal medicine",
	"Medical genetics",
	"Neurology",
	"Nuclear medicine",
	"Obstetrics and gynecology",
	"Ophthalmology",
	"Pathology",
	"Pediatrics",
	"Physical medicine and rehabilitation",
	"Preventive medicine",
	"Psychiatry",
	"Radiation oncology",
	"Surgery",
	"Urology",
];

const equipment = [
	"Exam tables",
	"Defibrillator",
	"Emergency equipment",
	"Cleaning products and sterilization tools",
	"Gloves and masks",
	"Blood pressure monitors",
	"Thermometers",
	"Containers for toxic materials and needles",
	"Stepstools",
	"Stethoscopes",
	"Lighting equipment",
	"Scales",
	"Clocks",
	"Eye charts",
	"ECG equipment",
];

function createData(): {
	clinicName: string;
	address: string;
	email: string;
	rush: number;
	equipment: string[];
	specialists: DoctorLiveDetails[];
} {
	return {
		clinicName: faker.company.companyName() + " Clinic",
		address: faker.address.streetAddress(),
		email: faker.internet.email(),
		rush: faker.datatype.number({ max: 10 }),
		equipment: faker.helpers.arrayElements(equipment),
		specialists: Array.from(
			{ length: faker.datatype.number({ max: 5 }) },
			() => ({
				id: faker.datatype.uuid(),
				name: faker.name.fullName(),
				specialization: faker.helpers.arrayElement(specializations),
				available: faker.datatype.boolean(),
			})
		),
	};
}

const StyledBar = styled("div")({
	width: "6px",
	height: "1em",
	border: "1px solid " + palette.primary.main,
	marginRight: "2px",
	marginLeft: "2px",
});

const getAddress = (clinicData: ClinicUserObject) => {
	return [clinicData.street, clinicData.city, clinicData.province].join(", ");
};

const getEquipment = (clinicData: ClinicUserObject) => [
	...(clinicData.standardEquipment || []),
	...(clinicData.clinicalEquipment || []),
	...(clinicData.diagnosticEquipment || []),
	...(clinicData.laboratoryEquipment || []),
];

function Row({
	clinicData,
	onRequestBooking,
}: {
	clinicData: ClinicUserObject;
	onRequestBooking: (id: string, duration: ETA) => Promise<void>;
}) {
	const [open, setOpen] = React.useState(false);
	const mdUp = useResponsive("up", "md");
	const smUp = useResponsive("up", "sm");
	const equipments = getEquipment(clinicData);
	const address = getAddress(clinicData);
	const [realTime, setRealTime] = useState<RTDBObject>();
	useEffect(() => {
		const query = ref(rtdb, clinicData.id);
		return onValue(query, (snapshot) => {
			if (snapshot.val()) {
				setRealTime(snapshot.val());
			}
		});
	}, []);

	return (
		<React.Fragment>
			<TableRow
				sx={{
					"& > *": { borderBottom: "unset" },
				}}
			>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{clinicData.name}
				</TableCell>
				{smUp && <TableCell>{address}</TableCell>}
				{mdUp && <TableCell>{clinicData.email}</TableCell>}
				<TableCell align="center">
					{realTime ? (
						<Rating
							value={realTime.rush}
							max={10}
							readOnly
							icon={
								<StyledBar
									sx={{
										backgroundColor: palette.primary.main,
									}}
								/>
							}
							emptyIcon={<StyledBar />}
						/>
					) : (
						<Typography>Real time data unavailable</Typography>
					)}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={5}
				>
					<Collapse in={open} timeout="auto">
						<Box sx={{ margin: 1 }}>
							{!smUp && (
								<Stack direction="row" sx={{ marginY: 4 }}>
									<Typography
										variant="subtitle2"
										sx={{ marginRight: 2 }}
									>
										Address:
									</Typography>
									<Typography variant="body2">
										{address}
									</Typography>
								</Stack>
							)}
							{!mdUp && (
								<Stack direction="row" sx={{ marginY: 4 }}>
									<Typography
										variant="subtitle2"
										sx={{ marginRight: 2 }}
									>
										Email:
									</Typography>
									<Typography variant="body2">
										{clinicData.email}
									</Typography>
								</Stack>
							)}
							<Stack
								direction="row"
								sx={{ marginY: 4, alignItems: "center" }}
							>
								<Typography
									variant="subtitle2"
									sx={{ marginRight: 2 }}
								>
									Equipment Available:
								</Typography>
								<Stack
									direction="row"
									flexWrap="wrap"
									rowGap={1}
									spacing={1}
								>
									{equipments.length > 0 ? (
										equipments.map((equipment, index) => (
											<Chip
												key={index}
												size={
													!smUp ? "small" : undefined
												}
												label={equipment}
											/>
										))
									) : (
										<Typography>
											No equipment data available
										</Typography>
									)}
								</Stack>
							</Stack>
							<Box sx={{ width: "100%" }}>
								{realTime &&
									realTime.doctors &&
									realTime.doctors.length > 0 && (
										<Table
											size="small"
											aria-label="specialists"
										>
											<TableHead>
												<TableRow>
													<TableCell component="th">
														<Typography variant="body2">
															Name
														</Typography>
													</TableCell>
													<TableCell component="th">
														<Typography variant="body2">
															Specialization
														</Typography>
													</TableCell>
													<TableCell
														component="th"
														align="center"
													>
														<Typography variant="body2">
															Availability
														</Typography>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{realTime.doctors.map(
													(doctor, index) => (
														<TableRow key={index}>
															<TableCell>
																<Typography variant="body2">
																	{
																		doctor.name
																	}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography variant="body2">
																	{
																		doctor.specialization
																	}
																</Typography>
															</TableCell>
															<TableCell align="center">
																{doctor.available ? (
																	<AvailableIcon color="success" />
																) : (
																	<UnavailableIcon color="error" />
																)}
															</TableCell>
														</TableRow>
													)
												)}
											</TableBody>
										</Table>
									)}
							</Box>
							<div id="content" style={{ marginTop: "20px" }}>
								<BasicModal
									details={{
										id: clinicData.id,
										name: clinicData.name,
									}}
									onRequestBooking={async (id, duration) => {
										await onRequestBooking(id, duration);
										setOpen(false);
									}}
								/>
							</div>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

const rows = Array.from(
	{ length: faker.datatype.number({ max: 15, min: 1 }) },
	createData
);

type ETA = 5 | 10 | 15;

export default function CollapsibleTable({
	searchQuery,
}: {
	searchQuery: { text: string; location: string };
}) {
	const mdUp = useResponsive("up", "md");
	const smUp = useResponsive("up", "sm");
	const [clinicData, setClinicData] = useState<ClinicUserObject[]>([]);
	const { user } = useAppSelector((state) => state.auth);
	const fetchClinicData = async () => {
		const docRef = collection(db, "Clinic Record");
		const data = (await getDocs(docRef)).docs;
		const actualData = data.map((each) => each.data() as ClinicUserObject);
		setClinicData(actualData);
	};
	const { showToast } = useToastContext();
	useEffect(() => {
		fetchClinicData();
	}, []);

	const requestBooking = async (id: string, eta: ETA) => {
		if (user) {
			const query = ref(rtdb, id);
			const liveData = (await get(query)).val() as RTDBObject;
			set(
				query,
				liveData
					? {
							...liveData,
							requests: [
								...(liveData.requests || []),
								{ from: user.email, eta },
							],
					  }
					: { requests: [{ from: user.email, eta }] }
			);
			showToast(
				"Request has been sent! You will receive an email if it is confirmed!",
				"success"
			);
		}
	};

	const visibleData = clinicData.filter(
		(each) =>
			each.name?.toLowerCase().includes(searchQuery.text) &&
			[
				each.street.toLowerCase(),
				each.city.toLowerCase(),
				each.province.toLowerCase(),
			].some((field) => field.includes(searchQuery.location))
	);

	return (
		<>
			<TableContainer component={Paper}>
				{visibleData.length > 0 ? (
					<Table aria-label="collapsible table">
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>Clinic Name</TableCell>
								{smUp && <TableCell>Address</TableCell>}
								{mdUp && <TableCell>Email</TableCell>}
								<TableCell align="center">Rush</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{visibleData.map((row) => (
								<Row
									key={row.name}
									clinicData={row}
									onRequestBooking={requestBooking}
								/>
							))}
						</TableBody>
					</Table>
				) : (
					<Typography>No clinics currently available</Typography>
				)}
			</TableContainer>
		</>
	);
}
