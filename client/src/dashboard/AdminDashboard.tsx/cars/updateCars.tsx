import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { carsAPI, type TCar } from "../../../Features/cars/carsAPI";
import toast from "react-hot-toast";

type UpdateCarProps = {
  car: TCar | null; //can be null if no car is selected
};

type UpdateCarInputs = {
  carModel: string;
  year: string;
  color: string;
  availability: boolean;
  locationID: number;
};

const schema = yup.object({
  carModel: yup
    .string()
    .max(75, "Max 75 characters")
    .required("car name is required"),
  color: yup
    .string()
    .max(20, "Max 20 characters")
    .required("color is required"),
  locationID: yup
    .number()
    .required("Location ID is required")
    .positive("Location ID must be a positive number")
    .integer("Location ID must be an integer"),
  availability: yup.boolean().default(false),
  year: yup.string().required("Due date is required"),
});

const UpdateCar = ({ car }: UpdateCarProps) => {
  const [updateCar, { isLoading }] = carsAPI.useUpdateCarMutation({
    fixedCacheKey: "UpdateCar",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateCarInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (car) {
      setValue("carModel", car.carModel);
      setValue("color", car.color);
      setValue("year", car.year.slice(0, 10));
      setValue("locationID", car.locationID);
    } else {
      reset();
    }
  }, [car, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateCarInputs> = async (data) => {
    if (!car) {
      toast.error("No car selected for update");
      return;
    }
    try {
      const result = await updateCar({ ...data, id: car.carID });

      if ("error" in result) {
        toast.error("Failed to update car");
        console.error(result.error);
      } else {
        toast.success("Car updated successfully");
        console.log("Car was updated successfully", result.data);
        reset();
        (document.getElementById("update_modal") as HTMLDialogElement)?.close();
      }
    } catch (error) {
      toast.error("Car failed to update");
      console.log(error);
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-900 border border-blue-500 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update car</h3>
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
              className="btn btn-primary  border-2 border-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-primary" />{" "}
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (
                  document.getElementById("update_modal") as HTMLDialogElement
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

export default UpdateCar;
