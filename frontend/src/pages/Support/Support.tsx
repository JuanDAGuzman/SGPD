import React from "react";
import HeroSupp from "./HeroSupp.tsx/HeroSupp";
import Navbar from "../../components/NavBar/Navbar";
import Footer from "../../components/Footer/Footer";

const Support: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="flex-grow">
        <HeroSupp />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Support;