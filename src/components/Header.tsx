import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Admissions", path: "/admissions" },
    { name: "Courses", path: "/#courses" },
    { name: "Placements", path: "/#placements" },
    { name: "About Us", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const isActive = (path: string) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.split("#")[1];
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" role="navigation" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <GraduationCap className="h-8 w-8 text-primary" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-primary">BMIET</span>
            <span className="text-xs text-muted-foreground">Excellence in Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path) ? "text-primary" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/dashboard">
            <Button variant="default" size="sm">Student Portal</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden animate-fade-in">
          <div className="container mx-auto flex flex-col space-y-3 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" size="sm" className="w-full">Student Portal</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
