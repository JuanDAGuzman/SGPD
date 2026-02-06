import React from "react";
import Navbar from "../../components/NavBar/Navbar";
import Hero from "./Hero/Hero";
import Footer from "../../components/Footer/Footer";

import "./home_module.css";
// import Fondo from "../../assets/prueba.png";

const Home: React.FC = () => {
  // const bgImagen = {
  //   backgroundImage: `url(${Fondo})`,
  //   backgroundRepeat: "no-repeat",
  //   backgroundPosition: "bottom",
  //   backgroundSize: "cover",
  //   position: "relative",
  // };

  return (
    <div>
      <Navbar />
      <Hero />
      <Footer></Footer>
    </div>
    //  style={bgImagen} className="overflow-hidden min-h-screen">
  );
};

export default Home;
