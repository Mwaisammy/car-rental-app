import { useEffect, useState } from "react";
import CarCard from "./cards/CarCard";
import Loading from "./Loading/CarsLoading";

type Car = {
  carModel: string;
  year: string;
  color: string;
  rentalRate: string;
  availability: boolean;
  locationID: number;
};

const API_URL = `http://localhost:8081/cars`;

const FetchCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(API_URL);
        const result = await res.json();
        setCars(result.data);
      } catch (error) {
        console.log("Cars could not be fetched", error);
      }
    };

    fetchCars();
    setIsLoading(false);
  }, []);
  return (
    <div className="p-4 mt-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center tracking-wide underline underline-offset-5 decoration-2 decoration-blue-600">
        Cars
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {isLoading ? (
          <Loading />
        ) : cars ? (
          cars.map((car) => (
            <div key={car.locationID}>
              <CarCard car={car} />
            </div>
          ))
        ) : (
          <div>No cars found</div>
        )}
      </div>
    </div>
  );
};

export default FetchCars;
