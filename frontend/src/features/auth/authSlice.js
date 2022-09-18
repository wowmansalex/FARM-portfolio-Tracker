import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../constants/api';
import jwt_decode from 'jwt-decode';

import { REGISTER, LOGIN } from '../../constants/endpoints';

const access_token = localStorage.getItem('access token');

// const config = {
// 	headers: {
// 		Authorization: `Bearer ${token}`,
// 	},
// };

export const registerUser = createAsyncThunk(
	'users/signupUser',
	async ({ username, email, password }, thunkAPI) => {
		try {
			let user = {
				username: username,
				email: email,
				password: password,
			};

			console.log(user);

			const response = await api.post(REGISTER, user);

			let data = await response.json();

			console.log(data);

			if (response.status_code === 200) {
				localStorage.setItem('access token', data.access_token);
				return { ...data, username: email, password: password };
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (e) {
			console.log('Error:' + e.response.data);
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);

export const loginUser = createAsyncThunk(
	'users/loginUser',
	async ({ username, password }, thunkAPI) => {
		try {
			const user = new FormData();
			user.append('username', username);
			user.append('password', password);
			const response = await api.post(LOGIN, user);

			if (response.status == 200) {
				localStorage.setItem('access token', response.data.access_token);
				return response.data;
			} else {
				return thunkAPI.rejectWithValue(response.data);
			}
		} catch (e) {
			console.log('Error:' + e.response.data);
			return thunkAPI.rejectWithValue(e.response.data);
		}
	}
);

const initialState = {
	isAuthenticated: false,
	tokenIsValid: false,
	isSuccess: false,
	isError: false,
	isFetching: false,
	user_id: '',
	username: '',
	errorMessage: null,
};

export const authSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		logout: state => {
			localStorage.removeItem('access token');
			state.isFetching = false;
			state.isAuthenticated = false;
			state.user_id = null;
			state.username = null;
			state.errorMessage = null;
		},
		clearState: state => {
			state.isError = false;
			state.isSuccess = false;
			state.isFetching = false;

			return state;
		},
	},
	extraReducers: {
		[registerUser.pending]: state => {
			state.isFetching = true;
		},
		[registerUser.fulfilled]: (state, { payload }) => {
			console.log('payload', payload);
			state.isFetching = false;
			state.isSuccess = true;
			state.user_id = payload;
			state.username = payload;
		},
		[registerUser.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.isError = true;
			state.errorMessage = payload;
		},
		[loginUser.pending]: state => {
			state.isFetching = true;
			state.error = null;
		},
		[loginUser.fulfilled]: (state, { payload }) => {
			state.isFetching = false;
			state.isSuccess = true;
			state.isAuthenticated = true;
		},
		[loginUser.rejected]: (state, { payload }) => {
			state.isFetching = false;
			state.errorMessage = payload;
		},
	},
});

export default authSlice.reducer;
export const { clearState, logout, checkToken } = authSlice.actions;
