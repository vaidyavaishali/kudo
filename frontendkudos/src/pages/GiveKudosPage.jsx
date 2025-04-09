import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contextAPI/usercontext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const GiveKudosPage = () => {
    const navigate = useNavigate();
    const { allUsers, fetchAllKudos } = useContext(AuthContext);
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState("");
    const [badge, setBadge] = useState("");
    const [reason, setReason] = useState("");

    const kudosBadge = [
        { title: "Helping Hand", icon: "fas fa-hand-holding-heart" },
        { title: "Excellent", icon: "fas fa-star" },
        { title: "Above and Beyond", icon: "fas fa-arrow-up" },
        { title: "Client Focus", icon: "fas fa-user-tie" },
    ];

    useEffect(() => {
        if (!loggedUser) {
            navigate("/");
        }
    }, [loggedUser, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !badge) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill out all fields.',
                confirmButtonText: 'Okay',
            });
            return;
        }

        try {
            const response = await axios.post("https://kudospot.vercel.app/api/kudos/send", {
                recipient: user,
                message: { badge, badgeicon: kudosBadge.find(b => b.title === badge)?.icon },
                reason,
                sender: loggedUser?.name,
            });
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Kudos Sent!',
                    text: `You have successfully sent a "${badge}" badge to ${user.name}.`,
                    confirmButtonText: 'Great!',
                    showConfirmButton: true,
                    timer: 3000, // Auto-close after 3 seconds
                });
                navigate("/landing-page");
                fetchAllKudos();
                setUser("");
                setBadge("");
                setReason("");
            }
        } catch (error) {
            console.error("Error sending kudos:", error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send Kudos',
                text: 'Please try again later or check your connection.',
                confirmButtonText: 'Retry',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-slate-200  to-gray-300 relative flex flex-col items-center justify-center p-6">
            <div className="bubble-bg bubble-1"></div>
            <div className="bubble-bg bubble-2"></div>
            <div className="bubble-bg bubble-3"></div>
            <div className="bubble-bg bubble-down-1"></div>
            <div className="bubble-bg bubble-down-2"></div>
            <div className="bubble-bg bubble-down-3"></div>
            <Helmet>
                <title>Add Kudos | KudosSpot</title>
            </Helmet>
            <div className="w-full mx-auto max-w-xl">
                <p
                    className="text-left text-xl float-left w-fit cursor-pointer text-blue-600 hover:text-blue-800 hover:font-semibold mb-5"
                    onClick={() => {
                        navigate("/landing-page");
                    }}
                >
                    <i className="fa fa-arrow-left"></i> Back
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className=" p-6 w-full max-w-xl text-center"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Give Kudos</h1>

                {/* Select user input */}
                <div className="relative w-full my-2">
                    <select
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className={`w-full appearance-none px-4 py-5 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center ${!user ? 'text-gray-400' : 'text-gray-800'}`}
                        placeholder="Select the user you want to give kudos to"
                    >
                        <option value="" disabled>Select the user you want to give kudos to</option>
                        {allUsers &&
                            allUsers
                                .filter((u) => u.name !== loggedUser?.name)
                                .map((user) => (
                                    <option key={user._id} value={user._id} className="text-gray-800">
                                        {user.name}
                                    </option>
                                ))}
                    </select>
                </div>

                {/* Select badge input */}
                <div className="relative w-full my-2">
                    <select
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className={`w-full appearance-none px-4 py-5 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center ${!badge ? 'text-gray-400' : 'text-gray-800'}`}
                    >
                        <option value="" disabled>Select the badge you want to give</option>
                        {kudosBadge &&
                            kudosBadge.map((badge, index) => (
                                <option key={index} value={badge.title} className="text-gray-800">
                                    {badge.title}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Reason input */}
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for Kudos"
                    className="my-0 w-full appearance-none px-4 py-3 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center"
                    rows="3"
                ></textarea>

                {/* Submit button */}
                <button
                    type="submit"
                    className="mt-6 px-10 md:px-28 py-2 md:py-5 text-lg text-white bg-black rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Give Kudos
                </button>
            </form>
        </div>
    );
};

export default GiveKudosPage;
