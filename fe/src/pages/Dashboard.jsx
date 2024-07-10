import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
import axios from "axios";
import { EventReducer, initialState } from "../reducers/EventReducer";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [state, dispatch] = useReducer(EventReducer, initialState);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/events");
        const events = response.data.data.filter(event => !event.deleted);
  
        localStorage.setItem("events", JSON.stringify(events));
        dispatch({ type: "EVENT_LIST", payload: events });
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
  
    fetchEvents();
  }, []);  

  const handleEvent = () => {
    if (state.events.length > 0) {
      const mappedEvents = state.events.map((attr) => ({
        id: attr._id,
        image: {
          path: attr.image?.path,
          filename: attr.image?.filename
        },
        title: attr.title,
        date: attr.date,
        time: attr.time,
        location: attr.location,
        isOpen: attr.isOpen
      }));

      setEvents(mappedEvents);
    }
  };

  useEffect(() => {
    handleEvent();
  }, []);

  return (
    <div>
      <div className="ml-10 mt-10">
        <p className="text-4xl">
          Bringing Communities Together, One Event at a Time
        </p>
      </div>
      <div className="mt-5 ml-10 w-3/5">
        <p className="text-xl">
          Fostering community connections by providing intuitive tools for
          organizing, promoting, and managing social, educational, and
          recreational events.
        </p>
      </div>
      <div className="mt-16 ml-20">
        <p className="text-4xl">Events</p>
      </div>
      <section className="flex flex-wrap gap-5 my-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-solid border-gray-300 p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg shadow-lg flex mx-auto"
          >
            <Link to={`/events/${event.id}`}>
              <img
                className="object-contain w-full h-40"
                src={event.image.path}
                alt={event.image.filename}
              />
              <div className="mt-2 text-lg font-semibold">{event.title}</div>
              <div className="flex items-center mt-2">
                <FaCalendar className="text-lg" />
                <span className="ml-1">{`${event.date} • ${event.time} PHT`}</span>
              </div>
              <div className="flex items-center mt-2">
                <FaLocationDot className="text-lg" />
                <span className="ml-1">{event.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <FaTicketAlt className="text-lg" />
                <span className="ml-1">{event.isOpen ? "Free" : "Paid"}</span>
              </div>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
