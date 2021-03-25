import { GET_VIEWS } from "../types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case GET_VIEWS:
      return {
        ...state,
        views: payload && payload.length > 0 ? payload.map((e) => e.ruta) : [],
      };
    default:
      return state;
  }
};