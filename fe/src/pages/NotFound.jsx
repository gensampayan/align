import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold m-16">404 Page Not Found</h1>
        <Link to="/" className="bg-customOrange hover:bg-black text-white font-bold py-2 px-4 rounded">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
