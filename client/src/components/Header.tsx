import { Link } from 'react-router-dom';
import { useTheme } from './ui/theme-provider';
import { Button } from './ui/button';
import { Sun, Moon, GamepadIcon } from 'lucide-react';

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <GamepadIcon className="h-6 w-6" />
          <span>GameHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/games/incremental" className="text-sm font-medium hover:text-primary transition-colors">
            Clicker Game
          </Link>
          <Link to="/games/chess" className="text-sm font-medium hover:text-primary transition-colors">
            Chess Game
          </Link>
          <Link to="/games/driving" className="text-sm font-medium hover:text-primary transition-colors">
            Driving Game
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
