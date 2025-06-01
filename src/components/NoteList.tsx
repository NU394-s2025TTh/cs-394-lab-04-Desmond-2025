// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error

  // State for notes, loading, and error
  const [notes, setNotes] = useState<Notes>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Subscribe once on mount
    const unsubscribe = subscribeToNotes(
      (newNotes: Notes) => {
        setNotes(newNotes)
        setLoading(false)
      },
      (err: Error) => {
        setError(err.message)
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  // Render loading / error / empty / list
  if (loading) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p>Loading notes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  const noteArray = Object.values(notes)
  return (
    <div className="note-list">
      <h2>Notes</h2>
      {noteArray.length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {noteArray
            // Sort by lastUpdated descending
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  )
};

export default NoteList;
