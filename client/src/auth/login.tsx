import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import * as yup from "yup";
import { loginAPI } from "../Features/login/loginApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Features/login/userSlice";

type LoginInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max 100 characters")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Min 8 characters")
    .max(100, "Max 100 characters")
    .required("Password is required"),
});

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = loginAPI.useLoginUserMutation();

  const emailFormState = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFormState,
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log(data);
    try {
      const response = await loginUser(data).unwrap();
      dispatch(loginSuccess(response));

      console.log("Login", response);
      toast.success("Login in was successful");
      navigate("/admin/dashboard/cars");
    } catch (error) {
      console.log("Error", error);
      toast.error("Error login in");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div className="flex flex-col gap-4 items-center">
          <span className="loading loading-bars loading-xl"></span>
          <p className="text-center text-2xl font-semibold">
            Logging in, Please wait..
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-2xl flex flex-col w-full max-w-lg p-8 rounded-md">
          <div>
            <h2 className="text-center font-semibold text-xl md:text-2xl ">
              Login
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full  mt-4"
          >
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
              readOnly={!!emailFormState}
            />
            {errors.email && (
              <span className="text-rose-500 text-sm">
                {errors.email.message}
              </span>
            )}

            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
            />
            {errors.password && (
              <span className="text-rose-500 text-sm">
                {errors.password.message}
              </span>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600  p-2 rounded-md mt-4 text-white"
            >
              Login
            </button>
          </form>

          <div className="mt-4">
            Do not have an a account?{" "}
            <span className="text-sm text-blue-500 cursor-pointer">
              {" "}
              <NavLink to={"/register"}>Register</NavLink>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
