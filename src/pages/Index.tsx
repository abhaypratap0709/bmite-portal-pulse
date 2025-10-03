import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import PlacementHighlights from "@/components/home/PlacementHighlights";
import LatestNews from "@/components/home/LatestNews";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedCourses />
        <PlacementHighlights />
        <LatestNews />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
