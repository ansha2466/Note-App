import { Lightbulb, Archive, Trash2 } from 'lucide-react';

function Sidebar({ page, setPage }) {

  const items = [
    { name: 'Notes', icon: Lightbulb },
    { name: 'Archive', icon: Archive },
    { name: 'Trash', icon: Trash2 }
  ];

  return (
    <aside className="w-full md:w-52 bg-white p-4">

      <div className="flex md:flex-col gap-2">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setPage(item.name)}
              className={`flex items-center gap-3 p-3 rounded-full text-left flex-1 ${
                page === item.name
                  ? 'bg-yellow-100 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}

      </div>

    </aside>
  );
}

export default Sidebar;