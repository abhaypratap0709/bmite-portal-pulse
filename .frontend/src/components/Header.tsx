import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import bmietLogo from "@/assets/download.jpeg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin, isFaculty, isStudent, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicNavLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.admissions"), path: "/admissions" },
    { name: "Courses", path: "/courses" },
    { name: "News", path: "/news" },
    { name: "Announcements", path: "/announcements" },
    { name: t("nav.placements"), path: "/#placements" },
    { name: t("nav.aboutUs"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const authNavLinks = [
    { name: "Dashboard", path: "/dashboard" },
    ...(isStudent ? [{ name: "Profile", path: "/student/profile" }] : []),
    ...(isAdmin ? [{ name: "Admin", path: "/admin/dashboard" }] : []),
  ];

  const navLinks = isAuthenticated ? [...authNavLinks, ...publicNavLinks] : publicNavLinks;

  const isActive = (path: string) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.split("#")[1];
    }
    return location.pathname === path;
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" role="navigation" aria-label="Main navigation">
        <Link 
          to="/" 
          className="flex items-center gap-3 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
          aria-label="BMIET Home"
        >
          <img 
            src={bmietLogo} 
            alt="BMIET Logo" 
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-primary">BMIET</span>
            <span className="text-xs text-muted-foreground">Excellence in Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 lg:gap-6 xl:flex" role="menubar">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => handleHashLink(e, link.path)}
              className={`text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 ${
                isActive(link.path) ? "text-primary" : "text-foreground"
              }`}
              role="menuitem"
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Link to="/announcements">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`User menu for ${user?.profile.firstName} ${user?.profile.lastName}`}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {user?.profile.firstName} {user?.profile.lastName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user?.profile.firstName} {user?.profile.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs text-primary font-medium capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isStudent && (
                    <DropdownMenuItem asChild>
                      <Link to="/student/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="default" size="sm">{t("nav.studentPortal")}</Button>
              </Link>
            </div>
          )}
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background xl:hidden animate-fade-in shadow-lg">
          <div className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  handleHashLink(e, link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 p-2">
                    <User className="h-4 w-4" />
                    <div className="flex flex-col">
                      <p className="font-medium text-sm">
                        {user?.profile.firstName} {user?.profile.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">{t("nav.studentPortal")}</Button>
                </Link>
              </>
            )}
            <div className="flex justify-center pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
