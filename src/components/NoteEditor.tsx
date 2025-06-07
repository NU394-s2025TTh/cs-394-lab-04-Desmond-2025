// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';
// TODO: Import the saveNote function from your noteService call this to save the note to firebase
//import { saveNote } from '../services/noteService';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
// remove the eslint disable when you implement on save

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state

  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO: create state for saving status
  // TODO: createState for error handling
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = useRef(false);

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly

  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note
  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      // Reset to a brand‐new note if no initialNote is provided
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }
  }, [initialNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNote((prev) => ({
      ...prev,
      [name]: value,
      lastUpdated: Date.now(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setSaving(true);
    setError(null);

    try {
      // Update `lastUpdated` to now:
      const noteToSave: Note = { ...note, lastUpdated: Date.now() };
      await saveNote(noteToSave);
      if (onSave) {
        onSave(noteToSave);
      }
      // After saving, we could also clear fields if we want to “reset” the editor:
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Decide which button label to show:
  const isEditing = Boolean(initialNote);
  const buttonLabel = isEditing
    ? saving
      ? 'Updating...'
      : 'Update Note'
    : saving
      ? 'Saving...'
      : 'Save Note';

  return (
    <form
      className="note-editor"
      onSubmit={handleSubmit}
      style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}
    >
      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          onChange={handleChange}
          required
          placeholder="Enter note title"
          disabled={saving}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
        <label htmlFor="content">Content</label>
        <br />
        <textarea
          id="content"
          name="content"
          value={note.content}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Enter note content"
          disabled={saving}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving} style={{ padding: '0.5rem 1rem' }}>
          {buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
