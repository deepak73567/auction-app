import { createAuction } from "@/store/slices/auctionSlice";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const CreateAuction = () => {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
  ];

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Auctioneer") {
      navigateTo("/");
    }
  }, [isAuthenticated, user, navigateTo]);

  useEffect(() => {
    if (success) {
      navigateTo("/auctions");
      dispatch({ type: "auction/createAuctionSuccess", payload: false });
    }
  }, [success, navigateTo, dispatch]);

  const handleCreateAuction = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("startingBid", startingBid);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(createAuction(formData));
  };

  return (
    <section className="w-full px-4 pt-20 lg:pl-[320px] bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-purple-500 mb-6 text-center">Create Auction</h1>
        <form onSubmit={handleCreateAuction} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-stone-600 font-medium">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none focus:border-purple-500 transition-all" />
            </div>
            <div>
              <label className="block text-stone-600 font-medium">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none focus:border-purple-500 transition-all bg-transparent">
                <option value="">Select Category</option>
                {auctionCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-600 font-medium">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none focus:border-purple-500 transition-all bg-transparent">
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-600 font-medium">Starting Bid ($)</label>
              <input type="number" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none focus:border-purple-500 transition-all" />
            </div>
            <div>
              <label className="block text-stone-600 font-medium">Start Time</label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium">End Time</label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full border-b-2 border-purple-300 py-2 px-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border-2 border-purple-200 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-all"
              placeholder="Describe the item..."
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-44 h-auto rounded-lg shadow-md" />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-purple-400 mb-2" />
                    <p className="text-sm text-purple-500">Click to upload or drag and drop</p>
                  </>
                )}
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={imageHandler} />
            </label>
          </div>

          <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:opacity-60 w-full sm:w-1/2 mx-auto">
            {loading ? "Creating Auction..." : "Create Auction"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateAuction;
