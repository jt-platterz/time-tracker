import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState, AUTH_STATE_NAME } from './auth.state';

export const selectAuthFeature = createFeatureSelector<IAuthState>(AUTH_STATE_NAME);

export const selectAuthToken = createSelector(selectAuthFeature, (state) => state.authToken);
export const selectCurrentUser = createSelector(selectAuthFeature, (state) => state.user);
export const selectLoginError = createSelector(selectAuthFeature, (state) => state.error);
export const selectAuthInitialized = createSelector(selectAuthFeature, (state) => state.initialized);
