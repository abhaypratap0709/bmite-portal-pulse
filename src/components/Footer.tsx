import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "You've been added to our newsletter.",
      });
      setEmail("");
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
    <footer className="border-t bg-card" role="contentinfo">
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
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
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
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
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
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>BMIET Campus, Education District, City, State 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@bmiet.edu.in</span>
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
                <Button type="submit" size="sm">Subscribe</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bhagwan Mahaveer Institute of Engineering & Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
