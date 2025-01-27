import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  isLoggedIn: false, // Add isLoggedIn for authentication status
  user: null, // Add user data
}

// Action Types
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

// Reducer
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: rest.user,
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state
  }
}

// Create the store
const store = createStore(changeState)

export default store
// store.js

export const login = (user) => ({ type: LOGIN, user })
export const logout = () => ({ type: LOGOUT })
