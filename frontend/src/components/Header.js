import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	Navbar,
	NavbarBrand,
	NavItem,
	Nav,
	NavbarText,
	NavLink,
} from 'reactstrap';

import { logout, tokenValidation } from '../features/auth/authSlice';

const Header = () => {
	const { isAuthenticated } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logOut = () => {
		dispatch(logout());
		navigate('/login');
	};

	return (
		<Navbar className='header text-center'>
			<NavbarBrand>
				<NavLink
					className='header-title'
					href='/'>
					Portfolio Tracker
				</NavLink>
			</NavbarBrand>
			<Nav>
				{isAuthenticated || localStorage.getItem('access token') ? (
					<Nav>
						<NavItem>
							<button
								className='link-light btn btn-link'
								onClick={() => logOut()}>
								Logout
							</button>
						</NavItem>
					</Nav>
				) : (
					<Nav>
						<NavItem>
							<NavLink
								className='link-light'
								href='/login'>
								Login
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className='link-light'
								href='/register'>
								Register
							</NavLink>
						</NavItem>
					</Nav>
				)}
			</Nav>
		</Navbar>
	);
};

export default Header;
