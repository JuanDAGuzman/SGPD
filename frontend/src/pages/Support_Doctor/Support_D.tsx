import React from "react";
// import styles from "./sup.module.css" 
import { useNavigate } from "react-router-dom";
import HeroSupp_D from "./HeroSupp_D.tsx/HeroSupp_D";
import Navbar_G from "../../components/NavBars/Navbar_Globla";

const Support_D: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar_G 
        profileText='Nombre'
        profilePath=''
        profileImg='public/user.png'
        centerText='Aca te ayudaremos con tus dudas'
        menuItems={[]}
        onLogout={() => navigate('/list_patients')}
        logoutText='Regresar'
      />
      {/* Contenido principal */}
      <div className="flex-grow">
        <HeroSupp_D />
      </div>
    </div>
  );
};

export default Support_D;