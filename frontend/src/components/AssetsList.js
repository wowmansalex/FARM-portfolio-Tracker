import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
	fetch24hprice,
	fetchCurrentPrice,
} from '../features/portfolio/portfolioSlice';

import { Link } from 'react-router-dom';

import { Table } from 'reactstrap';

import Loading from '../components/Loading';

const AssetList = () => {
	const dispatch = useDispatch();
	const assets = useSelector(state => state.portfolio.assets.assets);
	const isLoading = useSelector(state => state.portfolio.isLoading);

	useEffect(() => {
		assets.map(asset => {
			dispatch(fetchCurrentPrice(asset.symbol));
			dispatch(fetch24hprice(asset.symbol.toLowerCase()));
		});
	}, []);

	return (
		<div>
			<Table className='assets'>
				<thead>
					<tr>
						<th></th>
						<th>Coin</th>
						<th>Current Price</th>
						<th>24h Change</th>
						<th>Amount</th>
						<th>Value</th>
						<th>Average Price</th>
						<th>Win/Loss</th>
						<th>Actions</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<Loading />
					) : (
						assets &&
						assets.map((asset, index) => {
							return (
								<tr key={index}>
									<td>
										{
											<img
												className='coin-image'
												src={asset.image}
												alt=''
											/>
										}
									</td>
									<td>{asset.coin}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.current_price)}
									</td>
									<td
										className={
											Math.sign(asset.price_24h) === -1
												? 'negative'
												: 'positive'
										}>
										{new Intl.NumberFormat('en-GB', {
											style: 'percent',
											minimumFractionDigits: 1,
											maximumFractionDigits: 2,
										}).format(asset.price_24h)}
									</td>
									<td>{asset.amount}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.current_price * asset.amount)}
									</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.average_price)}
									</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(
											asset.current_price * asset.amount -
												asset.average_price * asset.amount
										)}
									</td>
									<td>
										<Link
											className='link'
											to={`/transactions/${asset.coin}`}
											asset={asset.coin}>
											Transactions
										</Link>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</Table>
		</div>
	);
};

export default AssetList;
