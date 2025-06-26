import Bentley from "../../assets/bentley-ice.jpg";

const About = () => {
  return (
    <div className="flex flex-col items-center px-4 ">
      <div className="mt-4 mb-5">
        <h2 className=" text-l md:text-2xl font-semibold tracking-wider relative inline-block after:block after:mx-auto after:mt-1 after:h-[3px] after:w-14 after:bg-blue-500 ">
          About Us
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center">
        <div className="flex w-full md:w-1/2">
          <img
            src={Bentley}
            alt="bently"
            className="h-[90vh] w-full object-cover "
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-10 ">
          <p className="text-gray-700 text-center">
            At DriveNow Rentals, we’re committed to making your journey smooth,
            affordable, and stress-free. With a wide selection of vehicles
            ranging from compact cars to premium SUVs, we provide flexible
            rental options to suit every lifestyle and budget. Whether you're
            traveling for business, exploring new destinations, or simply need a
            ride, our mission is to deliver reliable service, transparent
            pricing, and a seamless booking experience—every time.
          </p>

          <button className=" bg-blue-500 transition-all duration-300 ease-in-out hover:bg-rose-500  cursor-pointer text-white px-8 py-3 mt-4  ">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
