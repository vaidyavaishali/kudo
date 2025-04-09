import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contextAPI/usercontext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function LandingPage() {
  const navigate = useNavigate();
  const { kudos, setKudos } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // Get the logged-in user from localStorage
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  console.log(loggedUser)
  const userId = loggedUser?._id;
  const userName = loggedUser?.name;

  useEffect(() => {
    if (!loggedUser) {
      navigate("/");
    }
  }, [loggedUser, navigate]);

  // Handle like functionality
  const handleLike = async (kudoId) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`https://conscientious-tech-cms.vercel.app/api/kudos/${kudoId}/like`, {
        userId,
        userName,
      });

      const updatedLikes = response.data.likes;

      setKudos((prevKudos) =>
        prevKudos.map((kudo) =>
          kudo._id === kudoId ? { ...kudo, like: updatedLikes } : kudo
        )
      );
    } catch (error) {
      console.error("Error liking kudo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to the "Give Kudos" page
  const giveKudosNavigation = () => {
    navigate("/give-kudos");
  };
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="landing-page min-h-screen bg-gradient-to-b from-gray-100 via-slate-200 py-3 to-gray-300 relative  flex flex-col items-center justify-center overflow-hidden">
      <div className="bubble-bg bubble-1"></div>
      <div className="bubble-bg bubble-2"></div>
      <div className="bubble-bg bubble-3"></div>
      <div className="bubble-bg bubble-down-1"></div>
      <div className="bubble-bg bubble-down-2"></div>
      <div className="bubble-bg bubble-down-3"></div>

      <Helmet>
        <title>Home | KudosSpot</title>
      </Helmet>
      {/* Header Section */}
      <div className="text-center mb-4 max-w-3xl w-full z-10">

        <h1 className="text-5xl font-bold text-black tracking-wide text-center">
          Welcome, <span className="text-blue-500">{userName} </span> !!
        </h1>

      </div>

      {/* Kudos Feed Section */}
      <div className="p-6 w-full max-w-5xl overflow-hidden z-10">

        <div className="flex flex-col-reverse md:flex-row justify-between px-4 ">
          <h3 className="text-center text-2xl font-bold mb-6 text-black">All Kudos</h3>

          <div className="flex justify-end gap-6 mb-6">
            <button
              className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg font-medium shadow hover:bg-gradient-to-r hover:from-black hover:to-blue-500 hover:text-white transition"
              onClick={giveKudosNavigation}
            >
              Give Kudo
            </button>
            <button
              className=" text-white flex justify-center items-center rounded-full font-medium transition"
              onClick={logout}
            >
              <i className="fas fa-power-off hover:bg-red-700 bg-red-500 rounded-full p-2"></i>
              {/* logout */}
            </button>
          </div>
        </div>

        {kudos && kudos.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {kudos.map((kudo) => {
              const isLikedByUser = kudo.like?.some((like) => like.userId === userId);

              return (
                <div key={kudo._id} className="mb-4 bg-gray-50 rounded-lg shadow-md p-4 transition hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 flex justify-center items-center rounded-full shadow-md">
                      {kudo.message ? (
                        <i className={`${kudo.message.badgeicon} text-2xl text-blue-600`}></i>
                      ) : (
                        <i className="fas fa-question-circle text-2xl text-gray-500"></i>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-black">
                        {kudo.sender || "Anonymous"} gave{" "}
                        <span className="font-bold text-blue-600">
                          "{kudo.message.badge}"
                        </span>{" "}
                        Badge to {kudo.recipient?.name || "Anonymous"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 ms-16">{kudo.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 justify-end">
                    <button
                      className={`${isLikedByUser
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-gray-600"
                        } flex items-center`}
                      onClick={() => handleLike(kudo._id)}
                      disabled={isLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isLikedByUser ? "currentColor" : "gray"}
                        viewBox="0 0 24 24"
                        className="w-6 h-6 mr-2"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span>{kudo.like?.length || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No kudos found.</p>
        )}
      </div>

      {/* View Analytics Button */}
      <div className="flex justify-end w-full max-w-5xl mr-5 mt-8 z-10">
        <button
          className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-lg font-medium shadow hover:bg-gradient-to-r hover:from-black hover:to-blue-500 hover:text-white transition"
          onClick={() => navigate("/kudo-dashboard")}
        >
          <i className="fas fa-chart-line ml-2"></i>
          {" "}View Analytics
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
