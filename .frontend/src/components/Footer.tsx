import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import LoadingButton from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.includes("#")) {
      const hash = path.split("#")[1];
      const element = document.getElementById(hash);
      
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.location.hash = hash;
      }
    }
  };

    const quickLinks = [
      { name: "Home", path: "/" },
      { name: "Admissions", path: "/admissions" },
      { name: "Courses", path: "/#courses" },
      { name: "Placements", path: "/#placements" },
    ];

  const resources = [
    { name: "Student Portal", path: "/dashboard" },
    { name: "Faculty", path: "/#faculty" },
    { name: "Library", path: "/#library" },
    { name: "Research", path: "/#research" },
  ];

  return (
    <footer className="border-t bg-card" role="contentinfo" id="contact">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary">BMIET</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Bhagwan Mahaveer Institute of Engineering & Technology - Shaping future engineers with excellence in education and innovation.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground transition-colors hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    onClick={(e) => handleHashLink(e, link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    onClick={(e) => handleHashLink(e, link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" aria-hidden="true" />
                <span>BMIET Campus, Bundelkhand University Campus, Jhansi, Uttar Pradesh 284128</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>+91 0510 298 0001</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:info@bmiet.edu.in" className="hover:text-primary transition-colors">info@bmiet.edu.in</a>
              </li>
            </ul>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <h4 className="text-sm font-semibold">Newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  aria-label="Email for newsletter"
                />
                <LoadingButton 
                  type="submit" 
                  size="sm"
                  loading={loading}
                  loadingText="Subscribing..."
                >
                  Subscribe
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Bhagwan Mahaveer Institute of Engineering & Technology. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
