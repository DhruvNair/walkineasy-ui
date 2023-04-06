import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

export interface AuthState {
	loggedIn: boolean;
	userType: "client" | "clinic";
	user?: UserObject | ClinicUserObject;
}

export interface UserObject {
	id?: string;
	name: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	province: string;
}

export interface ClinicUserObject extends UserObject {
	id: string;
	standardEquipment: string[];
	clinicalEquipment: string[];
	diagnosticEquipment: string[];
	laboratoryEquipment: string[];
	doctors: DoctorDetails[];
}

export interface DoctorDetails {
	id: string;
	name: string;
	specialization: string;
}

export interface DoctorLiveDetails extends DoctorDetails {
	available: boolean;
}

export type ETA = 5 | 10 | 15;

export interface Request {
	from: string;
	eta: ETA;
}

export interface RTDBObject {
	rush: number;
	requests: Request[];
	doctors: DoctorLiveDetails[];
}

const initialState: AuthState = {
	loggedIn: false,
	userType: "client",
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (
			state,
			action: PayloadAction<{
				userType: "client" | "clinic";
				user: UserObject | ClinicUserObject;
			}>
		) => {
			state.loggedIn = true;
			state.userType = action.payload.userType;
			state.user = action.payload.user;
			secureLocalStorage.setItem(
				"email",
				action.payload.user?.email || "error"
			);
			secureLocalStorage.setItem(
				"userType",
				action.payload.userType || "error"
			);
		},
		logout: (state) => {
			state.loggedIn = false;
			state.userType = initialState.userType;
			state.user = undefined;
			secureLocalStorage.removeItem("email");
			secureLocalStorage.removeItem("userType");
		},
		setUserObject: (
			state,
			action: PayloadAction<UserObject | ClinicUserObject>
		) => {
			state.user = action.payload;
		},
	},
});

export const { login, logout, setUserObject } = authSlice.actions;

export default authSlice.reducer;
