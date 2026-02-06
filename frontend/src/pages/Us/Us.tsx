import React from "react";
import Navbar from "../../components/NavBar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroUs from "../Us/Hero/HeroUs";


const Us: React.FC = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroUs></HeroUs>
      <Footer></Footer>
    </div>
  );
};

export default Us;
