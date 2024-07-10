import Event from "../models/event.model.js";

const createEvent = async (req, res) => {
  const { userId, title, description, location, isOpen, category, date, time } =
    req.body;

  let image = {};
  if (req.file) {
    image = {
      path: req.file.path,
      filename: req.file.filename
    };
  }

  const newEvent = new Event({
    userId,
    title,
    description,
    location,
    isOpen: isOpen === "True",
    category,
    date,
    time,
    image
  });

  try {
    await newEvent.save();
    res.status(201).send({
      message: "Created new event successfully",
      data: newEvent
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send({
      message: "Failed to create event",
      error: error.message
    });
  }
};

const getAllEvent = async (__, res) => {
  const events = await Event.find()
    .select([
      "title",
      "description",
      "location",
      "isOpen",
      "category",
      "image",
      "date",
      "time"
    ])
    .sort({ createdAt: -1 });

  if (!events) {
    return res.status(404).send("Events not found.");
  }

  res.status(200).send({
    message: "List of events.",
    data: events
  });
};

const getEventById = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId)
    .select([
      "title",
      "description",
      "location",
      "isOpen",
      "category",
      "image",
      "date",
      "time",
      "userId",
      "attendees"
    ])
    .populate({ path: "userId", select: ["firstName", "lastName"] });

  if (!event) {
    return res.status(404).send("Event not found.");
  }

  res.status(200).send({
    message: "Event found.",
    data: event
  });
};

const updateEventById = async (req, res) => {
  const { eventId } = req.params;

  let imageUpdate = {};
  if (req.file) {
    const { path, filename } = req.file;
    imageUpdate = { path, filename };
  }

  const updateData = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    isOpen: req.body.isOpen,
    category: req.body.category,
    attendees: req.body.attendees,
    date: req.body.date,
    time: req.body.time,
    deleted: req.body.deleted,
    image: imageUpdate
  };

  const event = await Event.findByIdAndUpdate(eventId, updateData, {
    new: true
  });

  if (!event) {
    return res.status(404).send("Event with the given ID was not found.");
  }

  res.status(200).send({
    message: "Event updated successfully.",
    data: event
  });
};

const softDeleteEventById = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).send("Event not found.");
  }

  event.deleted = true;
  await event.save();

  res.status(200).send({
    message: "Event deleted successfully.",
    data: event
  });
};

export {
  createEvent,
  getAllEvent,
  getEventById,
  updateEventById,
  softDeleteEventById
};
