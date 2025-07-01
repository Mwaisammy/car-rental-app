import React, { useState } from "react";
import { usersAPI, type TUser } from "../../Features/user/userAPI";
import ChangeRole from "./ChangeRole";

const Users = () => {
  const [selectedUser, setSelectUser] = useState<TUser | null>(null);

  const {
    data: usersData,
    isLoading,
    error,
  } = usersAPI.useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 6000,
  });
  console.log("Users:", usersData);
  return (
    <div>
      <ChangeRole user={selectedUser} />
      <div className=" flex items-center justify-center">
        {isLoading && (
          <span className="loading loading-bars loading-lg">Loading users</span>
        )}
        {error && (
          <p className="text-rose-500 text-center flex items-center justify-center bg-black rounded-sm p-4 w-fit">
            Error fetching users
          </p>
        )}
      </div>
      {usersData && usersData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr className="bg-black text-white text-md lg:text-lg">
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Verified</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {usersData.map((user) => (
                <tr
                  key={user.customerID}
                  className="hover:bg-gray-700 border-b border-gray-400"
                >
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {user.role}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    <span>
                      {user.isVerified ? (
                        <span className="bg-emerald-500 text-white rounded-sm px-2 py-1">
                          verified
                        </span>
                      ) : (
                        <span className="bg-rose-400 text-white rounded-sm px-2 py-1">
                          not verified
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="btn btn-sm text-blue-400 hover:text-white cusror-pointer"
                      onClick={() => {
                        setSelectUser(user);
                        (
                          document.getElementById(
                            "role_modal"
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-rose-500 mt-4 ">Users not available</p>
      )}
    </div>
  );
};

export default Users;
