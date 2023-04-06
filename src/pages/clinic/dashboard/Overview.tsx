import ChairAltIcon from "@mui/icons-material/ChairAlt";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import MailIcon from "@mui/icons-material/Mail";
import ManIcon from "@mui/icons-material/Man2";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import {
	Badge,
	Card,
	CardContent,
	Container,
	FormControlLabel,
	FormGroup,
	Grid,
	Paper,
	Rating,
	styled,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { get, onValue, ref, set } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { db, rtdb } from "../../../firebase";
import {
	ClinicUserObject,
	DoctorLiveDetails,
	RTDBObject,
} from "../../../slices/authSlice";
import { store, useAppSelector } from "../../../store";
import palette from "../../../theme/palette";

interface CardProps {
	title: string;
	content: string;
	tableData?: DoctorLiveDetails[];
}

const CardComponent: React.FC<
	CardProps & {
		setLiveData: React.Dispatch<
			React.SetStateAction<RTDBObject | undefined>
		>;
	}
> = ({ title, content, tableData, setLiveData }) => {
	async function toggleDocAvailability(row: DoctorLiveDetails) {
		const { auth } = store.getState();
		if (auth.user) {
			const { user } = auth;
			const query = ref(rtdb, user.id);
			const liveData = (await get(query)).val() as RTDBObject;
			const doctors = liveData.doctors;
			doctors.forEach((doctor) => {
				if (doctor.id === row.id) {
					doctor.available = !row.available;
				}
			});
			set(query, { ...liveData, doctors });
			setLiveData({ ...liveData, doctors });
		}
	}

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="h2">
					{title}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{content}
				</Typography>
				{tableData && (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Doctor Name</TableCell>
									<TableCell>Specialization</TableCell>
									<TableCell>Availability status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tableData.map((row, index) => (
									<TableRow key={row.name}>
										<TableCell component="th" scope="row">
											{row.name}
										</TableCell>
										<TableCell component="th" scope="row">
											{row.specialization}
										</TableCell>
										<TableCell sx={{ width: "20%" }}>
											<FormGroup>
												<FormControlLabel
													control={
														<Switch
															checked={
																row.available
															}
															onChange={() =>
																toggleDocAvailability(
																	row
																)
															}
														/>
													}
													label={
														row.available
															? "Available"
															: "Unavailable"
													}
												/>
											</FormGroup>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</CardContent>
		</Card>
	);
};

const StyledRating = styled(Rating)({
	"& .MuiRating-iconFilled": {
		color: palette.primary.main,
	},
	"& .MuiRating-iconHover": {
		color: palette.primary.main,
	},
});

const NewCardComponent: React.FC<
	CardProps & { rush: number; updateRush: (value: number) => Promise<void> }
> = ({ title, content, rush, updateRush }) => {
	const [icon, setIcon] = React.useState(
		<Tooltip title="Can take more patients" placement="top">
			<GroupAddOutlinedIcon sx={{ fontSize: 40 }} />
		</Tooltip>
	);

	const handleChange = (
		event: React.SyntheticEvent<Element, Event>,
		value: number | null
	) => {
		updateRush(value || 0);
		if (!value || value < 5) {
			setIcon(
				<Tooltip title="Can take more patients" placement="top">
					<GroupAddOutlinedIcon sx={{ fontSize: 40 }} />
				</Tooltip>
			);
		} else if (value < 7) {
			setIcon(
				<Tooltip title="Can take few patients" placement="top">
					<PersonAddOutlinedIcon sx={{ fontSize: 40 }} />
				</Tooltip>
			);
		} else {
			setIcon(
				<Tooltip title="Cannot take any more patients" placement="top">
					<PersonOffOutlinedIcon sx={{ fontSize: 40 }} />
				</Tooltip>
			);
		}
	};
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="h2">
					{title}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{content}
				</Typography>
				<Grid container spacing={10}>
					<Grid item xs={12} sm={8}>
						<StyledRating
							value={rush}
							max={10}
							onChange={handleChange}
							icon={<ManIcon />}
							emptyIcon={<ChairAltIcon />}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						{icon}
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

const CardComponent2: React.FC<CardProps & { requests: number }> = ({
	title,
	content,
	requests,
}) => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="h2">
					{title}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{content}
				</Typography>
				<Badge
					max={99}
					badgeContent={requests}
					overlap="circular"
					to="/clinic/dashboard/requests"
					component={RouterLink}
					color="success"
				>
					<MailIcon sx={{ fontSize: 40 }} color="action" />
				</Badge>
			</CardContent>
		</Card>
	);
};

const Overview = () => {
	const { user } = useAppSelector((state) => state.auth);
	const [liveData, setLiveData] = React.useState<RTDBObject | undefined>();
	const updateRush = async (value: number) => {
		if (user) {
			const query = ref(rtdb, user.id);
			const fetchedLiveData = (await get(query)).val() as RTDBObject;
			const newLiveData = { ...fetchedLiveData, rush: value };
			set(query, newLiveData);
			setLiveData(newLiveData);
		}
	};
	useEffect(() => {
		fetchLiveData();
		const query = ref(rtdb, user?.id || "");
		return onValue(query, (snapshot) => {
			if (snapshot.val()) {
				setLiveData(snapshot.val());
			}
		});
	}, []);
	const fetchLiveData = async () => {
		if (user) {
			const docRef = doc(db, "Clinic Record", user.email);
			const data = (await getDoc(docRef)).data() as ClinicUserObject;
			const doctors = data.doctors;
			const query = ref(rtdb, user.id);
			const fetchedLiveData = (await get(query)).val() as RTDBObject;
			const finalData = doctors.map((doctor) => ({
				...doctor,
				available:
					fetchedLiveData?.doctors?.find(
						(liveEach) => liveEach.id === doctor.id
					)?.available || false,
			}));
			const newLiveData = fetchedLiveData
				? { ...fetchedLiveData, doctors: finalData }
				: { doctors: finalData, rush: 5, requests: [] };
			set(query, newLiveData);
			setLiveData(newLiveData);
		} else {
			console.error("Something wrong with fetchLiveData");
		}
	};

	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<CardComponent2
						title="Pending Requests"
						requests={liveData?.requests?.length || 0}
						content=""
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<NewCardComponent
						title="Current Rush Indicator"
						content=""
						rush={liveData?.rush || 5}
						updateRush={updateRush}
					/>
				</Grid>
				<Grid item xs={12}>
					<CardComponent
						title="Update Doctor Availability"
						content=""
						tableData={liveData?.doctors || []}
						setLiveData={setLiveData}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Overview;
