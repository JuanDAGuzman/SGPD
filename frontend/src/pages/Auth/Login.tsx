import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import Footer from "../../components/Footer/Footer"; 

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;