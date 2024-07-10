import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";

const Profile = () => {
  const {
    user: { accessToken }
  } = useContext(AuthContext);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { data }
      } = await axios.get("http://localhost:8080/api/v1/users", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProfile(data);
    })();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-center mt-4">
        {profile.image?.path && (
          <img
            src={profile.image?.path}
            alt={profile.firstName}
            className="max-w-3/4 max-h-1/2 object-contain mb-4"
          />
        )}
      </div>
      <div className="flex mb-4 font-body flex-column justify-center">
        {/* <ul className="pl-5 mt-4 ml-auto w-2/3 text-4xl"> */}
        <ul className="mt-4 w-2/3 text-4xl">
          <li className="p-2">
            <span className="font-bold">FULL NAME:</span>{" "}
            {profile.firstName + " " + profile.lastName}
          </li>
          <li className="p-2">
            <span className="font-bold">EMAIL:</span> {profile.email}
          </li>
          <li className="p-2">
            <span className="font-bold">ADDRESS:</span> {profile.location}
          </li>
        </ul>
      </div>
      <div className="flex flex-row justify-center mb-4">
        <button
          className="signup-button"
          onClick={() => navigate(`/members/edit`)}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;
