import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaChevronDown,
} from "react-icons/fa";

const ContactHero: React.FC = () => {
  const [isGithubMenuOpen, setIsGithubMenuOpen] = useState(false);
  const [isLinkedinMenuOpen, setIsLinkedinMenuOpen] = useState(false);

  const firstGithubLink = "https://github.com/JuanDAGuzman";
  const secondGithubLink = "https://github.com/CamAGomezB27";

  const firstLinkedinLink = "https://www.linkedin.com/in/juanagdev/";
  const secondLinkedinLink = "https://www.linkedin.com/in/camilogdev/";

  const toggleGithubMenu = () => {
    setIsGithubMenuOpen((prev) => !prev);
    setIsLinkedinMenuOpen(false); // Cerrar el menú de LinkedIn si está abierto
  };

  const toggleLinkedinMenu = () => {
    setIsLinkedinMenuOpen((prev) => !prev);
    setIsGithubMenuOpen(false); // Cerrar el menú de GitHub si está abierto
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8">Contáctanos</h1>
        <p className="text-black mb-10">
          ¿Tienes preguntas? Estamos aquí para ayudarte.
        </p>

        {/* Información de Contacto */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
            <FaEnvelope className="text-red-600 text-4xl mx-auto mb-2" />
            <h3 className="font-semibold">Soporte Técnico</h3>
            <p className="text-black">sgppdumb@gmail.com</p>
          </div>

          <div className="p-6 border rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
            <FaPhone className="text-red-600 text-4xl mx-auto mb-2" />
            <h3 className="font-semibold">Teléfono</h3>
            <p className="text-black">+57 123 456 7890</p>
          </div>

          <div className="p-6 border rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
            <FaMapMarkerAlt className="text-red-600 text-4xl mx-auto mb-2" />
            <h3 className="font-semibold">Ubicación</h3>
            <p className="text-black">Ciudad, <strong>Bogotá D.C</strong></p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Síguenos en redes sociales
          </h2>
          <div className="flex justify-center space-x-6 text-red-600 text-3xl">
            {/* Botón de GitHub */}
            <div className="relative">
              <button
                onClick={toggleGithubMenu}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
              >
                <FaGithub className="hover:scale-110 transition-transform duration-300" />
                <FaChevronDown className="text-xl transform transition-transform duration-300" />
              </button>

              {/* Menú desplegable de GitHub */}
              {isGithubMenuOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                  <a
                    href={firstGithubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaGithub className="mr-2" />
                    <span>GitHub JuanDev</span>
                  </a>
                  <a
                    href={secondGithubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaGithub className="mr-2" />
                    <span>GitHub CamiloDev</span>
                  </a>
                </div>
              )}
            </div>

            {/* Botón de LinkedIn */}
            <div className="relative">
              <button
                onClick={toggleLinkedinMenu}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
              >
                <FaLinkedin className="hover:scale-110 transition-transform duration-300" />
                <FaChevronDown className="text-xl transform transition-transform duration-300" />
              </button>

              {/* Menú desplegable de LinkedIn */}
              {isLinkedinMenuOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                  <a
                    href={firstLinkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaLinkedin className="mr-2" />
                    <span>LinkedIn JuanDev</span>
                  </a>
                  <a
                    href={secondLinkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaLinkedin className="mr-2" />
                    <span>LinkedIn CamiloDev</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;