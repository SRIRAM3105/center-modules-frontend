
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedInStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    checkLoggedInStatus();
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/registration', label: 'Registration' },
    { path: '/data-collection', label: 'Data Collection' },
    { path: '/provider-matching', label: 'Provider Matching' },
    { path: '/payment', label: 'Payment' },
    { path: '/monitoring', label: 'Monitoring' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 ease-apple',
        isScrolled
          ? 'py-3 bg-background/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-foreground"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-solar-400 to-eco-400 flex items-center justify-center">
              <span className="sr-only">Solar Community</span>
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">SolarCommunity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/registration">
                <Button 
                  variant="default" 
                  className="hidden md:flex button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                >
                  Get Started
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-md border-t border-border animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-3 rounded-lg font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:bg-accent/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/registration" className="mt-2">
                <Button 
                  variant="default" 
                  className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                >
                  Get Started
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
