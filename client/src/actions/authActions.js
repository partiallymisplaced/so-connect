import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

// Registers user
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }) 
        );

}

// Logs user in

export const loginUser = (userData) => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // Save data to local storage
            const { token } = res.data;
            // Sets token to local storage
            localStorage.setItem('jwtToken', token);
            // Sets token to auth header
            setAuthToken(token);
            // Decodes token to get user data
            const decodedToken = jwt_decode(token);
            // Dispatch current user
            dispatch(setCurrentUser(decodedToken));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );

}

export const setCurrentUser = decodedToken => {
    return {
        type: SET_CURRENT_USER,
        payload: decodedToken
    }
}