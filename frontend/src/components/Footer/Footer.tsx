import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="bg-[#B71C1C] text-white py-4 w-full mt-auto">
      <div className="text-center flex flex-col space-y-1 text-white text-xs sm:text-sm">
        <p>SGPPD - Sistema de Gestión de Pacientes Pie Diabético</p>
        <p>Versión 0.0.1</p>
        <p>Copyright &copy; 2025 - Todos los derechos reservados</p>
        <p>
          <a
            href="privacy-policy.html"
            className="text-white hover:text-sky-300 transition-transform hover:scale-110 duration-300"
          >
            Política de Privacidad
          </a>
          {" | "}
          <a
            href="terms-conditions.html"
            className="text-white hover:text-sky-300 transition-transform hover:scale-105 duration-300"
          >
            Términos y Condiciones
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
