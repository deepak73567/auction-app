import Spinner from '@/custom component/Spinner';
import { getAuctionDetail } from '@/store/slices/auctionSlice';
import { placeBid } from '@/store/slices/bidSlice';
import React, { useEffect, useState } from 'react';
import { FaGreaterThan } from 'react-icons/fa';
import { RiAuctionFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AuctionItem = () => {
    const { id } = useParams();
    const { loading, auctionDetail, auctionBidders } = useSelector(state => state.auction);
    const { isAuthenticated } = useSelector(state => state.user);
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');

    const handleBid = () => {
        const formData = new FormData();
        formData.append("amount", amount);
        dispatch(placeBid(id, formData));
        dispatch(getAuctionDetail(id));
    };

    useEffect(() => {
        if (!isAuthenticated) {
            // Toast tabhi dikhana jab actually component render hoa
            toast.error("Please login/signup!");
            navigateTo("/");
        } else if (id) {
            dispatch(getAuctionDetail(id));
        }
    }, [isAuthenticated, id, dispatch]);
    

    return (
        <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
            {/* Breadcrumb */}
            <div className="text-[16px] flex flex-wrap items-center gap-2">
                <Link to="/" className='font-semibold transition-all duration-300 hover:text-[#D64828]'>Home</Link>
                <FaGreaterThan className='text-stone-400' />
                <Link to="/auctions" className='font-semibold transition-all duration-300 hover:text-[#D64828]'>Auctions</Link>
                <FaGreaterThan className='text-stone-400' />
                <p className='text-stone-600'>{auctionDetail?.title || "Auction Details"}</p>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className='flex gap-4 flex-col lg:flex-row'>
                    {/* Left Auction Detail */}
                    <div className='flex-1 flex flex-col gap-3'>
                        <div className='flex gap-4 flex-col lg:flex-row'>
                            <div className='bg-white w-full lg:w-40 flex justify-center items-center p-5'>
                                <img src={auctionDetail?.image?.url} alt={auctionDetail?.title || "Auction Image"} />
                            </div>
                            <div className='flex flex-col justify-around pb-4'>
                                <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                                    {auctionDetail?.title || "Auction Title"}
                                </h3>
                                <p className='text-xl font-semibold'>
                                    Minimum Bid: <span className="text-[#D64826]">Rs. {auctionDetail?.startingBid || "N/A"}</span>
                                </p>
                                <p className='text-xl font-semibold'>
                                    Condition: <span className="text-[#D64826]">{auctionDetail?.condition || "N/A"}</span>
                                </p>
                            </div>
                        </div>

                        <p className='text-xl w-fit font-bold'>Auction Item Description</p>
                        <hr className='my-2 border-t-[1px] border-t-stone-700' />
                        <ul>
                            {auctionDetail?.description
                                ? auctionDetail.description.split(". ").map((element, index) => (
                                    <li key={index} className='text-[18px] my-2'>{element}</li>
                                ))
                                : <li className="text-gray-500">No description available.</li>
                            }
                        </ul>
                    </div>

                    {/* Right Bids Section */}
                    <div className='flex-1'>
                        <header className='bg-stone-200 py-4 text-[24px] font-semibold px-4'>BIDS</header>
                        <div className='bg-white px-4 min-h-fit lg:min-h-[650px]'>
                            {auctionBidders && auctionBidders.length > 0 &&
                                new Date(auctionDetail?.startTime) < Date.now() &&
                                new Date(auctionDetail?.endTime) > Date.now() ? (
                                auctionBidders.map((element, index) => (
                                    <div key={index} className='py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                        <div className='flex items-center gap-3'>
                                            <img src={element?.profileImage || "/defaultProfile.png"} alt={element?.userName || "Bidder"} className='w-10 h-10 rounded-full object-cover' />
                                            <p className='text-base md:text-lg font-medium'>{element?.userName || "Anonymous"}</p>
                                        </div>
                                        <p className={`text-sm md:text-[18px] font-semibold ${
                                            index === 0 ? "text-green-600"
                                                : index === 1 ? "text-blue-600"
                                                    : index === 2 ? "text-yellow-600"
                                                        : "text-gray-600"
                                            }`}>
                                            {index === 0 ? `1st with Rs. ${auctionDetail?.currentBid}` : `${index + 1}${["st","nd","rd"][index] || "th"}`}
                                        </p>
                                    </div>
                                ))
                            ) : Date.now() < new Date(auctionDetail?.startTime) ? (
                                <img src="/notStarted.png" alt="not-started" className='w-full max-h-[650px]' />
                            ) : (
                                <img src="/auctionEnded.png" alt="ended" className='w-full max-h-[650px]' />
                            )}
                        </div>

                        {/* Place Bid */}
                        <div className='bg-purple-400 py-4 text-[16px] md:text-[24px] font-semibold px-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 w-full'>
                            {Date.now() >= new Date(auctionDetail?.startTime) && Date.now() <= new Date(auctionDetail?.endTime) ? (
                                <>
                                    <div className='flex flex-col sm:flex-row sm:items-center'>
                                        <p className='text-white'>Place Bid</p>
                                        <input
                                            type="number"
                                            className='w-32 focus:outline-none md:text-[20px] p-1 rounded-md border-2 border-[#D6482B] focus:border-[#222] transition-all duration-300'
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: "0 0 15px rgba(147, 51, 234, 0.8)",
                                            backgroundColor: "#222",
                                            transition: { duration: 0.3 },
                                        }}
                                        onClick={handleBid}
                                        className='p-4 text-white bg-black rounded-full hover:bg-[#333] focus:outline-none transition-all duration-300 ease-in-out'>
                                        <RiAuctionFill className="text-xl" />
                                    </motion.button>
                                </>
                            ) : (
                                <p className='text-white font-semibold text-xl'>
                                    {new Date(auctionDetail?.startTime) > Date.now() ? "Auction Not Started Yet." : "Auction Ended."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AuctionItem;
