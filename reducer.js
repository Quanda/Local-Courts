import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    UPDATE_EVENTS,
    UPDATE_EVENTS_REQUEST,
    UPDATE_FRIENDS
} from './actions';

const initialState = {
    currentUser: null,
    events: null,
    friends: null,
    loggedIn: false,
    loading: false,
    error: null
};

export default reducer = (state = initialState, action)  => {
    if (action.type === LOGIN_REQUEST) {
        return Object.assign({}, state, {
            error: null
        });
    } else if (action.type === LOGIN_SUCCESS) {
        return Object.assign({}, state, {
            currentUser: action.user,
            loggedIn: true,
            error: null
        });
    } else if (action.type === LOGIN_ERROR) {
        return Object.assign({}, state, {
            error: action.error.message
        });
    } else if (action.type === LOGOUT) {
        return Object.assign({}, state, {
            currentUser: null,
            events: null,
            loggedIn: false
        });
    } else if (action.type === UPDATE_EVENTS_REQUEST) {
        return Object.assign({}, state, {
            loading: true
        });   
    } else if (action.type === UPDATE_EVENTS) {
         switch(action.category) {
                case 'user':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            user: action.events
                        }
                    });
                    break;
                case 'friends':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            friends: action.events
                        }
                    });
                    break;
                case 'all':
                    return Object.assign({}, state, {
                        events: {
                            ...state.events,
                            all: [...state.events.user, ...state.events.friends]
                        }
                    });
                    break;
         }
    } else if (action.type === UPDATE_FRIENDS) {
        return Object.assign({}, state, {
            friends: action.friends
        })
    }
    return state;
}
