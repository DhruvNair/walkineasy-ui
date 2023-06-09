import PropTypes from "prop-types";
// @mui
import {
	AppBar,
	Box,
	Button,
	ButtonProps,
	IconButton,
	Stack,
	Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
// utils
// components
import Iconify from "../../../components/iconify";
import palette from "../../../theme/palette";
import { logout } from "../../../slices/authSlice";
import { useAppDispatch } from "../../../store";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
	boxShadow: "none",
	[theme.breakpoints.up("lg")]: {
		width: `calc(100% - ${NAV_WIDTH + 1}px)`,
	},
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	minHeight: HEADER_MOBILE,
	[theme.breakpoints.up("lg")]: {
		minHeight: HEADER_DESKTOP,
		padding: theme.spacing(0, 5),
	},
}));

// ----------------------------------------------------------------------

Header.propTypes = {
	onOpenNav: PropTypes.func,
};

const WhiteButton = styled(Button)<ButtonProps>(({ theme }) => ({
	color: theme.palette.primary.main,
	backgroundColor: blue[50],
	"&:hover": {
		backgroundColor: blue[100],
	},
}));

export default function Header({ onOpenNav }: { onOpenNav: () => void }) {
	const dispatch = useAppDispatch();
	return (
		<StyledRoot>
			<StyledToolbar>
				<IconButton
					onClick={onOpenNav}
					sx={{
						mr: 1,
						color: "text.primary",
						display: { lg: "none" },
					}}
				>
					<Iconify icon="eva:menu-2-fill" sx={{ color: "white" }} />
				</IconButton>

				<Box sx={{ flexGrow: 1 }} />
				<WhiteButton onClick={() => dispatch(logout())}>
					Logout
				</WhiteButton>
			</StyledToolbar>
		</StyledRoot>
	);
}
