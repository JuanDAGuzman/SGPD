import React from "react";

const developers = [
  {
    name: "Juan Diego Arevalo",
    linkedin: "https://www.linkedin.com/in/juanagdev",
    github: "https://github.com/JuanDAGuzman",
    info: "Ingeniero en Desarrollo de Software | Desarrollo Web y Backend | Integración de sistemas, bases de datos y desarrollo de APIs",
  },
  {
    name: "Camilo Andres Gomez",
    linkedin: "https://www.linkedin.com/in/camilogdev/",
    github: "https://github.com/CamAGomezB27",
    info: "Ingeniero en Desarrollo de Software en formación | Desarrollo Web, Bases de Datos & BI | Dominio en JavaScript, Python, HTML, CSS, MySQL | Enfocado en Soluciones Innovadoras",
  },
  {
    name: "Felipe Cruz",
    linkedin: "https://www.linkedin.com/in/felipe-cruz-351115213",
    github: "https://github.com/carlosramirez",
    info: "Desarrollador Backend enfocado en APIs con Express y MongoDB.",
  },
];

const HeroUs: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-96px-30px)] py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Nosotros</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {developers.map((dev, index) => (
          <div
            key={index}
            className="bg-white shadow-lg p-6 rounded-lg w-72 text-center border border-gray-200 transition-all duration-300 hover:bg-sky-100 hover:shadow-xl"
          >
            <i className="bi bi-github text-4xl text-gray-900"></i>
            <h2 className="text-xl font-semibold mt-2">{dev.name}</h2>
            <p className="text-gray-600 text-sm mt-2">{dev.info}</p>
            {/* Enlace de GitHub */}

            <a
            
              href={dev.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[#B71C1C]  font-semibold transition-transform hover:scale-110 duration-300"
            >
              Ver perfil en GitHub
            </a>
            {/* Enlace de LinkedIn */}
            <a
              href={dev.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[#0077B5] font-semibold transition-transform hover:scale-110 duration-300"
            >
              Ver perfil de LinkedIn
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroUs;
