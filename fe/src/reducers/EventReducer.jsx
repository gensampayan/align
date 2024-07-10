const initialState = {
  events: JSON.parse(localStorage.getItem("events")) || []
    .map(event => ({ ...event, deleted: false }))
};

const EventReducer = (state, action) => {
  switch (action.type) {
    case "EVENT_LIST": 
      return { events: action.payload };
    case "ADD_EVENT":
      return { events: [action.payload, ...state.events] };
    case "EDIT_EVENT": 
      return { events: state.events.map(item => 
        item._id === action.payload._id ? action.payload : item
      )};
    case "DELETE_EVENT":
      return {
        events: state.events.map(event =>
          event._id === action.payload ? { ...event, deleted: true } : event
        )
      };      
    default:
      return state;
  }
};

export { initialState, EventReducer };
