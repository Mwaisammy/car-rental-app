import { carsAPI, type TCar } from "../../../Features/cars/carsAPI";

const Cars = () => {
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
      {carsLoading && <p>Loading cars...</p>}
      {carError && <p className="text-rose-500">Error fetching todos</p>}
      {carsData && carsData.data && carsData.data.length > 0 ? (
        <div>
          {carsData.data.map((item: TCar) => (
            <h3>Model: {item.carModel}</h3>
          ))}
        </div>
      ) : (
        <p>No cars found</p>
      )}
    </div>
  );
};

export default Cars;
