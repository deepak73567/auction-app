import Spinner from "@/custom component/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <section className="w-full h-fit px-5 pt-20 lg:pl-[320px] min-h-screen bg-gray-50">
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white mx-auto max-w-4xl rounded-lg shadow-lg p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={user.profileImage?.url || "/imageHolder.jpg"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user.userName}
            </h2>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Username", value: user.userName },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Address", value: user.address },
                { label: "Role", value: user.role },
                {
                  label: "Joined On",
                  value: user.createdAt?.substring(0, 10),
                },
              ].map(({ label, value }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details for Auctioneer */}
          {user.role === "Auctioneer" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-1">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Bank Name",
                    value: user.PaymentMethods.bankTransfer.bankName,
                  },
                  {
                    label: "Bank Account (IBAN)",
                    value:
                      user.PaymentMethods.bankTransfer.bankAccountNumber,
                  },
                  {
                    label: "User Name On Bank Account",
                    value:
                      user.PaymentMethods.bankTransfer.bankAccountName,
                  },
                  {
                    label: "Easypaisa Account Number",
                    value:
                      user.PaymentMethods.GooglePay
                        .GooglePayAccountNumber,
                  },
                  {
                    label: "Paypal Email",
                    value: user.PaymentMethods.paypal.paypalEmail,
                  },
                ].map(({ label, value }, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b pb-1">Other User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.role === "Auctioneer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unpaid Commissions
                  </label>
                  <input
                    type="text"
                    value={user.unpaidCommission}
                    readOnly
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
              )}
              {user.role === "Bidder" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Auctions Won
                    </label>
                    <input
                      type="text"
                      value={user.auctionWon}
                      readOnly
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Money Spent
                    </label>
                    <input
                      type="text"
                      value={user.moneySpent}
                      readOnly
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
