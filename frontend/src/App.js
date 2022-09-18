import React, { useEffect } from 'react';

import './App.css';

import PortfolioScreen from './screens/PortfolioScreen';

import LoginScreen from './screens/LogInScreen';

import { useDispatch, useSelector } from 'react-redux';

import { logout } from './features/auth/authSlice';

import { validateToken } from './constants/validateToken';
import { useNavigate } from 'react-router-dom';

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector(state => state.auth);

	useEffect(() => {
		const AuthVerify = () => {
			const token = JSON.stringify(localStorage.getItem('access token'));
			if (token == null) {
				console.log('No token found');
				navigate('/login');
			} else if (token) {
				const checkIfValid = validateToken(token);

				if (!checkIfValid) {
					dispatch(logout());
				} else {
					console.log('Token still valid');
				}
			}
		};

		AuthVerify();
	}, []);

	return (
		<div>
			{isAuthenticated || localStorage.getItem('access token') ? (
				<PortfolioScreen className='general' />
			) : (
				<LoginScreen />
			)}
		</div>
	);
}

export default App;
