import { useReducer, useEffect } from 'react';
import axios from 'axios';

// acts as a proxy for us so we don't need to create our own proxy server, get around CORS policy
const BASE_URL = '/positions.json';

const initialState = {
  jobs: [],
  loading: false,
};

const ACTIONS = {
  MAKE_REQUEST: 'make_request',
  GET_DATA: 'get_data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update_has_next_page',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return {
        ...state,
        loading: true,
        jobs: [],
        error: '',
      };
    case ACTIONS.GET_DATA:
      return {
        ...state,
        loading: false,
        jobs: action.payload.jobs,
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return {
        ...state,
        hasNextPage: action.payload.hasNextPage,
      };
    default:
      return state;
  }
}

function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    const cancelToken1 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken1.token,
        params: {
          ...params,
          page: page,
          markdown: true,
        },
      })
      .then((res) =>
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
      )
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    // hasNextPage(T or F): do another axios request for the next page and see if there are any results
    const cancelToken2 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: {
          ...params,
          page: page + 1,
          markdown: true,
        },
      })
      .then((res) =>
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: { hasNextPage: res.data.length !== 0 },
        })
      )
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    // whenever type in a new character, cancel the old request
    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}

export default useFetchJobs;
