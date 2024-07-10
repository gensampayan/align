import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EventsDetail from "./pages/events/EventsDetail";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import YourEvents from "./pages/YourEvents";
import YourEventsEdit from "./pages/YourEventsEdit";
import YourEventsDetails from "./pages/YourEventsDetails";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/events" element={<Dashboard />} />
        <Route path="/events/:eventId" element={<EventsDetail />} />
        <Route path="/members" element={<Profile />} />
        <Route path="/members/edit" element={<ProfileEdit />} />
        <Route path="your-events" element={<YourEvents />} />
        <Route path="/your-events/:id" element={<YourEventsDetails />} />
        <Route path="/your-events/:id/edit" element={<YourEventsEdit />} />
      </Route>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
