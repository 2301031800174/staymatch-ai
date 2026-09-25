// function Home() {
//   return (
//     <h1>Home Page</h1>
//   );
// }

// export default Home;

import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import FeaturedPG from "../../components/home/FeaturedPG";
import Testimonials from "../../components/home/Testimonials";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <FeaturedPG />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;