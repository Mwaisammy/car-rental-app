import { FaCar } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType;
  link: string;
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "cars",
    name: "Cars",
    icon: FaCar,
    link: "cars",
  },
  {
    id: "users",
    name: "Users",
    icon: FaUsers,
    link: "users",
  },
  {
    id: "profile",
    name: "Profile",
    icon: FaUserCheck,
    link: "profile",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TbBrandGoogleAnalytics,
    link: "analytics",
  },
];
