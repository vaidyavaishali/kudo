import React, { useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { AuthContext } from "../contextAPI/usercontext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KudosDashboard = () => {
  const { kudos } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get the logged-in user from localStorage
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!loggedUser) {
      navigate("/");
    }
  }, [loggedUser, navigate]);

  // Count kudos received by each user
  const leaderboardData = kudos.reduce((acc, entry) => {
    const recipientName = entry.recipient.name;
    acc[recipientName] = (acc[recipientName] || 0) + 1;
    return acc;
  }, {});
  console.log(leaderboardData)

  // Convert leaderboard data to an array for table rendering
  const leaderboard = Object.entries(leaderboardData)
    .map(([name, kudosReceived]) => ({
      name,
      kudosReceived,
    }))
    .sort((a, b) => b.kudosReceived - a.kudosReceived);

  console.log(leaderboard)

  const badgeCounts = kudos.reduce((acc, entry) => {
    const badge = entry.message.badge;
    acc[badge] = (acc[badge] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the graph
  const allBadges = ["Helping Hand", "Excellent", "Above and Beyond", "Client Focus"];
  const badgeData = allBadges.map((badge) => badgeCounts[badge] || 0);
  console.log(badgeData)


  const likeCounts = allBadges.reduce((acc, badge) => {
    acc[badge] = 0;
    // console.log(acc)
    return acc;
  }, {});
  console.log(likeCounts, "likecount")
  let mostLikedKudos = {
    sender: "",
    recipient: "",
    message: "",
    badge: "",
    likeCount: 0
  };

  kudos.forEach((entry) => {
    const badge = entry.message.badge;
    const likeCount = entry.like.length;

    // Check if this kudos entry has more likes than the current most liked one
    if (likeCount > mostLikedKudos.likeCount) {
      mostLikedKudos = {
        sender: entry.sender.name,
        recipient: entry.recipient.name,
        message: entry.reason,
        badge,
        likeCount
      };
    }

    likeCounts[badge] = (likeCounts[badge] || 0) + likeCount;
  });
  const kudosData = {
    labels: allBadges,
    datasets: [
      {
        label: "Kudos given",
        data: badgeData,
        backgroundColor: "#4A90E2",
        barThickness: 30,
      },
    ],
  };
  console.log(kudosData, "kudosdata")

  const kudosOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: Math.max(...badgeData) + 4,
        ticks: {
          stepSize: 2,
          color: "#333",
        },
        grid: {
          color: "#ddd",
        },
      },
      x: {
        ticks: {
          stepSize: 1,
          color: "#333",
        },
        grid: {
          color: "#ddd",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-slate-200  to-gray-300 relative p-4 flex justify-center items-center">

      <Helmet>
        <title>Dashboard | KudosSpot</title>
      </Helmet>
      <div className="w-full bg-white z-10 max-w-5xl rounded-lg p-6 flex flex-col gap-10">
        <p
          className="float-left w-fit cursor-pointer text-blue-600 hover:text-blue-800 hover:font-semibold"
          onClick={() => {
            navigate("/landing-page");
          }}
        >
          <i className="fa fa-arrow-left"></i> Back
        </p>
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">Kudos Dashboard</h1>
        {/* Title */}
        <div className="flex flex-col lg:flex-row w-full justify-between gap-6">
          {/* Chart Section */}
          <div className="flex flex-col items-center gap-4 w-full lg:w-[50%]">
            <h2 className="text-lg font-semibold text-gray-700">Kudos given</h2>
            <div className="w-full h-64 sm:h-72 md:h-72 ">
              <Bar data={kudosData} options={kudosOptions} className="w-full" />
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="flex flex-col items-center justify-center gap-4 w-full lg:w-[40%]">
            <h2 className="text-lg font-semibold text-gray-700">Kudo Leaderboard</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Number of Kudos received</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50"}>
                      <td className="border  px-4 py-2 text-center">{entry.name}</td>
                      <td className="border  px-4 py-2 text-center">{entry.kudosReceived}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Most Liked Post Section */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-700">Most liked badge</h2>
          <p className="text-gray-600 text-center text-lg">
            The most liked badge: <strong>{mostLikedKudos.badge}</strong> was given by {mostLikedKudos.sender} to{" "}
            {mostLikedKudos.recipient} with the reason: "{mostLikedKudos.message}".
          </p>
        </div>
      </div>
    </div>
  );
};

export default KudosDashboard;
