import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { EventReducer, initialState } from "../reducers/EventReducer";

const YourEvents = () => {
  const [state, dispatch] = useReducer(EventReducer, initialState);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("True");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/events");
        const events = response.data.data.filter(event => !event.deleted);
  
        localStorage.setItem("events", JSON.stringify(events));
        dispatch({ type: "EVENT_LIST", payload: events });
        setFilteredEvents(events);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
  
    fetchEvents();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const formattedDate = new Date(date)
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
      })
      .replace(/\//g, "-");

    const filtered = state.events.filter((event) => {
      const eventDate = new Date(event.date)
        .toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric"
        })
        .replace(/\//g, "-");

      return eventDate === formattedDate;
    });

    setFilteredEvents(filtered);
  };

  const openAddModal = () => {
    setIsAdding(true);
  };

  const closeAddModal = () => {
    setIsAdding(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event-image", selectedFile);
    formData.append("location", location);
    formData.append("isOpen", status === "True");
    formData.append("category", category);
    formData.append("date", date);
    formData.append("time", time);

    const userString = localStorage.getItem("user");
    const userData = JSON.parse(userString);
    const token = userData.accessToken;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      dispatch({ type: "ADD_EVENT", payload: response.data.event });
      setFilteredEvents((prevEvents) => [...prevEvents, response.data.event]);
      closeAddModal();
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/events/${eventId}`);
      console.log(response);
  
      // Update state and filteredEvents after successful deletion
      dispatch({ type: "DELETE_EVENT", payload: eventId });
      setFilteredEvents(filteredEvents.filter(event => event._id !== eventId));
  
      // Update localStorage with filtered events excluding the deleted one
      const updatedEvents = state.events.filter(event => event._id !== eventId);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };  

  return (
    <div className="flex mt-5">
      <div className="w-2/4">
        <section>
          <Calendar
            className="w-fit h-fit"
            onChange={handleDateChange}
            value={selectedDate}
          />
        </section>
      </div>
      <div className="bg-white w-2/4">
        <div className="flex justify-between items-center m-5">
          <h1 className="text-3xl font-bold">Your Events</h1>
          <button
            className="bg-customOrange font-bold p-3 w-40 text-white"
            onClick={openAddModal}
          >
            Add
          </button>
        </div>
        <section className="flex flex-col flex-wrap mb-5">
          {filteredEvents.map((event) => {
            if (!event || event.deleted) {
              return null; 
            }
            return (
              <div
              key={event._id}
              className="border border-solid border-gray-300 p-3 w-full sm:w-1/2 md:w-1/3 lg:w-3/4 mx-auto m-2 rounded-lg shadow-lg"
            >
              <Link to={`/your-events/${event._id}`}>
                <img
                  className="object-contain w-full h-40"
                  src={event.image?.path}
                  alt={event.image?.filename}
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
              <div className="flex m-2 gap-10">
                <button 
                  className="font-bold text-red-600"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            );
          })}
        </section>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <form className="flex flex-col gap-2 flex-wrap bg-white p-6 rounded-lg shadow-lg w-2/4">
            <h2 className="text-center text-3xl font-bold mb-4">Add New Event</h2>

            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="border border-solid border-gray-500 h-10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="border border-solid border-gray-500 h-10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input type="file" id="file-upload" onChange={handleFileChange} />

            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="border border-solid border-gray-500 h-10"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label>Select Status</label>
            <div className="flex gap-5 items-center">
              <input
                type="radio"
                id="free"
                name="status"
                value="True"
                checked={status === "True"}
                onChange={() => setStatus("True")}
                className="border border-solid border-gray-500 h-10"
              />
              <label htmlFor="free">Free</label>
              <input
                type="radio"
                id="paid"
                name="paid"
                value="False"
                checked={status === "False"}
                onChange={() => setStatus("False")}
                className="border border-solid border-gray-500 h-10"
              />
              <label htmlFor="paid">Paid</label>
            </div>

            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              className="border border-solid border-gray-500 h-10"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="border border-solid border-gray-500 h-10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label htmlFor="time">Select Time</label>
            <input
              type="time"
              id="time"
              name="time"
              className="border border-solid border-gray-500 h-10"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-black text-white py-2 px-4 w-1/3 rounded-md"
                onClick={closeAddModal}
              >
                Cancel
              </button>
              <button
                className="bg-customOrange text-white py-2 px-4 w-1/3 rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default YourEvents;
