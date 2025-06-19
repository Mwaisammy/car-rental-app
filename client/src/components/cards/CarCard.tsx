import React from "react";

type CarType = {
  car: {
    carModel: string;
    year: string;
    color: string;
    rentalRate: string;
    availability: boolean;
    locationID: number;
  };
};

const CarCard = ({
  car: { carModel, year, color, rentalRate, availability, locationID },
}: CarType) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-blue-400 text-white p-8 rounded-md shadow-2xl">
        <ul>
          <li>Car model: {carModel}</li>
          <li>Year of manufacture: {year}</li>
          <li>Color: {color}</li>
          <li>Rental rate: {rentalRate}%</li>
          <li>Availabilty: {availability ? availability : "undefined"}</li>
          <li>LocationID: {locationID}</li>
        </ul>
      </div>
    </div>
  );
};

export default CarCard;
