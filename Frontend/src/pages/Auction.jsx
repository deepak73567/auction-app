import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '@/custom component/card';
import Spinner from '@/custom component/Spinner';

const Auction = () => {
  const { allAuctions, loading } = useSelector(state => state.auction);
  const [searchTerm, setSearchTerm] = useState('');

  const auctionsToShow = allAuctions.filter(auction =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col justify-center bg-[#f9f7f7]">
          <section className="my-8">
            {/* 🔤 Page Title */}
            <h1 className="text-purple-400 text-2xl font-bold mb-4 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Auctions
            </h1>

            {/* 🔍 Search bar */}
            <div className="flex items-center gap-2 w-full sm:w-96 mb-6">
              <input
                type="text"
                placeholder="Search auction by title..."
                className="w-full px-4 py-2 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => {}}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-all duration-200"
              >
                🔍
              </button>
            </div>

            {/* 📦 Auction Cards */}
            {auctionsToShow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {auctionsToShow.map(element => (
                  <Card
                    key={element._id}
                    title={element.title}
                    startTime={element.startTime}
                    endTime={element.endTime}
                    imgSrc={element.image?.url}
                    startingBid={element.startingBid}
                    id={element._id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-center">
                😕 No auctions found for "<strong>{searchTerm}</strong>"
              </p>
            )}
          </section>
        </article>
      )}
    </>
  );
};

export default Auction;
