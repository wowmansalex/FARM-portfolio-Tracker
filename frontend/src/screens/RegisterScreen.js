import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { registerUser, clearState } from '../features/auth/authSlice';

import toast from 'react-hot-toast';

const RegisterScreen = () => {
	const { isFetching, isSuccess, isError, errorMessage } = useSelector(
		state => state.auth
	);
	const dispatch = useDispatch();

	const { register, handleSubmit } = useForm();

	const navigate = useNavigate();

	const submitForm = data => {
		dispatch(registerUser(data));
		console.log(data);
		navigate('/login');
	};

	useEffect(() => {
		return () => {
			dispatch(clearState());
		};
	}, []);

	useEffect(() => {
		if (isSuccess) {
			dispatch(clearState());
			navigate('/');
		}

		if (isError) {
			toast.error(errorMessage);
			dispatch(clearState());
		}
	}, [isSuccess, isError]);

	return (
		<div className='login-form mx-auto'>
			<form
				onSubmit={handleSubmit(submitForm)}
				action=''>
				<div className='form-group my-2'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						className='form-control'
						{...register('email')}
						required
					/>
				</div>
				<div className='form-group my-2'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						className='form-control'
						{...register('password')}
						required
					/>
				</div>
				<button
					type='submit'
					className='btn-light'
					disabled={isFetching}>
					Register
				</button>
			</form>
		</div>
	);
};

export default RegisterScreen;
