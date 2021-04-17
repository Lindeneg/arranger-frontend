import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ListState } from './types';
import { initLists } from './actions';
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
});
