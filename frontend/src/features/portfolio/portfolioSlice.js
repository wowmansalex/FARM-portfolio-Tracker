import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../constants/api';
import axios from 'axios';

import {
	PORTFOLIO,
	ASSET,
	TRANSACTION,
	LOG_DATA,
} from '../../constants/endpoints';

const token = localStorage.getItem('access token');

const config = {
	headers: {
		Authorization: `Bearer ${token}`,
	},
};

export const fetchPortfolio = createAsyncThunk(
	'portfolio/fetchPortfolio',
	async (_, { getState, rejectWithValue }) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const response = await api.get(PORTFOLIO + 'list', config);

			// localStorage.setItem('portfolio name', response.data.name);

			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				console.log(error.message);
				return rejectWithValue(error.response.data.message);
			} else {
				console.log('source: fetchPortfolio:' + error.message);
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchAssets = createAsyncThunk(
	'assets/fetchAssets',
	async (arg, { getState, rejectWithValue }) => {
		try {
			const response = await api.get(ASSET + 'list', config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchTransactions = createAsyncThunk(
	'transactions/fetchTransactions',
	async (_, { getState, rejectWithValue }) => {
		try {
			const response = await api.get(TRANSACTION + 'list', config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchTransactionByAsset = createAsyncThunk(
	'transactions/fetchTransactiopnsByAsset',
	async (coin, { rejectWithValue }) => {
		try {
			const response = await api.get(TRANSACTION + 'list/' + `${coin}`, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const createNewTransaction = createAsyncThunk(
	'transactions/createNewTransaction',
	async (data, { getState, rejectWithValue }) => {
		try {
			const response = await api.post(TRANSACTION + 'create', data, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const createNewPortfolio = createAsyncThunk(
	'portfolio/createNewPortfolio',
	async (data, { getState, rejectWithValue }) => {
		try {
			const config_portfolio = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const params = {
				name: data.name,
				balance: data.balance,
			};
			const response = await api.post(PORTFOLIO + 'create', params, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const createNewAsset = createAsyncThunk(
	'asset/createNewAsset',
	async (data, thunkAPI) => {
		try {
			const response = await api.post(ASSET + 'create', data, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return thunkAPI.rejectWithValue(error.response.data.message);
			} else {
				return thunkAPI.rejectWithValue(error.message);
			}
		}
	}
);

export const deleteTransaction = createAsyncThunk(
	'transaction/deleteTransaction',
	async (transaction_id, { rejectWithValue }) => {
		try {
			const response = await api.delete(TRANSACTION + `${transaction_id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchLogData = createAsyncThunk(
	'logData/getLogData',
	async (_, { getState, rejectWithValue }) => {
		try {
			const response = await api.get(LOG_DATA + 'current_balance', config);

			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchCoins = createAsyncThunk('logData/fetchCoins', async () => {
	const response = await axios.get(
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
	);

	let coin_data = [];

	for (let i = 0; i < response.data.length; i++) {
		coin_data.push(response.data[i]);
	}

	console.log(coin_data);

	localStorage.setItem('coins', JSON.stringify(coin_data));
	return response.data;
});

export const fetch24hprice = createAsyncThunk(
	'logData/fetch24hprice',
	async (coin, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`http://localhost:8010/proxy/coins/${coin}/ohlc?vs_currency=usd&days=1`
			);
			let yesterday =
				Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 10000) *
				10000;

			let prices = await response.data;

			const prices_24h = await prices.filter(
				price => (price[0] - yesterday) / 10000 <= 100
			);
			console.log(prices_24h[0][1]);
			const result = await prices_24h[0][1];

			// localStorage.setItem('prices24h', JSON.stringify({ coin, price_24h }));
			const prices24h = { coin: coin, price: result };
			return prices24h;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchCurrentPrice = createAsyncThunk(
	'asset/fetchCurrentPrice',
	async (input, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`http://localhost:8010/proxy/simple/price?ids=${input.toLowerCase()}&vs_currencies=usd`
			);

			let price = [
				input.toLowerCase(),
				response.data[input.toLowerCase()]['usd'],
			];
			console.log(price);
			return price;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const updateCurrentBalance = createAsyncThunk(
	'logdata/updateCurrentBalance',
	async (_, thunkAPI) => {
		try {
			const current_balance = {
				current_balance: JSON.parse(localStorage.getItem('current_balance')),
			};
			const response = await api.post(
				LOG_DATA + 'current_balance',
				current_balance,
				config
			);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return thunkAPI.rejectWithValue(error.response.data.message);
			} else {
				return thunkAPI.rejectWithValue(error.message);
			}
		}
	}
);

const initialState = {
	id: null,
	portfolio_name: '',
	assets: {
		price_24hchanges: [],
		assets: [],
		assets_length: null,
	},
	transactions: {
		transactions: [],
		transactions_length: null,
	},
	balance: 0,
	logData: {
		coin_names: '',
		current_balance: [],
		timestamp: [],
	},
	isLoading: false,
	error: '',
	message: '',
	success: false,
	deleted: false,
};

const portfolioSlice = createSlice({
	name: 'portfolio',
	initialState,
	reducers: {
		portfolioReset: state => {
			state.id = null;
			state.portfolio_name = '';
			state.transactions = [];
			state.assets.assets = [];
			state.assets.price_24hchanges = [];
			state.balance = 0;
		},
	},
	extraReducers: {
		[fetchPortfolio.pending]: state => {
			console.log('fetch portfolio pending');
			state.isLoading = true;
		},
		[fetchPortfolio.fulfilled]: (state, { payload }) => {
			console.log('fetch portfolio fulfilled');
			state.isLoading = false;
			state.portfolio_name = payload.name;
			state.id = payload.id;
		},
		[fetchPortfolio.rejected]: (state, { payload }) => {
			console.log('fetch portfolio rejected');
			state.isLoading = false;
			state.portfolio_name = null;
			state.id = null;
			state.error = payload;
		},
		[fetchAssets.pending]: state => {
			console.log('fetch assets pending');
			state.isLoading = true;
		},
		[fetchAssets.fulfilled]: (state, { payload }) => {
			console.log('fetch assets fulfilled');
			state.isLoading = false;
			state.assets.assets = payload;
		},
		[fetchAssets.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('Error:' + payload + 'fetch assets rejected');
		},
		[fetchTransactions.pending]: () => {
			console.log('fetching transaction pending');
		},
		[fetchTransactions.fulfilled]: (state, { payload }) => {
			console.log('fetch transaction fulfilled');
			state.transactions.transactions = payload;
		},
		[fetchTransactions.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('fetch transaction rejected');
		},
		[updateCurrentBalance.pending]: state => {
			state.isLoading = true;
		},
		[updateCurrentBalance.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.success = true;
			console.log('current balance updated', payload);
		},
		[updateCurrentBalance.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('error at update current balance', payload);
			state.isLoading = false;
		},
		[createNewTransaction.pending]: () => {
			console.log('creating transaction pending');
		},
		[createNewTransaction.fulfilled]: (state, { payload }) => {
			console.log(payload, 'creating transaction fulfilled');
			state.transactions.push(payload);
			state.deleted = false;
		},
		[createNewTransaction.rejected]: () => {
			console.log('creating transaction rejected');
		},
		[createNewPortfolio.pending]: state => {
			state.isLoading = true;
			console.log('creating portfolio pending');
		},
		[createNewPortfolio.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.portfolio_name = payload.name;
			state.balance = payload.balance;
			console.log('creating portfolio pending');
		},
		[createNewPortfolio.pending]: (state, { payload }) => {
			state.error = payload;
			console.log('creating portfolio pending');
		},
		[createNewAsset.pending]: state => {
			state.isLoading = true;
		},
		[createNewAsset.fulfilled]: state => {
			state.isLoading = false;
			state.success = true;
			state.message = 'Asset successful created';
		},
		[createNewAsset.fulfilled]: (state, { payload }) => {
			state.error = payload;
			state.success = false;
		},
		[deleteTransaction.pending]: () => {
			console.log('delete transaction pending');
		},
		[deleteTransaction.fulfilled]: (state, { payload }) => {
			state.deleted = true;
			console.log('delete transaction fulfilled');
		},
		[deleteTransaction.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('delete transaction rejected');
		},
		[fetchTransactionByAsset.pending]: () => {
			console.log('fetching transaction by asset pending');
		},
		[fetchTransactionByAsset.fulfilled]: (state, { payload }) => {
			console.log('fetch transaction by asset fulfilled');
			state.transactions.transactions = payload;
		},
		[fetchTransactionByAsset.rejected]: () => {
			console.log('fetch transaction by asset rejected');
		},
		[fetchLogData.pending]: state => {
			state.isLoading = true;
			console.log('fetch log data pending');
		},
		[fetchLogData.fulfilled]: (state, { payload }) => {
			state.logData.current_balance = payload.map(item => {
				return item['current_balance'];
			});
			state.logData.timestamp = payload.map(item => {
				return new Date(item['created_at']).toLocaleTimeString('en', {
					timeStyle: 'short',
					hour12: false,
					timeZone: 'UTC',
				});
			});
			console.log('fetch log data fulfilled');
		},
		[fetchLogData.rejected]: state => {
			state.isLoading = false;
			console.log('fetch log data fulfilled');
		},
		[fetchCoins.pending]: state => {
			state.isLoading = true;
			console.log('fetching coin data pending');
		},
		[fetchCoins.fulfilled]: (state, { payload }) => {
			console.log('fetching coin data fulfilled');
		},
		[fetchCoins.rejected]: state => {
			state.isLoading = false;
			console.log('fetch coins rejected');
		},
		[fetch24hprice.pending]: state => {
			// state.isLoading = true;
			console.log('fetch 24h price pending');
		},
		[fetch24hprice.fulfilled]: (state, { payload }) => {
			console.log('fetch 24h price fulfilled');
			state.assets.assets.map(asset => {
				if (asset.symbol.toLowerCase() == payload['coin']) {
					asset.price_24h =
						(asset.current_price - payload['price']) / asset.current_price;
				}
			});
		},
		[fetch24hprice.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log(payload, 'fetch 24h price rejected');
		},
		[fetchCurrentPrice.pending]: state => {
			state.isLoading = true;
		},
		[fetchCurrentPrice.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.assets.assets.map(asset => {
				if (asset.symbol.toLowerCase() == payload[0]) {
					asset.current_price = payload[1];
				}
			});
			let sum = 0;
			state.assets.assets.map(asset => {
				sum += asset.current_price * asset.amount;
			});
			state.balance = sum;
			localStorage.setItem('current_balance', sum);
		},
		[fetchCurrentPrice.rejected]: (state, { payload }) => {
			state.error = payload;
		},
	},
});

export const { portfolioReset } = portfolioSlice.actions;
export default portfolioSlice.reducer;
