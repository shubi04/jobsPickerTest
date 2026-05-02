// import React from "react";
// import Navbar from "./Navbar";

// const AboutUs = () => {
//   return (
//     <div>
//         <Navbar/>
    
//     <div style={{ background: "#0b1220", minHeight: "100vh", color: "#fff" }}>
      
//       {/* HERO SECTION */}
//       <div
//         className="text-center d-flex flex-column justify-content-center align-items-center"
//         style={{
//           height: "40vh",
//           background: "linear-gradient(135deg,#111827,#1f2937)",
//           borderBottom: "1px solid rgba(255,255,255,0.1)",
//         }}
//       >
//         <h1 className="fw-bold" style={{ fontSize: "48px" }}>
//           Amdox Technologies
//         </h1>
//         <p style={{ fontSize: "18px", color: "#9ca3af" }}>
//           Building Future-Ready Digital Solutions 🚀
//         </p>
//       </div>

//       {/* CONTENT SECTION */}
//       <div className="container py-5">

//         {/* ABOUT */}
//         <div className="row mb-5">
//           <div className="col-md-6">
//             <h2 className="fw-bold text-info">Who We Are</h2>
//             <p style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
//               <b>Amdox Technologies</b> is a modern IT solutions company focused
//               on delivering high-performance digital products. We specialize in
//               web development, mobile applications, and enterprise software
//               solutions that help businesses grow faster and smarter.
//             </p>
//           </div>

//           <div className="col-md-6">
//             <div
//               style={{
//                 background: "#111827",
//                 padding: "25px",
//                 borderRadius: "15px",
//                 border: "1px solid rgba(255,255,255,0.1)",
//               }}
//             >
//               <h5 className="text-warning">🔥 Our Vision</h5>
//               <p style={{ color: "#cbd5e1" }}>
//                 To become a global leader in innovative digital transformation
//                 solutions.
//               </p>

//               <h5 className="text-warning mt-3">🎯 Our Mission</h5>
//               <p style={{ color: "#cbd5e1" }}>
//                 To empower businesses with scalable, secure, and modern
//                 technology solutions.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SERVICES */}
//         <h2 className="fw-bold text-center mb-4 text-info">
//           What We Do
//         </h2>

//         <div className="row text-center">
//           {[
//             { title: "Web Development", icon: "💻" },
//             { title: "Mobile Apps", icon: "📱" },
//             { title: "UI/UX Design", icon: "🎨" },
//             { title: "Cloud Solutions", icon: "☁️" },
//           ].map((item, index) => (
//             <div className="col-md-3 mb-3" key={index}>
//               <div
//                 style={{
//                   background: "#111827",
//                   padding: "25px",
//                   borderRadius: "15px",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   transition: "0.3s",
//                   cursor: "pointer",
//                 }}
//               >
//                 <div style={{ fontSize: "30px" }}>{item.icon}</div>
//                 <h6 className="mt-2">{item.title}</h6>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* WHY CHOOSE US */}
//         <div className="mt-5">
//           <h2 className="fw-bold text-info text-center mb-4">
//             Why Choose Amdox?
//           </h2>

//           <div className="row text-center">
//             <div className="col-md-4 mb-3">
//               <h5>⚡ Fast Delivery</h5>
//               <p style={{ color: "#9ca3af" }}>
//                 We deliver projects on time with high quality.
//               </p>
//             </div>

//             <div className="col-md-4 mb-3">
//               <h5>🔒 Secure Systems</h5>
//               <p style={{ color: "#9ca3af" }}>
//                 Security is our top priority in every project.
//               </p>
//             </div>

//             <div className="col-md-4 mb-3">
//               <h5>🚀 Modern Tech Stack</h5>
//               <p style={{ color: "#9ca3af" }}>
//                 React, Node, AI tools & cloud-based architecture.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="text-center mt-5">
//           <button
//             className="btn btn-info px-4 py-2 fw-bold"
//             style={{ borderRadius: "30px" }}
//           >
//             Contact Us 🚀
//           </button>
//         </div>

//       </div>
//     </div>
//     </div>
//   );
// };

// export default AboutUs;


import React from "react";
import Navbar from "./Navbar";

const AboutUs = () => {
  return (
    <div>
      <Navbar />

      <div style={{ background: "#0b1220", minHeight: "100vh", color: "#fff" }}>
        
        {/* HERO SECTION */}
        <div
          className="text-center d-flex flex-column justify-content-center align-items-center"
          style={{
            height: "40vh",
            background: "linear-gradient(135deg,#111827,#1f2937)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1 className="fw-bold" style={{ fontSize: "48px" }}>
            Smart Hire
          </h1>
          <p style={{ fontSize: "18px", color: "#9ca3af" }}>
            Connecting Talent with the Right Opportunities 💼
          </p>
        </div>

        {/* CONTENT SECTION */}
        <div className="container py-5">

          {/* ABOUT */}
          <div className="row mb-5">
            <div className="col-md-6">
              <h2 className="fw-bold text-info">Who We Are</h2>
              <p style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
                <b>Smart Hire</b> is a modern career platform designed to
                connect job seekers with the right opportunities. Our platform
                helps candidates explore jobs, build strong profiles, and apply
                to companies easily while helping recruiters find the right
                talent faster.
              </p>
            </div>

            <div className="col-md-6">
              <div
                style={{
                  background: "#111827",
                  padding: "25px",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h5 className="text-warning">🔥 Our Vision</h5>
                <p style={{ color: "#cbd5e1" }}>
                  To become a trusted career platform where talent meets the
                  best opportunities.
                </p>

                <h5 className="text-warning mt-3">🎯 Our Mission</h5>
                <p style={{ color: "#cbd5e1" }}>
                  To simplify the hiring process by connecting skilled
                  candidates with companies through a smart and easy-to-use
                  platform.
                </p>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <h2 className="fw-bold text-center mb-4 text-info">
            What Smart Hire Offers
          </h2>

          <div className="row text-center">
            {[
              { title: "Job Listings", icon: "💼" },
              { title: "Easy Applications", icon: "📄" },
              { title: "Profile Building", icon: "👤" },
              { title: "Career Opportunities", icon: "🚀" },
            ].map((item, index) => (
              <div className="col-md-3 mb-3" key={index}>
                <div
                  style={{
                    background: "#111827",
                    padding: "25px",
                    borderRadius: "15px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "0.3s",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "30px" }}>{item.icon}</div>
                  <h6 className="mt-2">{item.title}</h6>
                </div>
              </div>
            ))}
          </div>

          {/* WHY CHOOSE US */}
          <div className="mt-5">
            <h2 className="fw-bold text-info text-center mb-4">
              Why Choose Smart Hire?
            </h2>

            <div className="row text-center">
              <div className="col-md-4 mb-3">
                <h5>⚡ Easy Job Search</h5>
                <p style={{ color: "#9ca3af" }}>
                  Find the right job quickly with our smart search system.
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <h5>🔒 Secure Platform</h5>
                <p style={{ color: "#9ca3af" }}>
                  Your data and profile information remain safe and protected.
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <h5>🚀 Career Growth</h5>
                <p style={{ color: "#9ca3af" }}>
                  Discover opportunities that help you grow professionally.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-5">
            <button
              className="btn btn-info px-4 py-2 fw-bold"
              style={{ borderRadius: "30px" }}
            >
              Explore Jobs 🚀
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;