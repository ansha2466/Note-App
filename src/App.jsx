
import { useEffect, useState } from 'react';
import {
  Pin,
  Archive,
  Trash2,
  Search,
  Plus,
  RotateCcw,
  Check,
  X,
  Pencil,
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [page, setPage] = useState('Notes');

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('my-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState('#ffffff');

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedNotes, setSelectedNotes] = useState([]);

  // Save notes in localStorage
  useEffect(() => {
    localStorage.setItem('my-notes', JSON.stringify(notes));
  }, [notes]);

  // Add or update note
  function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      alert('Please enter note content');
      return;
    }

    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    if (editingId) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingId
            ? {
                ...note,
                title,
                content,
                tags,
                color,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title,
        content,
        tags,
        color,
        pinned: false,
        archived: false,
        trashed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes(prev => [newNote, ...prev]);
    }

    clearForm();
  }

  // Clear form
  function clearForm() {
    setTitle('');
    setContent('');
    setTagInput('');
    setColor('#ffffff');
    setEditingId(null);
  }

  // Edit note
  function handleEdit(note) {
    setTitle(note.title);
    setContent(note.content);
    setTagInput(note.tags.join(', '));
    setColor(note.color);
    setEditingId(note.id);
  }

  // Pin note
  function handlePin(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
  }

  // Archive note
  function handleArchive(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, archived: !note.archived }
          : note
      )
    );
  }

  // Move note to trash
  function handleDelete(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, trashed: true }
          : note
      )
    );
  }

  // Restore note
  function handleRestore(id) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, trashed: false }
          : note
      )
    );
  }

  // Permanently delete note
  function handlePermanentDelete(id) {
    setNotes(prev => prev.filter(note => note.id !== id));
  }

  // Select notes
  function handleSelect(id) {
    setSelectedNotes(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }

  // Bulk delete
  function handleBulkDelete() {
    setNotes(prev =>
      prev.map(note =>
        selectedNotes.includes(note.id)
          ? { ...note, trashed: true }
          : note
      )
    );

    setSelectedNotes([]);
  }

  // Filter notes based on page
  let filteredNotes = notes.filter(note => {
    if (page === 'Notes') {
      return !note.archived && !note.trashed;
    }

    if (page === 'Archive') {
      return note.archived && !note.trashed;
    }

    if (page === 'Trash') {
      return note.trashed;
    }

    return false;
  });

  // Search notes
  filteredNotes = filteredNotes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(tag =>
      tag.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sort notes
  filteredNotes.sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Show pinned notes first
  if (page === 'Notes') {
    filteredNotes.sort((a, b) => b.pinned - a.pinned);
  }

  const colors = [
    '#ffffff',
    '#fee2e2',
    '#ffedd5',
    '#fef9c3',
    '#dcfce7',
    '#dbeafe',
    '#f3e8ff',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar page={page} setPage={setPage} />

        <main className="flex-1 p-5 md:p-8">

          {/* Search and Sort */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 flex-1">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="p-3 outline-none w-full"
              />
            </div>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border rounded-lg p-3 bg-white"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Note Form */}
          {page === 'Notes' && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 rounded-xl shadow-sm border mb-8 max-w-2xl"
            >
              <input
                type="text"
                placeholder="Title"
                value={title}
                maxLength={100}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xl font-semibold outline-none mb-3"
              />

              <textarea
                placeholder="Take a note..."
                value={content}
                maxLength={5000}
                onChange={e => setContent(e.target.value)}
                className="w-full min-h-28 outline-none resize-y"
              />

              <input
                type="text"
                placeholder="Tags (example: study, work)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="w-full border rounded-lg p-2 mt-3"
              />

              {/* Color Picker */}
              <div className="flex gap-3 mt-4">
                {colors.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    style={{ backgroundColor: item }}
                    className={`w-7 h-7 rounded-full border-2 ${
                      color === item
                        ? 'border-gray-800'
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-lg font-medium"
                >
                  {editingId ? 'Update Note' : 'Add Note'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="border px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Bulk Delete */}
          {selectedNotes.length > 0 && page !== 'Trash' && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mb-5"
            >
              Delete Selected ({selectedNotes.length})
            </button>
          )}

          {/* Notes Heading */}
          <h2 className="text-2xl font-bold mb-5">
            {page}
          </h2>

          {/* Notes List */}
          {filteredNotes.length === 0 ? (
            <p className="text-gray-400 text-center mt-16">
              No notes found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  style={{ backgroundColor: note.color }}
                  className="border rounded-xl p-4 shadow-sm break-words"
                >

                  {/* Note Header */}
                  <div className="flex justify-between items-start gap-2">
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => handleSelect(note.id)}
                    />

                    <h3 className="font-bold text-lg flex-1">
                      {note.title || 'Untitled'}
                    </h3>

                    {page !== 'Trash' && (
                      <button onClick={() => handlePin(note.id)}>
                        <Pin
                          size={18}
                          fill={note.pinned ? 'currentColor' : 'none'}
                        />
                      </button>
                    )}
                  </div>

                  {/* Note Content */}
                  <p className="my-4 whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(note.updatedAt).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 border-t pt-3">

                    {page === 'Trash' ? (
                      <>
                        <button
                          onClick={() => handleRestore(note.id)}
                          title="Restore"
                        >
                          <RotateCcw size={19} />
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(note.id)}
                          title="Delete permanently"
                        >
                          <Trash2 size={19} />
                        </button>
                      </>
                    ) : (
                      <>
                        {page === 'Notes' && (
                          <button
                            onClick={() => handleEdit(note)}
                            title="Edit"
                          >
                            <Pencil size={19} />
                          </button>
                        )}

                        <button
                          onClick={() => handleArchive(note.id)}
                          title="Archive"
                        >
                          <Archive size={19} />
                        </button>

                        <button
                          onClick={() => handleDelete(note.id)}
                          title="Delete"
                        >
                          <Trash2 size={19} />
                        </button>
                      </>
                    )}

                  </div>
                </div>
              ))}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
