import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDiff = new Date(startTime) - now;
    const endDiff = new Date(endTime) - now;

    if (startDiff > 0) {
      return {
        type: "Starts In:",
        days: Math.floor(startDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDiff / 1000 / 60) % 60),
        seconds: Math.floor((startDiff / 1000) % 60),
        status: "upcoming",
      };
    } else if (endDiff > 0) {
      return {
        type: "Ends In:",
        days: Math.floor(endDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDiff / 1000 / 60) % 60),
        seconds: Math.floor((endDiff / 1000) % 60),
        status: "live",
      };
    } else {
      return { status: "ended" };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Link
      to={`/auction/item/${id}`}
      className="flex-grow basis-full bg-white rounded-2xl group sm:basis-56 lg:basis-60 2xl:basis-80 shadow-md hover:shadow-xl transition duration-300 overflow-hidden relative"
    >
      {/* 🖼️ Image */}
      <div className="relative">
        <img
          src={imgSrc}
          alt={title}
          className={`w-full aspect-[4/3] object-cover md:p-6 transition duration-300 ${
            timeLeft.status === "ended" ? "grayscale opacity-60" : ""
          }`}
        />

        {/* 🔴 Status Badge */}
        {timeLeft.status === "live" && (
          <span className="absolute top-2 right-2 px-3 py-1 text-xs font-bold rounded-full text-white bg-green-600 animate-pulse shadow-lg z-10">
            LIVE
          </span>
        )}
        {timeLeft.status === "upcoming" && (
          <span className="absolute top-2 right-2 px-3 py-1 text-xs font-bold rounded-full text-white bg-blue-600 animate-bounce shadow-lg z-10">
            UPCOMING
          </span>
        )}
        {timeLeft.status === "ended" && (
          <span className="absolute top-2 right-2 px-3 py-1 text-xs font-bold rounded-full text-white bg-red-600 shadow z-10">
            SOLD
          </span>
        )}
      </div>

      {/* 📄 Content */}
      <div className="px-4 pt-3 pb-4">
        <h5 className="font-semibold text-lg text-gray-800 group-hover:text-orange-500 transition mb-1 truncate">
          {title}
        </h5>

        {startingBid && (
          <p className="text-sm text-gray-600 font-light">
            Starting Bid:
            <span className="text-orange-400 font-bold ml-1">{startingBid}</span>
          </p>
        )}

        <p className="text-sm text-gray-600 font-light mt-1">
          {timeLeft.type}{" "}
          {timeLeft.status !== "ended" ? (
            <span className="text-orange-500 font-semibold ml-1">
              {formatTimeLeft(timeLeft)}
            </span>
          ) : (
            <span className="text-red-500 font-semibold ml-1">Time's up!</span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default Card;
