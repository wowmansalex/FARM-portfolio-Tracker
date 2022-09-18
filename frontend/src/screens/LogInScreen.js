import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { loginUser, clearState } from '../features/auth/authSlice';

import toast from 'react-hot-toast';

const Login = () => {
	const dispatch = useDispatch();
	const { isFetching, isSuccess, isError, errorMessage } = useSelector(
		state => state.auth
	);
	const { register, handleSubmit } = useForm();

	const navigate = useNavigate();

	const submitForm = data => {
		dispatch(loginUser(data));
	};

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
			<form onSubmit={handleSubmit(submitForm)}>
				<div className='form-group my-2'>
					<label htmlFor='email'>Email</label>
					<input
						type='text'
						name='username'
						className='form-control'
						{...register('username')}
						required
					/>
				</div>
				<div className='form-group my-2'>
					<label htmlFor='password'>Password</label>
					<input
						name='password'
						type='password'
						className='form-control'
						{...register('password')}
						required
					/>
				</div>
				<button
					type='submit'
					className='btn-light'>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
