import React, { useState } from "react";
import { Note } from "../../types/Note";
import NoteForm from "../NoteForm";
import NoteTable from "../NoteTable";

const NoteManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);

  const handleAddNote = (newNote: Note) => {
    if (noteToEdit) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === newNote.id ? newNote : note))
      );
      setNoteToEdit(undefined);
    } else {
      setNotes((prevNotes) => [
        ...prevNotes,
        { ...newNote, id: notes.length + 1 },
      ]);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note);
  };

  return (
    <div
      className="layout-column align-items-center justify-content-start"
      data-testid="note-manager"
    >
      <NoteForm onSubmit={handleAddNote} noteToEdit={noteToEdit} />
      <NoteTable
        notes={notes}
        onDelete={handleDeleteNote}
        onEdit={handleEditNote}
      />
    </div>
  );
};

export default NoteManager;
