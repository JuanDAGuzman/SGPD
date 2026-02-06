import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { ChevronDown, ChevronUp } from "lucide-react";

const HeroSupp: React.FC = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Enviar mensaje a Soporte Técnico
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL,
          to_name: "Soporte Técnico",
          from_name: formData.from_name,
          reply_to: formData.reply_to,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Enviar confirmación al usuario
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION,
        {
          to_email: formData.reply_to,
          to_name: formData.from_name,
          from_name: "Soporte Técnico",
          reply_to: "sgppdumb@gmail.com",
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatusMessage("✅ Mensaje enviado con éxito. Revisa tu correo.");
      setFormData({ from_name: "", reply_to: "", message: "" });

      setTimeout(() => setStatusMessage(""), 5000);
    } catch (error) {
      setStatusMessage("❌ Error al enviar el mensaje. Revisa EmailJS.");
      console.error("Error en EmailJS:", error);

      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  return (
    <div className="mt-20 container mx-auto py-10 px-4 flex-grow">
      <h1 className="text-3xl font-bold text-center mb-8">Soporte</h1>

      {/* Sección de Preguntas Frecuentes */}
      <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="border p-4 rounded-md">
            <summary className="font-semibold cursor-pointer">
              📌 ¿Cómo puedo registrarme como paciente?
            </summary>
            <p className="mt-2">
              Solo debes enviar el formulario de consulta. Luego, un
              especialista te asignará una cita de valoración.
            </p>
          </details>
          <details className="border p-4 rounded-md">
            <summary className="font-semibold cursor-pointer">
              📌 ¿Cuándo tendré acceso a la plataforma?
            </summary>
            <p className="mt-2">
              Una vez realizada tu valoración, tu perfil será creado por un
              médico y podrás acceder a tus resultados y videoconsultas.
            </p>
          </details>
          <details className="border p-4 rounded-md">
            <summary className="font-semibold cursor-pointer">
              📌 ¿Cómo puedo consultar mis resultados médicos?
            </summary>
            <p className="mt-2">
              Puedes ingresar a la plataforma con tu usuario y revisar los
              informes disponibles en tu perfil.
            </p>
          </details>
          <details className="border p-4 rounded-md">
            <summary className="font-semibold cursor-pointer">
              📌 ¿Puedo agendar una videocita con mi médico?
            </summary>
            <p className="mt-2">
              Sí, si tu médico lo permite, podrás acceder a videoconsultas desde
              la plataforma.
            </p>
          </details>
        </div>
      </div>

      {/* Botón para desplegar el formulario con indicador visual */}
      <div className="text-center relative">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-red-600 text-white font-bold px-6 py-2 rounded-md hover:scale-110 transition flex items-center justify-center mx-auto space-x-2 group"
        >
          <span>{isFormOpen ? "Cerrar Formulario" : "Envíanos tu consulta"}</span>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 transition-transform group-hover:scale-110" />
          ) : (
            <ChevronDown className="w-5 h-5 transition-transform group-hover:scale-110 animate-bounce" />
          )}
        </button>
        {!isFormOpen && (
          <div className="absolute w-full text-center mt-2">
            <p className="text-sm text-gray-600 animate-pulse">
              Haz clic para expandir el formulario
            </p>
          </div>
        )}
      </div>

      {/* Sección de Formulario de Soporte (Desplegable) */}
      <div
        className={`max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-md mt-4 transition-all duration-500 overflow-hidden ${
          isFormOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Formulario de Soporte</h2>

        {statusMessage && (
          <p className="text-center font-medium">{statusMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="from_name"
            placeholder="Tu nombre"
            required
            value={formData.from_name}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="email"
            name="reply_to"
            placeholder="Tu correo electrónico"
            required
            value={formData.reply_to}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <textarea
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="border p-2 rounded-md"
          ></textarea>
          <button
            type="submit"
            className="bg-red-600 text-white font-bold px-4 py-2 rounded-md 
             hover:scale-105 transition-transform duration-300"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSupp;