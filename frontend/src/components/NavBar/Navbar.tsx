import React, { useState } from "react";


const navbarlinks = [
  {
    id: 1,
    tittle: "Inicio",
    link: "/",
  },
  {
    id: 2,
    tittle: "Nosotros",
    link: "/Us",
  },
  {
    id: 3,
    tittle: "Contacto",
    link: "/Contact",
  },
  {
    id: 4,
    tittle: "Soporte",
    link: "/Support",
  },
];

const navbarRedes = [
  {
    id: 1,
    tittle: "DevJuan",
    link: "https://github.com/JuanDAGuzman",
    icon: "bi bi-github",
  },
  {
    id: 2,
    tittle: "DevCamilo",
    link: "https://github.com/CamAGomezB27",
    icon: "bi bi-github",
  },
];
const navbarSignIn = [
  {
    id: 1,
    tittle: "Inicia sesión",
    link: "/login",
    icon: "bi bi-box-arrow-in-right",
  },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#B71C1C] shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center sm:px-12 sm:py-6 px-4 py-3">
        <div>
          <h1 className="text-white font-bold text-2xl">UMB</h1>
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L16 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden md:flex justify-center items-center">
          <ul className="flex sm:space-x-8 space-x-4">
            {navbarlinks.map((link) => (
              <li key={link.id}>
                <a
                  className="text-white text-sm sm:text-lg hover:text-sky-300 transition-transform hover:scale-110 transform inline-block duration-300"
                  href={link.link}
                >
                  {link.tittle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <ul className="flex space-x-4">
            {navbarSignIn.map((link) => (
              <li key={link.id}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform duration:300 transform hover:scale-125"
                  href={link.link}
                >
                  <i
                    className={`${link.icon} sm:text-2xl text-lg text-white hover:text-sky-300 transition-all duration-300`}
                  ></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`md:hidden absolute w-full bg-[#B71C1C] transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex justify-center content-center">
          {navbarSignIn.map((link) => (
            <li key={link.id}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform duration:300 transform hover:scale-125"
                href={link.link}
              >
                <i
                  className={`${link.icon} sm:text-2xl text-lg text-white hover:text-sky-300 transition-all duration-300`}
                ></i>
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col px-4 py-2">
          {navbarlinks.map((link) => (
            <li key={link.id} className="py-2 text-center">
              <a
                className="text-white hover:text-sky-300 "
                href={link.link}
                onClick={() => setIsOpen(false)}
              >
                {link.tittle}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex space-x-4 px-4 py-2 border-t border-white justify-center">
          {navbarRedes.map((link) => (
            <li key={link.id}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                href={link.link}
              >
                <i
                  className={`${link.icon} text-lg text-white hover:text-sky-300 `}
                ></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
