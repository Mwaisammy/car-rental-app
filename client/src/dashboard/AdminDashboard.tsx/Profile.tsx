import { usersAPI } from "../../Features/user/userAPI";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  const user_id = user?.user?.user_id;

  const { data, isLoading, error } = usersAPI.useGetUserByIdQuery(
    user_id ?? 0,
    {
      skip: !user_id,
    }
  );

  console.log("Profile data", data);
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading profile</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md h-screen">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="flex flex-col items-center justify-center mb-4 gap-4 border border-gray-300 p-4 rounded-sm">
            <img
              src={
                data?.image_url ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="user-avatar"
            />
            <h3 className="text-lg font-bold">
              Name:{data?.firstName} {data?.lastName}
            </h3>
            <p className="text-gray-600">Name:{data?.customerID}</p>
            <p className="text-gray-600">Email:{data?.email}</p>
            <p className="text-gray-600">Verified ?:{data?.isVerified}</p>
            <p className="text-gray-600">Role:{data?.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
