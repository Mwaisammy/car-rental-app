import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const Welcome = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  console.log(currentUser);
  return (
    <div className="flex items-center justify-center m-5">
      <h3 className="text-xl font-semibold text-center flex  items-center">
        Welcome{" "}
        <span className="bg-gradient-to-r from-rose-300 via-rose-500 to-blue-600 bg-clip-text text-transparent ml-2">
          {currentUser?.user ? currentUser.user.first_name : ""}
        </span>
        😊
      </h3>
    </div>
  );
};

export default Welcome;
