import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const ContactUs = () => {
    const navigate = useNavigate();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #d8b4fe, #a5b4fc, #fbcfe8)",
        minHeight: "100vh",
        color: "#1f2937",
        padding: "40px 0",
      }}
    >

      <div className="container">
              <div className="text-center mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard 🏠
        </button>
      </div>



        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">Contact Us</h2>
          <p style={{ color: "#4b5563" }}>
            We are here to help you. Let’s connect 🚀
          </p>
        </div>

        <div className="row g-3">

          {/* FORM SECTION */}
          <div className="col-md-6">
            <div
              style={{
                background: "#f3f4f6",
                padding: "25px",
                borderRadius: "20px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              }}
            >
              <h4 className="text-primary mb-3">📩 Get in Touch</h4>

              <form action="https://formspree.io/f/mgvarzkg" method="POST">

                <div className="mb-2">
                  <label className="form-label text-dark">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    style={{
                      background: "#e5e7eb",
                      color: "#1f2937",
                      border: "1px solid #d1d5db",
                      borderRadius: "12px",
                      padding: "7px"
                    }}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label text-dark">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    style={{
                      background: "#e5e7eb",
                      color: "#1f2937",
                      border: "1px solid #d1d5db",
                      borderRadius: "12px",
                      padding: "7px"
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-dark">Message</label>
                  <textarea
                    name="message"
                    rows="2"
                    className="form-control"
                    placeholder="Type your message..."
                    style={{
                      background: "#e5e7eb",
                      color: "#1f2937",
                      border: "1px solid #d1d5db",
                      borderRadius: "12px",
                      padding: "7px"
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{
                    borderRadius: "15px",
                    background: "linear-gradient(135deg, #6366f1, #f9a8d4)",
                    border: "none",
                    color: "#fff",
                    padding: "12px",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
                  onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}
                >
                  🚀 Send Message
                </button>
              </form>
            </div>
          </div>

          {/* INFO + MAP SECTION */}
          <div className="col-md-6">

            {/* INFO CARD */}
            <div
              style={{
                background: "#f3f4f6",
                padding: "25px",
                borderRadius: "20px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                marginBottom: "20px",
              }}
            >
              <h4 className="text-success">📍 Contact Info</h4>
              <p style={{ color: "#1f2937" }}>Smart Hire </p>
              <p style={{ color: "#1f2937" }}>📧 support@smarthire.com</p>
              <p style={{ color: "#1f2937" }}>📞 +91 98765 43210</p>
            </div>

            {/* MAP */}
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              }}
            >
              <iframe
                title="Google Map"
                className="w-100"
                height="400" // bigger map
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110335.77919811351!2d74.87628441344746!3d30.208744384410895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39173297173abbcd%3A0xa00033c0a58a5ac8!2sBathinda%2C%20Punjab!5e0!3m2!1sen!2sin!4v1776345399164!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </div>
<Footer/>
    </div>
  );
};

export default ContactUs;