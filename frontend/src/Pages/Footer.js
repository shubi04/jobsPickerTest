import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center text-white py-3"
      style={{
        background: "linear-gradient(135deg,#1e3c72,#2a5298)"
      }}
    >
      <div className="container">
        <p className="mb-0">
          © {new Date().getFullYear()} Amdox Technologies 🚀 | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;