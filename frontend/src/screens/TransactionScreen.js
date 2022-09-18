import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import { fetchAssets } from '../features/portfolio/portfolioSlice';
import { fetchTransactionByAsset } from '../features/portfolio/portfolioSlice';

import { Table } from 'reactstrap';

import { MdDelete, MdEdit } from 'react-icons/md';

import DeleteConfirmation from '../components/DeleteConfirmation';

const TransactionList = () => {
	const dispatch = useDispatch();
	const transactions = useSelector(state => state.portfolio.transactions);
	let asset = useParams();

	const [displayConfirmationModal, setDisplayConfirmationModal] =
		useState(false);

	const showDeleteModal = () => {
		setDisplayConfirmationModal(true);
	};

	const hideDeleteModal = () => {
		setDisplayConfirmationModal(false);
	};

	useEffect(() => {
		console.log(asset.asset);
		dispatch(fetchTransactionByAsset(asset.asset));
	}, []);

	return (
		<div>
			<Table>
				<thead>
					<tr>
						<th></th>
						<th>Coin</th>
						<th>Date</th>
						<th>Price</th>
						<th>Amount</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{transactions &&
						transactions.map((transaction, index) => {
							return (
								<tr key={index}>
									<td>
										<img
											className='coin-image'
											src={transaction.image}
										/>
									</td>
									<td>{transaction.coin}</td>
									<td>{transaction.date_added.substring(0, 10)}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(transaction.current_price)}
									</td>
									<td>{transaction.amount}</td>
									<td>
										<div>
											<button onClick={showDeleteModal}>
												<MdDelete
													id='delete'
													className='mx-1'
												/>
											</button>
											<button>
												<MdEdit
													id='edit'
													className='mx-1'
												/>
											</button>
										</div>
										<DeleteConfirmation
											showModal={displayConfirmationModal}
											hideModal={hideDeleteModal}
											id={transaction.id}
										/>
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</div>
	);
};

export default TransactionList;
