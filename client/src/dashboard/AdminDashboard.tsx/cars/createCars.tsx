import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { carsAPI } from "../../../Features/cars/carsAPI";
import toast from "react-hot-toast";

type CreateCarInputs = {
  carModel: string;
  year: string;
  color: string;
  rentalRate: string;
  availability: boolean;
  locationID: number;
};

const schema = yup.object({
  carModel: yup
    .string()
    .max(75, "Max 75 characters")
    .required("Car model required"),
  year: yup.string().required("Year is required"),
  color: yup
    .string()
    .max(20, "Max 20 characters")
    .required("Color is required"),
  availability: yup.boolean().default(false),
  rentalRate: yup
    .string()
    .max(20, "Max 20 characters")
    .required("Rental rate is required"),

  locationID: yup
    .number()
    .required("Location ID is required")
    .positive("Location ID must be a positive number")
    .integer("Location ID must be an integer"),
});

const CreateCars = () => {
  const [createCar, { isLoading }] = carsAPI.useCreateCarMutation({
    fixedCacheKey: "createCar",
  });

  //   const result = await createCar({ ...data, id: car.carID });

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<CreateCarInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateCarInputs> = async (data) => {
    try {
      const response = await createCar(data).unwrap(); //expect a success/error message
      console.log("Create car", response);
      toast.success("Car created successfully!");
      reset(); // Clear the form after successful submission
      (document.getElementById("create_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating car:", error);
      toast.error("Failed to create car. Please try again.");
    }
  };

  return (
    <dialog id="create_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-black border border-emerald-500 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Create car</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            {...register("carModel")}
            placeholder="Car model"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.carModel && (
            <span className="text-sm text-red-700">
              {errors.carModel.message}
            </span>
          )}

          <input
            {...register("color")}
            placeholder="Color"
            className=" w-full input rounded p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.color && (
            <span className="text-sm text-red-700">{errors.color.message}</span>
          )}

          <input
            type="number"
            {...register("locationID")}
            placeholder="Location ID"
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.locationID && (
            <span className="text-sm text-red-700">
              {errors.locationID.message}
            </span>
          )}

          <input
            type="date"
            {...register("year")}
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.year && (
            <span className="text-sm text-red-700">{errors.year.message}</span>
          )}
          <input
            type="number"
            placeholder="Rental rate"
            {...register("rentalRate")}
            className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
          />
          {errors.rentalRate && (
            <span className="text-sm text-red-700">
              {errors.rentalRate.message}
            </span>
          )}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text mr-4 text-white">Status</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="true"
                    {...register("availability")}
                    className="radio radio-primary text-green-400"
                  />
                  Available
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="false"
                    {...register("availability")}
                    className="radio radio-primary text-rose-400"
                  />
                  Not Available
                </label>
              </div>
            </label>
          </div>
          {errors.availability && (
            <span className="text-sm text-red-700">
              {errors.availability.message}
            </span>
          )}

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary border-2 border-emerald-500 "
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-primary" />{" "}
                  Updating...
                </>
              ) : (
                "Create"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (
                  document.getElementById("create_modal") as HTMLDialogElement
                )?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateCars;
