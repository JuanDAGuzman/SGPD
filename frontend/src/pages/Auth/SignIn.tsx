import React from "react";
import SignInForm from "../../components/SignInForm/SignInForm";
import Footer from "../../components/Footer/Footer"; 

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <SignInForm />
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;