import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, LogIn, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroImage from "@/assets/bg2.png";

const Hero = () => {
  const { t } = useTranslation();
  const [counters, setCounters] = useState({ courses: 0, alumni: 0, placements: 0 });
  
  const targets = { courses: 15, alumni: 5000, placements: 95 };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const incrementCounters = () => {
      setCounters((prev) => ({
        courses: Math.min(prev.courses + Math.ceil(targets.courses / steps), targets.courses),
        alumni: Math.min(prev.alumni + Math.ceil(targets.alumni / steps), targets.alumni),
        placements: Math.min(prev.placements + Math.ceil(targets.placements / steps), targets.placements),
      }));
    };

    const timer = setInterval(incrementCounters, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden" role="banner">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="BMIET Campus with students"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/75"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {t("hero.title")} <span className="text-secondary">BMIET</span>
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-wrap gap-4">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/dashboard">
                <LogIn className="mr-2 h-5 w-5" />
                Student Portal
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="group" asChild>
              <Link to="/admissions">
                <GraduationCap className="mr-2 h-5 w-5" />
                {t("hero.applyNow")}
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="group" asChild>
              <a href="#virtual-tour">
                <PlayCircle className="mr-2 h-5 w-5" />
                {t("hero.virtualTour")}
              </a>
            </Button>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-3 gap-6 md:gap-8">
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="mb-2 text-4xl font-bold text-secondary md:text-5xl animate-counter">
                {counters.courses}+
              </div>
              <div className="text-sm text-primary-foreground/80 md:text-base">{t("hero.courses")}</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="mb-2 text-4xl font-bold text-secondary md:text-5xl animate-counter">
                {counters.alumni.toLocaleString()}+
              </div>
              <div className="text-sm text-primary-foreground/80 md:text-base">{t("hero.alumni")}</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <div className="mb-2 text-4xl font-bold text-secondary md:text-5xl animate-counter">
                {counters.placements}%
              </div>
              <div className="text-sm text-primary-foreground/80 md:text-base">{t("hero.placementRate")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
