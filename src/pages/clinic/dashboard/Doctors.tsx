import { faker } from "@faker-js/faker";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { ClinicUserObject, DoctorDetails } from "../../../slices/authSlice";
import { useAppSelector } from "../../../store";

interface Column {
	id: "name" | "specialization";
	label: string;
	minWidth?: number;
	align?: "center";
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ id: "name", label: "Name", minWidth: 200, align: "center" },
	{
		id: "specialization",
		label: "Specialization",
		minWidth: 200,
		align: "center",
	},
];

interface Data {
	name: string;
	specialization: string;
	id: string;
}

function ColumnGroupingTable() {
	const [page, setPage] = React.useState(0);
	const [rows, setRows] = React.useState<Data[]>([]);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const nameRef = React.useRef<HTMLInputElement>(null);
	const designationRef = React.useRef<HTMLInputElement>(null);
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};
	const { user } = useAppSelector((state) => state.auth);

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const [hiddenRows, setHiddenRows] = useState<number[]>([]);
	const handleHideRow = (index: number) => {
		setHiddenRows([...hiddenRows, index]);
	};
	const tableRef = useRef<HTMLTableElement>(null);
	const getDoctors = async () => {
		if (user) {
			const ref = doc(db, "Clinic Record", user.email);
			const data = (await getDoc(ref)).data() as ClinicUserObject;
			setRows(data.doctors);
		}
		//alert(rows[0].name+" "+rows[0].specialization)
	};
	async function delete_doctor(rowId: string) {
		if (user) {
			const ref = doc(db, "Clinic Record", user.email);
			const data = (await getDoc(ref)).data() as ClinicUserObject;
			const doctors = data.doctors;
			await setDoc(ref, {
				...data,
				doctors: doctors.filter((doctor) => doctor.id !== rowId),
			});
			getDoctors();
		}
	}
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	async function addDoctor(
		nameRef: React.RefObject<HTMLInputElement>,
		designationRef: React.RefObject<HTMLInputElement>
	) {
		const name = nameRef.current?.value || "";
		const specialization = designationRef.current?.value || "";
		if (user) {
			const ref = doc(db, "Clinic Record", user.email);
			const data = (await getDoc(ref)).data() as ClinicUserObject;
			const newDoctor: DoctorDetails = {
				name,
				specialization,
				id: faker.datatype.uuid(),
			};
			data.doctors.push(newDoctor);

			await setDoc(ref, data);
		}
		getDoctors();
		setOpen(false);
	}
	const handleClose_cancel = () => {
		setOpen(false);
	};
	useEffect(() => {
		getDoctors();
	}, []);

	return (
		<Paper sx={{ width: "100%" }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table" ref={tableRef}>
					<TableHead>
						<TableRow>
							<TableCell align="center" colSpan={3}>
								Doctor Details
							</TableCell>
						</TableRow>
						<TableRow>
							{columns.map((column) => {
								return (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								);
							})}
							<TableCell
								key={"action"}
								align="center"
								style={{ minWidth: 200 }}
							>
								"Action"
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows &&
							rows
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => {
									const isHidden = hiddenRows.includes(index);
									if (isHidden) {
										return null;
									}
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.specialization}
										>
											<TableCell
												key={columns[0].id}
												align={columns[0].align}
											>
												{row[columns[0].id]}
											</TableCell>
											<TableCell
												key={columns[1].id}
												align={columns[1].align}
											>
												{row[columns[1].id]}
											</TableCell>
											<TableCell
												key={"action"}
												align={"center"}
											>
												<Button
													startIcon={
														<HighlightOffRoundedIcon />
													}
													color="error"
													onClick={() =>
														delete_doctor(row.id)
													}
												>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingBottom: "5vh",
				}}
			>
				<Button variant="contained" onClick={handleClickOpen}>
					Add Doctor
				</Button>
				<Dialog open={open}>
					<DialogTitle>Add Doctor</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							label="Name"
							id="docName"
							fullWidth
							inputRef={nameRef}
						/>
						<TextField
							margin="dense"
							label="Specialization"
							id="docDesignation"
							fullWidth
							inputRef={designationRef}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose_cancel}>Cancel</Button>
						{/*<Button onClick={getDoctors} variant="contained">Save</Button>*/}
						<Button
							onClick={() => addDoctor(nameRef, designationRef)}
							variant="contained"
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Paper>
	);
}
export default ColumnGroupingTable;
