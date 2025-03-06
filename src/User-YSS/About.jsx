import React from 'react';
import backgroundpicture  from '../../src/assets/About-Images/BackgroundAboutUsimage.png';

function About() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-9"> {/* Added pt-16 to account for navbar height */}
      {/* Main Wrapper to Center Content */}
      <div className="mx-auto">
        {/* About Us Section */}
        <div className="py-16 px-6 lg:px-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 uppercase mb-6 font-cousine">About Us</h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-poppins">
              <span className="italic">Welcome to Young Soul Seekers</span> – At Young Soul Seekers, we believe that faith and fashion go hand in hand. Our mission is to inspire, empower, and uplift individuals through clothing that reflects God’s love and teachings. Each piece in our collection is thoughtfully designed to carry messages of hope, encouragement, and strength, making it more than just apparel—it’s a testament of faith.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-poppins">
              Our tagline, <span className="font-semibold">“Confidently Wear God’s Word”</span>, captures the essence of what we stand for. We want our customers to feel confident not only in their style but also in their identity as followers of Christ.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-poppins">
              Thank you for being part of our journey. Together, let’s confidently wear God’s Word and make a difference, one outfit at a time!
            </p>
          </div>
        </div>

        {/* Mission and Vision Section */}
        <div className="relative w-full py-16 mb-10">
          {/* Background Image with Darker Overlay */}
          <div className="absolute inset-0 w-full h-full z-0 ">
            <img
              src={backgroundpicture}
              alt="Mission and Vision Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Darker overlay */}
          </div>

          {/* Content Centered */}
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="text-center">
              <h2 className="text-2xl font-bold uppercase mb-4 text-white font-cousine">Our Mission</h2>
              <p className="text-lg leading-relaxed text-white italic">
                Young Soul Seekers exists to inspire and uplift through faith-driven apparel that reflects God’s love. We aim to create clothing that empowers individuals to boldly live out their beliefs while spreading messages of hope, strength, and encouragement.
              </p>
            </div>
            {/* Vision */}
            <div className="text-center">
              <h2 className="text-2xl font-bold uppercase mb-4 text-white font-cousine">Our Vision</h2>
              <p className="text-lg leading-relaxed text-white italic">
                We strive to be a faith-based brand that bridges fashion and faith, empowering individuals to confidently wear God’s Word. Our vision is to inspire a movement of positivity and Gospel-centered living, touching lives one design at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
