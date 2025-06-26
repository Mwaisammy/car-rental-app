import carImage from "../../assets/cars.jpg";

const Hero = () => {
  return (
    // If you're using Vite/React, import the image:

    <div
      className="hero min-h-screen relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${carImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content */}
      <div className="hero-content text-center relative z-10 text-white">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Find Your Perfect Ride</h1>
          <p className="mb-5">
            Explore a wide range of rental cars for every need — from
            budget-friendly options to luxury rides. Easy booking, flexible
            plans, and reliable service at your fingertips.
          </p>
          <button className="rounded-md py-2 px-3 border-2 border-blue-400">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
