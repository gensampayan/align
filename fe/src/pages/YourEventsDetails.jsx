import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const YourEventsDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data }
        } = await axios.get(`http://localhost:8080/api/v1/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error(error.message);
      }
    })();
  }, []);

  return (
    <div className="my-10">
      <h1 className="text-center font-body text-6xl font-bold">
        {event.title}
      </h1>
      <div className="flex flex-row justify-center font-body ">
        <img
          src={event.image?.path}
          alt={event.title}
          className="w-3/6 object-contain"
        />
      </div>
      <div className="flex flex-row justify-center font-body">
        <p className="text-justify text-2xl font-body font-bold w-3/6">
          {event.description}
        </p>
      </div>
      <div className="flex mb-4 font-body">
        <ul className="list-disc pl-5 mt-4 ml-auto w-2/3 text-xl">
          <li>
            Hosted By: {event.userId?.firstName + " " + event.userId?.lastName}
          </li>
          <li>Location: {event.location}</li>
          <li>Category: {event.category}</li>
          {/* <li>Attendess: {event.attendees}</li> */}
          <li>Date: {event.date}</li>
          <li>Time: {event.time}</li>
        </ul>
      </div>
      <div className="flex flex-row justify-center gap-10">
        <button 
          className="signup-button bg-black text-secondary font-bold text-2xl py-2 px-20" 
          onClick={() => navigate(`/your-events/`)}>
          Back
        </button>
        <button
          className="signup-button"
          onClick={() => navigate(`/your-events/${id}/edit`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default YourEventsDetails;
