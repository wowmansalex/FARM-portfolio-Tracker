import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	createNewTransaction,
	createNewAsset,
} from '../features/portfolio/portfolioSlice';

import axios from 'axios';

import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const NewTransactionForm = () => {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const coin_names = JSON.parse(localStorage.getItem('coins'));

	const [formInput, setFormInput] = useState({
		transaction_type: '',
		coin: '',
		symbol: '',
		amount: '',
		date_added: '01/01/2022',
		price_bought: '',
		current_price: 0,
	});

	useEffect(() => {
		console.log(formInput.date_added);

		const fetchCurrentPrice = async () => {
			let date = '01/01/2022';

			if (formInput.date_added !== 'Invalid Date') {
				date = new Date(formInput.date_added)
					.toLocaleDateString('en-GB')
					.replace(/\//g, '-');
			}
			let coin_request = '';

			coin_names.map(coin => {
				if (formInput.coin === coin['name']) {
					coin_request = coin['id'];
					formInput.symbol = coin['id'];
				}
			});
			const response = await axios.get(
				`https://api.coingecko.com/api/v3/coins/${coin_request}/history?date=${date}`
			);

			setFormInput({
				...formInput,
				price_bought: response.data.market_data.current_price.usd.toFixed(2),
			});
			return response.data;
		};

		fetchCurrentPrice();
	}, [formInput.date_added]);

	const get_symbol_image = input => {
		coin_names.map(item => {
			if (item['name'] == formInput.coin) {
				formInput.symbol = item['id'];
				formInput.image = item['image'];
			}
		});
	};

	const handleChange = event => {
		if (event.target.id === 'select') {
			// console.log(event.target.options[event.target.selectedIndex].text);
			setFormInput(current => {
				return {
					...current,
					coin: event.target.options[event.target.selectedIndex].text,
				};
			});
		} else {
			setFormInput({
				...formInput,
				[event.target.name]: event.target.value,
			});
		}
	};

	const handleSubmit = event => {
		// prevents the submit button from refreshing the page
		event.preventDefault();

		get_symbol_image(formInput);
		formInput.date_added = Date.parse(formInput.date_added);
		console.log(formInput);
		dispatch(createNewAsset(formInput));
		dispatch(createNewTransaction(formInput));
		navigate('/');
	};

	return (
		<div className='container-md mx-auto row justify-content-center '>
			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<label htmlFor='select'>Select a coin</label>
					<select
						id='select'
						onChangeCapture={handleChange}>
						{coin_names &&
							coin_names.map((coin, index) => {
								return (
									<option
										key={index}
										index={index}
										name='name'
										value={formInput.coin}>
										{coin['name']}
									</option>
								);
							})}
					</select>
				</FormGroup>
				<FormGroup>
					<Label for='transaction_type'>Buy or Sell:</Label>
					<Input
						type='text'
						name='transaction_type'
						value={formInput.transaction_type}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='amount'>Amount:</Label>
					<Input
						type='number'
						name='amount'
						value={formInput.amount}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='date'>Date:</Label>
					<Input
						type='text'
						name='date_added'
						value={formInput.date_added}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='price'>Price:</Label>
					<Input
						type='text'
						name='price_bought'
						value={formInput.price_bought}
						onChange={handleChange}
					/>
				</FormGroup>
				<Button>Add Transaction</Button>
			</Form>
		</div>
	);
};

export default NewTransactionForm;
