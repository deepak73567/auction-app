import React, { useState, useEffect, useRef } from "react";
import {
  RiAuctionFill,
  RiInstagramFill,
} from "react-icons/ri";
import {
  MdLeaderboard,
  MdDashboard,
} from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import {
  FaFacebook,
  FaUserCircle,
  FaFileInvoiceDollar,
  FaEye,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoIosCreate } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../public/logo3.png";
const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const drawerRef = useRef();



  const handleLogout = () => {
    dispatch(logout());
    setShow(false);
  };

  const handleLinkClick = () => {

    setShow(false);
  };

 

  useEffect(() => {
    setShow(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className={`fixed z-[100] right-5 top-3 text-black text-3xl p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-white/20 lg:hidden cursor-pointer`}
      >
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            show ? "rotate-90 scale-110 opacity-100" : "rotate-0 scale-100 opacity-100"
          }`}
        >
          {show ? (
            <IoMdClose className="text-3xl text-black transition-opacity duration-500" />
          ) : (
            <GiHamburgerMenu className="text-3xl text-black transition-opacity duration-500" />
          )}
        </div>
      </div>

      {show && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setShow(false)}
        ></div>
      )}

      <div
        ref={drawerRef}
        className={`w-[100%] sm:w-[300px] bg-[#f6f4f0] h-full fixed top-0 z-40 ${
          show ? "left-0" : "-left-full"
        } transition-all duration-500 ease-in-out transform p-4 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-stone-500 animate-slide-in-left`}
      >
        <div className="relative">
        <Link to="/"  className="flex flex-row items-start mb-4">
        <div className="flex flex-row justify-center items-center">
        <img src={Logo} alt="WinWager Logo" className="w-12 h-12 object-contain mb-1" />
            <h4 className="text-2xl font-semibold">
              in
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-600">
                Wager
              </span>
            </h4>
        </div>
            
          </Link>

          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/auctions" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                <RiAuctionFill /> Auctions
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>

            {isAuthenticated && user?.role === "Auctioneer" && (
              <>
                <li>
                  <Link to="/submit-commission" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link to="/create-auction" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link to="/view-my-auctions" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === "Super Admin" && (
              <li>
                <Link to="/dashboard" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                  <MdDashboard /> Dashboard
                </Link>
              </li>
            )}
          </ul>

          {!isAuthenticated ? (
            <div className="my-4 flex gap-2">
              <Link to="/sign-up" onClick={handleLinkClick} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-lg rounded-md px-8 flex items-center py-2 transition-all duration-300">
                Sign Up
              </Link>
              <Link to="/login" onClick={handleLinkClick} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 border-2 border-purple-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-black font-bold text-lg rounded-md px-8 flex items-center py-2 transition-all duration-300">
                Login
              </Link>
            </div>
          ) : (
            <div className="w-full flex justify-start mt-4">
            <button
              onClick={handleLogout}
              className="w-[150px] bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 text-white font-semibold text-base py-2 rounded-md flex justify-center items-center gap-2 disabled:opacity-70"
            >
              Logout
            </button>
          </div>
          

          )}

          <hr className="mb-4 border-t-[#d6482b]" />

          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link to="/me" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            <li>
              <Link to="/how-it-works-inf0" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                <SiGooglesearchconsole /> How it works
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={handleLinkClick} className="flex text-xl font-semibold gap-2 items-center hover:text-[#A855F7]">
                <BsFillInfoSquareFill /> About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex gap-2 items-center mb-2">
            <Link to="/" className="bg-white text-stone-500 p-2 text-xl rounded-sm hover:text-blue-700">
              <FaFacebook />
            </Link>
            <Link to="/" className="bg-white text-stone-500 p-2 text-xl rounded-sm hover:text-[#A855F7]">
              <RiInstagramFill />
            </Link>
          </div>
          <Link to="/contact" onClick={handleLinkClick} className="text-stone-500 font-semibold hover:text-[#A855F7]">
            Contact Us
          </Link>
          {user?.role === "Super Admin" ? (
  <>
    <p className="text-stone-500">
      Frontend Code Link:{" "}
      <Link
        to={"https://github.com/deepak73567/Auction-Frontend"}
        className="text-stone-500 font-semibold hover:text-[#A855F7] transition-all duration-150"
      >
        Click
      </Link>
    </p>
    <p className="text-stone-500">
      Backend Code Link:{" "}
      <Link
        to={"https://github.com/deepak73567/Auction-Plateform"}
        className="text-stone-500 font-semibold hover:text-[#A855F7] transition-all duration-150"
      >
        Click
      </Link>
    </p>
  </>
) : (
  <p>Coders Goal</p>
)}

         
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
