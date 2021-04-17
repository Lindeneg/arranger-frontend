import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ListState } from './types';
import {
	initLists,
	createListStart,
	updateListStart,
	deleteListStart,
	createListError,
	updateListError,
	deleteListError,
	clearAnyListError,
	createListSuccess,
	deleteListSuccess,
	updateListSuccess
} from './actions';
import { ResponseError } from '../../common/types';

const initialState: ListState = {
	lists: [],
	requested: false,
	requesting: false,
	error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<ListState>) => {
	builder.addCase(initLists, (state, action) => {
		return {
			...state,
			lists: action.payload
		};
	});
	builder.addCase(createListSuccess, (state, action) => {
		return {
			...state,
			lists: [...state.lists, action.payload],
			requested: true,
			requesting: false
		};
	});
	builder.addCase(updateListStart, (state, action) => {
		const newLists = [...state.lists];
		const targetIdx = state.lists.findIndex((list) => list._id === action.payload._id);
		if (targetIdx > -1) {
			newLists[targetIdx] = {
				...newLists[targetIdx],
				name: action.payload.name
			};
		}
		return {
			...state,
			lists: newLists,
			requested: false,
			requesting: true,
			error: null
		};
	});
	builder.addCase(clearAnyListError, (state) => {
		return {
			...state,
			error: null
		};
	});
	builder.addCase(deleteListStart, (state, action) => {
		return {
			...state,
			lists: state.lists.filter((list) => list._id !== action.payload._id),
			requesting: true,
			requested: false,
			error: null
		};
	});
	builder.addCase(createListStart, (state) => {
		return {
			...state,
			requesting: true,
			requested: false,
			error: null
		};
	});
	builder.addMatcher(
		(ac) => [deleteListSuccess.type, updateListSuccess.type].includes(ac.type),
		(state) => {
			return {
				...state,
				requesting: false,
				requested: true
			};
		}
	);
	builder.addMatcher<PayloadAction<ResponseError>>(
		(ac) =>
			[createListError.type, updateListError.type, deleteListError.type].includes(ac.type),
		(state, action) => {
			return {
				...state,
				requested: true,
				requesting: false,
				error: action.payload.message
			};
		}
	);
});
