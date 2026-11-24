import { Lightbulb } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-3">

      <Lightbulb size={30} className="text-yellow-500" />

      <h1 className="text-2xl font-bold text-gray-800">
        My Notes
      </h1>

      <span className="text-sm text-gray-400 ml-auto">
        Keep your ideas safe
      </span>

    </header>
  );
}

export default Header;