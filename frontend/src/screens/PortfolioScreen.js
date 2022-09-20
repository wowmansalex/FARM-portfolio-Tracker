import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	fetchAssets,
	fetchTransactions,
	fetchPortfolio,
	updateCurrentBalance,
	fetchLogData,
} from '../features/portfolio/portfolioSlice';

import NewPortfolioScreen from '../screens/NewPortfolioScreen';

import AssetList from '../components/AssetsList';
import Graph from '../components/Graph';

const PortfolioScreen = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useSelector(state => state.auth);

	const portfolioFetch = [
		fetchAssets(),
		fetchPortfolio(),
		fetchTransactions(),
		updateCurrentBalance(),
		fetchLogData(),
	];

	const fetchAllData = () => {
		portfolioFetch.map(fetch => dispatch(fetch));
	};

	useEffect(() => {
		fetchAllData();
		const timer = setTimeout(() => fetchAllData(), 30000);
		return () => clearTimeout(timer);
	}, [isAuthenticated]);

	const portfolio = useSelector(state => state.portfolio);

	return (
		<div className='assets container'>
			<div>
				<div>
					<h4>Current Balance</h4>
					<div>
						{new Intl.NumberFormat('en-IN', {
							style: 'currency',
							currency: 'USD',
						}).format(portfolio.balance)}
					</div>
				</div>
				<Graph />
				<div className='d-flex justify-content-between'>
					<h4 className=''>Your Assets</h4>
					<a
						className='btn-light'
						href='/add-transaction'>
						Add New
					</a>
				</div>
				<div>
					{portfolio.portfolio_name == '' ? (
						<NewPortfolioScreen />
					) : (
						<AssetList />
					)}
				</div>
			</div>
		</div>
	);
};

export default PortfolioScreen;
