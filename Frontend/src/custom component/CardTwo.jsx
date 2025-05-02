import { deleteAuction, republishAuction } from '@/store/slices/auctionSlice';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const dispatch = useDispatch();
  const handleDeleteAuction = () => {
    dispatch(deleteAuction(id));
  };

  const [openDrawer, setopenDrawer] = useState(false);
  return (
    <>
      <div className="basis-full rounded-2xl overflow-hidden bg-white shadow-md group sm:basis-56 lg:basis-60 2xl:basis-80 transition-all duration-300 hover:shadow-xl">
        <img
          src={imgSrc}
          alt={title}
          className="w-full aspect-[4/3] object-cover p-4"
        />
        <div className="px-4 pb-4">
          <h5 className="font-bold text-lg text-gray-800 group-hover:text-[#d6482b] mb-2 line-clamp-2">
            {title}
          </h5>
          {startingBid && (
            <p className="text-sm text-gray-600">
              Starting Bid:
              <span className="text-[#fdba88] font-semibold ml-1">
                {startingBid}
              </span>
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            {timeLeft.type}
            {Object.keys(timeLeft).length > 1 ? (
              <span className="text-[#fdba88] font-semibold ml-1">
                {formatTimeLeft(timeLeft)}
              </span>
            ) : (
              <span className="text-[#fdba88] font-semibold ml-1">Time's up!</span>
            )}
          </p>
          <div className="flex flex-col gap-2 mt-5">
            <Link
              className="bg-stone-700 text-white text-sm font-medium px-4 py-2 rounded-md text-center hover:bg-black"
              to={`/auction/details/${id}`}
            >
              View Auction
            </Link>
            <button
              className="bg-red-400 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleDeleteAuction}
            >
              Delete Auction
            </button>
            <button
              className="bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-200"
              disabled={new Date(endTime) > Date.now()}
              onClick={() => setopenDrawer(true)}
            >
              Republish Auction
            </button>
          </div>
        </div>
      </div>
      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setopenDrawer} />
    </>
  );
};

export default CardTwo;

const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { loading } = useSelector(state => state.auction);

  const handleRepbulishAuction = () => {
    const formData = new FormData();
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(republishAuction(id, formData));
  };

  return (
    <section
      className={`fixed z-50 transition-all duration-300 ${
        openDrawer && id ? "bottom-0" : "-bottom-full"
      } left-0 w-full h-full bg-black bg-opacity-50 flex items-end`}
    >
      <div className="bg-white w-full sm:max-w-[640px] mx-auto rounded-t-2xl shadow-lg p-6">
        <h3 className="text-[#D6482B] text-2xl font-semibold text-center mb-1">
          Republish Auction
        </h3>
        <p className="text-gray-600 text-sm text-center">
          Let's republish auction with same details but new starting and ending time.
        </p>
        <form className="flex flex-col gap-5 mt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Republish Auction Start Time
            </label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="text-sm py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fdba88]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Republish Auction End Time
            </label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="text-sm py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fdba88]"
            />
          </div>
          <button
            type="button"
            onClick={handleRepbulishAuction}
            className="bg-blue-500 text-white font-semibold text-sm py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            {loading ? "Republishing..." : "Republish"}
          </button>
          <button
            type="button"
            onClick={() => setOpenDrawer(false)}
            className="bg-yellow-500 text-white font-semibold text-sm py-2 rounded-md hover:bg-yellow-700 transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </section>
  );
};
