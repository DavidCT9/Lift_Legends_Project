import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Trophy, Dumbbell, LogOut} from 'lucide-react';

const NavItem = ({ to, icon: Icon, isActive }: { to: string; icon: typeof Home; isActive: boolean }) => (
  <Link to={to} className={`flex items-center justify-center w-14 h-14 rounded-full ${isActive ? 'bg-blue-950 text-white' : 'bg-white text-gray-600'} transition-colors duration-300`}>
    <Icon size={24} />
  </Link>
);

export const Navbar = ({ currentPath }: { currentPath: string }) => {
  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-full p-2 shadow-lg">
      <div className="flex space-x-5">
        <NavItem to="/home" icon={Home} isActive={currentPath === '/home'} />
        <NavItem to="/market" icon={ShoppingBag} isActive={currentPath === '/market'} />
        <NavItem to="/leagues" icon={Trophy} isActive={currentPath === '/leagues'} />
        <NavItem to="/weights" icon={Dumbbell} isActive={currentPath === '/weights'} />
        <NavItem to="/" icon={LogOut} isActive={currentPath === '/'} />
      </div>
    </nav>
  );
};

