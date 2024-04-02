"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaHouse, FaHeart } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IconType } from "react-icons";

interface NavItem {
  href: string;
  title: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { href: "/", title: "Home", icon: FaHouse },
  { href: "/likes", title: "Favorites", icon: FaHeart },
];

interface HeaderProps {
  isAuthed: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthed }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to reset overflow when the component unmounts or menu toggles
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]); // Effect depends on isMenuOpen state

  return (
    <>
      <div className="flex justify-between items-center p-2 md:p-4 bg-white shadow-md w-full">
        <h2 className="text-lg md:text-xl font-semibold">Prompt Lib</h2>
        <div className="md:hidden">
          {isMenuOpen ? (
            <IoMdClose
              onClick={toggleMenu}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <FaBars onClick={toggleMenu} className="text-2xl cursor-pointer" />
          )}
        </div>
        <div
          className={`fixed inset-0 transform ${
            isMenuOpen ? "translate-x-0 bg-white" : "-translate-x-full"
          } md:translate-x-0 md:relative md:flex flex-col md:flex-row md:items-center w-64 h-full md:w-auto md:h-auto z-50 transition-transform duration-300 ease-in-out`}
        >
          <nav className="flex flex-col md:flex-row mt-10 md:mt-0">
            {navItems.map((item, index) => (
              <Link href={item.href} key={index}>
                <div
                  className={`shadow-lg flex items-center justify-center md:justify-start text-center p-3 my-4 md:my-0 mx-4 rounded-lg cursor-pointer ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-300 to-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="text-xl md:text-2xl mr-0 md:mr-2" />
                  <span className="ml-4 mt-2 md:mt-0 text-sm">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
          <a
            href={isAuthed ? "/api/auth/logout" : "/api/auth/login"}
            className="shadow-lg mx-4 md:mx-0 p-2 md:py-2 md:px-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer block text-center mt-4 md:mt-0 self-center"
          >
            {isAuthed ? "Logout" : "Sign in"}
          </a>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Header;
