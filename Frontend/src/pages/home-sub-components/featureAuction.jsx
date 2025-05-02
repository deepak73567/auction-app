import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "@/custom component/card";
import ShimmerCard from "@/custom component/ShimmerCard";

// ✨ Text shimmer component
const TextShimmer = ({ width = "w-48", height = "h-6" }) => (
  <div className={`bg-purple-100 animate-pulse rounded-md ${width} ${height}`} />
);

const FeaturedAuctions = () => {
  const { allAuctions = [], loading } = useSelector((state) => state.auction);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 🔄 Dynamic search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = allAuctions.filter((auction) =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, allAuctions]);

  return (
    <section className="flex flex-col gap-6">
      {/* 🔍 Live search input with icon */}
      {!loading && (
        <div className="relative w-full sm:w-96 mx-auto mt-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400 text-xl pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search auction by title..."
            className="w-full pl-10 pr-4 py-2 border border-purple-400 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* 📦 Card grid or shimmer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {loading ? (
          [...Array(6)].map((_, idx) => <ShimmerCard key={idx} />)
        ) : searchResults.length > 0 ? (
          searchResults.map((element) => (
            <Card
              title={element.title}
              imgSrc={element.image?.url}
              startTime={element.startTime}
              endTime={element.endTime}
              startingBid={element.startingBid}
              id={element._id}
              key={element._id}
            />
          ))
        ) : searchTerm === "" ? (
          allAuctions.slice(0, 8).map((element) => (
            <Card
              title={element.title}
              imgSrc={element.image?.url}
              startTime={element.startTime}
              endTime={element.endTime}
              startingBid={element.startingBid}
              id={element._id}
              key={element._id}
            />
          ))
        ) : (
          <p className="text-purple-400 font-semibold col-span-full text-center py-8">
            😕 No auctions found for "<span className="italic">{searchTerm}</span>"
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuctions;
