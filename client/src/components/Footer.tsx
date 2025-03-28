import { Link } from 'react-router-dom';
import { GamepadIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <GamepadIcon className="h-5 w-5" />
          <p className="text-sm leading-loose text-center md:text-left">
            &copy; {new Date().getFullYear()} GameHub. All rights reserved.
          </p>
        </div>
        
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/games/incremental" className="hover:text-primary transition-colors">
            Clicker Game
          </Link>
          <Link to="/games/chess" className="hover:text-primary transition-colors">
            Chess Game
          </Link>
          <Link to="/games/driving" className="hover:text-primary transition-colors">
            Driving Game
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
