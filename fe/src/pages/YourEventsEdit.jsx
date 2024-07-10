import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const YourEventsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    image: { path: "", filename: "" },
    location: "",
    status: "True",
    category: "",
    date: "",
    time: ""
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/events/${id}`);
        const eventData = response.data.data;
        setEvent({
          title: eventData.title,
          description: eventData.description,
          image: eventData.image,
          location: eventData.location,
          status: eventData.isOpen ? "True" : "False",
          category: eventData.category,
          date: eventData.date,
          time: eventData.time
        });
      } catch (error) {
        console.error("Error fetching event", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleFileChange = (e) => {
    setEvent({ ...event, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", event.title);
    formData.append("description", event.description);
    formData.append("event-image", event.image);
    formData.append("location", event.location);
    formData.append("isOpen", event.status === "True");
    formData.append("category", event.category);
    formData.append("date", event.date);
    formData.append("time", event.time);

    try {
        await axios.put(`http://localhost:8080/api/v1/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/your-events/${id}`); 
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center text-3xl font-bold my-5">Edit Event</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mx-60 my-10">
        <div className="flex flex-col mb-4">
          <label htmlFor="title" className="mb-2 font-bold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="description" className="mb-2 font-bold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200 h-32 resize-none"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <input
            type="file"
            id="event-image"
            name="event-image"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="location" className="mb-2 font-bold">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={event.location}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="status" className="mb-2 font-bold">
            Select Status
          </label>
          <select
            id="status"
            name="status"
            value={event.status}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          >
            <option value="True">Free</option>
            <option value="False">Paid</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="category" className="mb-2 font-bold">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={event.category}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="date" className="mb-2 font-bold">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={event.date}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="time" className="mb-2 font-bold">
            Select Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={event.time}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-black text-white py-2 px-4 w-1/3 rounded-md"
            onClick={() => navigate(`/your-events/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-customOrange text-white py-2 px-4 w-1/3 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default YourEventsEdit;
