import {
    SET_AUTH_TOKEN,
    CLEAR_AUTH,
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_ERROR
} from '../actions/auth';
import {
    USER_GUESS_SUCCESS,
    USER_GUESS_FAIL,
    SET_NEXT_QUESTION
} from '../actions/guess';

const initialState = {
    authToken: null, // authToken !== null does not mean it has been validated
    currentUser: null,
    loading: false,
    error: null,
    message: null,
    answer: null,
    correctCount: 0
};

export default function reducer(state = initialState, action) {
    if (action.type === SET_AUTH_TOKEN) {
        return Object.assign({}, state, {
            authToken: action.authToken
        });
    } else if (action.type === CLEAR_AUTH) {
        return Object.assign({}, state, {
            authToken: null,
            currentUser: null
        });
    } else if (action.type === AUTH_REQUEST) {
        return Object.assign({}, state, {
            loading: true,
            error: null
        });
    } else if (action.type === AUTH_SUCCESS) {
        return Object.assign({}, state, {
            loading: false,
            currentUser: action.currentUser
        });
    } else if (action.type === AUTH_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            error: action.error
        });
    } else if (action.type === USER_GUESS_SUCCESS) {
        return Object.assign({}, state, {
          loading: false,
          message: action.message,
          correctCount: action.correctCount
        });
    } else if (action.type === USER_GUESS_FAIL) {
        return Object.assign({}, state, {
            loading: false,
            message: action.message,
            answer: action.answer
        });
    } else if (action.type === SET_NEXT_QUESTION) {
        return Object.assign({}, state, {
            loading: false,
            message: null,
            answer: null,
            currentUser: Object.assign({}, state.currentUser, {
                head: action.head
            })
        })
    }
    return state;
}
