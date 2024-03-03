"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { IconType } from "react-icons";
import {
  FaHouse,
  FaTrophy,
  FaHeart,
  FaTrain,
  FaWandSparkles,
  FaInfo,
  FaPerson,
} from "react-icons/fa6";

interface NavItem {
  href: string;
  icon: IconType;
  title: string;
  iconColor?: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: FaHouse, title: "Home" },
  { href: "/rankings", icon: FaTrophy, title: "Rankings" },
  { href: "/likes", icon: FaHeart, title: "Favorites" },
  { href: "/about", icon: FaInfo, title: "About" },
  { href: "/profile", icon: FaPerson, title: "Profile" },
];

// include isAuthed in the props
interface SidebarProps {
  isAuthed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAuthed }) => {
  const pathname = usePathname(); // Use usePathname to get the current path

  return (
    <div
      className="w-64 h-full flex items-center py-8 fixed left-0 top-0 bottom-0"
      style={{ marginLeft: "10px", marginRight: "10px" }}
    >
      <div className="bg-white shadow-lg rounded-lg m-10 p-5 flex flex-col items-center w-full h-full">
        <div className="mb-5">
          <FaTrain className="text-4xl text-blue-500" />
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-semibold">Prompt Lib</h2>
        </div>
        <nav className="flex-1 w-full">
          {navItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div
                className={`flex flex-col items-center p-3 m-5 rounded-lg cursor-pointer ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-300 to-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="text-2xl" />
                <span className="mt-2 text-sm">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          {(!isAuthed && (
            <a
              href="/api/auth/login"
              className="w-32 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaWandSparkles className="inline mr-2" />
              Sign in
            </a>
          )) || (
            <a
              href="/api/auth/logout"
              className="w-32 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Logout
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
