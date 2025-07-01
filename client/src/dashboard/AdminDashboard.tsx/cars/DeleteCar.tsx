import toast from "react-hot-toast";
import { carsAPI, type TCar } from "../../../Features/cars/carsAPI";

type DeleteCarProps = {
  car: TCar | null;
};

const DeleteCar = ({ car }: DeleteCarProps) => {
  const [deleteCar, { isLoading }] = carsAPI.useDeleteCarMutation({
    fixedCacheKey: "deleteTodo", //used to prevent cache invalidation issues - in simple terms, it helps to keep the cache consisten
  });
  const handleDelete = async () => {
    try {
      if (!car) {
        toast.error("Car not found");
        return;
      }
      const response = await deleteCar(car.carID);
      console.log("Delete car", response);
      toast.success("Car deleted successfully!");
      (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete car. Please try again.");
    }
  };
  return (
    <dialog id="delete_modal" className="modal sm:modal-middle  ">
      <div className="modal-box bg-black border border-rose-500 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Delete car</h3>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{car?.carModel}</span>?
        </p>
        <div className="modal-action flex gap-4">
          <button
            className="btn btn-error border-2 border-rose-500"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner text-primary" />{" "}
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            className="btn "
            type="button"
            onClick={() =>
              (
                document.getElementById("delete_modal") as HTMLDialogElement
              )?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteCar;
