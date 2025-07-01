import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { carsAPI, type TCar } from "../../../Features/cars/carsAPI";
import UpdateCars from "../cars/updateCars";
import { useState } from "react";
import CreateCars from "./createCars";
import DeleteCar from "./DeleteCar";

const Cars = () => {
  const [selectedCar, setSelectedCar] = useState<TCar | null>(null);
  const [deleteCar, setDelSelectCar] = useState<TCar | null>(null);
  const handleEdit = (car: TCar) => {
    setSelectedCar(car);
  };
  const {
    data: carsData,
    isLoading: carsLoading,
    error: carError,
  } = carsAPI.useGetCarsQuery(undefined, {
    refetchOnMountOrArgChange: true, //refetch on event change
    pollingInterval: 6000, //checking new data / changes every 6sec and reapplying them
  });
  console.log("Cars:", carsData);
  return (
    <div>
      <UpdateCars car={selectedCar} />
      <CreateCars />
      <DeleteCar car={deleteCar} />

      <div className="flex items-center justify-center m-4">
        <button
          className="btn bg-emerald-500 rounded-md text-white"
          onClick={() =>
            (
              document.getElementById("create_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Create Car
        </button>
      </div>
      <div className=" flex items-center justify-center">
        {carsLoading && (
          <span className="loading loading-bars loading-lg">Loading cars</span>
        )}
        {carError && (
          <p className="text-rose-500 text-center flex items-center justify-center bg-black rounded-sm p-4 w-fit">
            Error fetching cars
          </p>
        )}
      </div>
      {carsData && carsData.data && carsData.data.length > 0 ? (
        <div>
          <table className="table table-xs">
            <thead>
              <tr className="bg-black text-white text-md lg:text-lg">
                <th className="px-4 py-2">Car ID</th>
                <th className="px-4 py-2">Car Model</th>
                <th className="px-4 py-2">Year of make</th>
                <th className="px-4 py-2">Location ID</th>
                <th className="px-4 py-2">Rental rate</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carsData.data.map((car: TCar) => (
                <tr
                  className="hover:bg-gray-700 border-b border-gray-400  p-10"
                  key={car.carID}
                >
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car.carID}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car.carModel}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car.year}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car.locationID}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car.rentalRate}%
                  </td>
                  <td className="px-8 py-2 border-r border-gray-400 lg:text-base">
                    {car.color}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                    {car?.availability ? (
                      <span className="text-white text-center text-sm bg-emerald-500 w-fit px-1 py-1 rounded-md">
                        Available
                      </span>
                    ) : (
                      <span className="text-white text-center text-sm bg-rose-500 w-fit px-1 py-1 rounded-md">
                        Not available
                      </span>
                    )}
                  </td>

                  {/* Actions to delete and Edit */}
                  <td className="flex gap-x-4">
                    <button
                      onClick={() => {
                        handleEdit(car);
                        (
                          document.getElementById(
                            "update_modal"
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                      className="btn btn-sm text-blue-400 hover:text-blue-600 cursor-pointer"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setDelSelectCar(car);
                        (
                          document.getElementById(
                            "delete_modal"
                          ) as HTMLDialogElement
                        ).showModal();
                      }}
                      className="btn btn-sm text-rose-400 hover:text-rose-500 cursor-pointer"
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No cars found</p>
      )}
    </div>
  );
};

export default Cars;
