import React from "react";
import Personaje from "../../../assets/personaje.png";
import Logo from "../../../assets/logo2.png";

const Hero: React.FC = () => {
  return (
    <section className="min-h-[calc(100vh-124px)] flex items-center justify-center text-white">

      <div className="grid grid-cols-1 md:grid-cols-2 items-center px-8 py-4">
        <div className="flex flex-col items-center text-center gap-y-4">
          <img className="w-[400px] md:w-[500px] mt-20" src={Logo} alt="Logo2-app" />

          <p className="text-black px-4 py-2 max-w-2xl">
            El pie diabético puede presentar señales tempranas que no deben
            ignorarse, como la pérdida de sensibilidad, cambios en la piel,
            heridas que tardan en sanar, infecciones recurrentes, deformidades
            en los pies y problemas de circulación. La detección temprana es
            clave para prevenir complicaciones graves, por lo que es importante
            revisar los pies a diario y acudir al médico ante cualquier
            anomalía.
          </p>

          <details className="max-w-2xl mx-auto my-1 bg-red-600 p-2 rounded-lg shadow-md">
            <summary className="cursor-pointer text-white font-semibold">
              📹 Ver video
            </summary>
            <div className="mt-2 flex justify-center">
              <iframe
                className="w-full h-64 rounded-lg"
                src="https://www.youtube.com/embed/NREJIZ1h7FE"
                title="6 señales tempranas de pie diabético"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </details>

          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://www.youtube.com/results?search_query=Cómo+prevenir+el+pie+diabético"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 flex items-center gap-2"
            >
              Ver más <i className="bi bi-arrow-right-square-fill"></i>
            </a>
          </div>

          <p className="text-black px-4 py-2 max-w-2xl">
            El pie diabético es una complicación grave de la diabetes que puede
            provocar infecciones, úlceras y, en casos extremos, amputaciones.
            Identificar síntomas como hinchazón, enrojecimiento, heridas que no
            cicatrizan o pérdida de sensibilidad es clave para un tratamiento
            oportuno y evitar complicaciones mayores.
          </p>

          <div className="flex justify-center gap-4 my-2">
            <a
              target="_blank"
              href="https://www.onsalus.com/pie-diabetico-causas-sintomas-y-tratamiento-17105.html"
              className="text-red-600 flex items-center gap-2"
            >
              Saber más <i className="bi bi-arrow-right-square-fill"></i>
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            className="max-w-xs md:max-w-md"
            src={Personaje}
            alt="Personaje-app"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
