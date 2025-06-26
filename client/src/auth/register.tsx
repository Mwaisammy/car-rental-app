import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import * as yup from "yup";
import { usersAPI } from "../Features/user/userAPI";
import toast from "react-hot-toast";

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  address: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  firstName: yup
    .string()
    .max(50, "Max 50 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .max(50, "Max 50 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .max(100, "Max 100 characters")
    .required("Email is required"),
  phoneNumber: yup
    .number()
    .min(8, "Min 8 numbers")
    .required("Phone number is required"),
  address: yup
    .string()
    .max(50, "Max 50 characters")
    .required("Address is required"),
  password: yup
    .string()
    .min(8, "Min 8 characters")
    .max(100, "Max 100 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .min(8, "Min 8 characters")
    .max(100, "Max 100 characters")
    .required("Confirm your password"),
});

const Register = () => {
  const navigate = useNavigate();
  const [createUser] = usersAPI.useCreateUsersMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const { ...userData } = data;
    console.log(userData);

    try {
      const response = await createUser(data).unwrap();
      console.log("Response....", response);
      toast.success(
        "Registration successful! Please check your email to verify your account"
      );
      navigate("/register/verify", {
        state: { email: data.email },
      });
    } catch (error) {
      console.error("Error creating user", error);
      toast.error("Registation failed. Please try again later");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-2xl flex flex-col w-full max-w-lg p-8 rounded-md">
        <div>
          <h2 className="text-center font-semibold text-xl md:text-2xl ">
            Register
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full  mt-4"
        >
          <input
            type="text"
            {...register("firstName")}
            placeholder="First name"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />

          {errors.firstName && (
            <span className="text-rose-500 text-sm">
              {errors.firstName.message}
            </span>
          )}

          <input
            type="text"
            {...register("lastName")}
            placeholder="Last name"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />

          {errors.lastName && (
            <span className="text-rose-500 text-sm">
              {errors.lastName.message}
            </span>
          )}

          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.email && (
            <span className="text-rose-500 text-sm">
              {errors.email.message}
            </span>
          )}
          <input
            type="number"
            {...register("phoneNumber")}
            placeholder="Phone number"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.phoneNumber && (
            <span className="text-rose-500 text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
          <input
            type="text"
            {...register("address")}
            placeholder="Home address"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.address && (
            <span className="text-rose-500 text-sm">
              {errors.address.message}
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
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className="input border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-full"
          />
          {errors.confirmPassword && (
            <span className="text-rose-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600  p-2 rounded-md mt-4 text-white"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          Have an a account?{" "}
          <span className="text-sm text-blue-500 cursor-pointer">
            {" "}
            <NavLink to={"/login"}>Login</NavLink>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
