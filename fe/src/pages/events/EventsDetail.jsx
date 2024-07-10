import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data }
        } = await axios.get(`http://localhost:8080/api/v1/events/${eventId}`);
        setEvent(data);
      } catch (error) {
        console.error(error.message);
      }
    })();
  }, [eventId]);

  const handleAttend = async () => {
    if (isLoggedIn) {
      if (event) {
        const attendees = event.attendees || [];
        if (!attendees.includes(isLoggedIn)) {
          const updatedEvent = {
            ...event,
            attendees: [...attendees, event.attendees]
          };
          setEvent(updatedEvent);

          try {
            await axios.put(
              `http://localhost:8080/api/v1/events/${eventId}`,
              updatedEvent.toString()
            );
          } catch (error) {
            console.error("Error updating attendees", error.message);
          }
        } else {
          console.log("User has already attended this event");
        }
      }
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="my-10">
      <h1 className="text-center font-body text-6xl font-bold">
        {event.title}
      </h1>
      <div className="flex flex-row justify-center">
        <img
          src={event.image?.path}
          alt={event.title}
          className="w-3/6 object-contain object-contain"
        />
      </div>
      <div className="flex flex-row justify-center">
        <p className="text-justify text-2xl font-body font-bold w-3/6">
          {event.description}
        </p>
      </div>
      <div className="flex mb-4">
        <ul className="list-disc pl-5 mt-4 ml-auto w-2/3 text-xl">
          <li>
            Hosted By: {event.userId?.firstName + " " + event.userId?.lastName}
          </li>
          <li>Location: {event.location}</li>
          <li>Category: {event.category}</li>
          {/* <li>Attendess: {event.attendees ? event.attendees : 0}</li> */}
          <li>Date: {event.date}</li>
          <li>Time: {event.time}</li>
          <li>Status: {event.isOpen ? "Free" : "Paid"}</li>
        </ul>
      </div>
      <div className="flex flex-row justify-center gap-10">
        <button
          className="bg-black text-secondary font-bold text-2xl py-2 px-20"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {/* <button
          className="bg-primary text-secondary font-bold text-2xl py-2 px-20"
          onClick={handleAttend}
        >
          Attend
        </button> */}
      </div>
    </div>
  );
};

export default EventDetail;
