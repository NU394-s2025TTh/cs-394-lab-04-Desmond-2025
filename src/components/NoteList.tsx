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
    // Start by showing “loading…”
    setLoading(true)
    setError(null)

    // We’ll store the unsubscribe function here
    let unsubscribeFn: () => void = () => {}

    try {
      // Attempt to subscribe. If subscribeToNotes throws, we catch below.
      unsubscribeFn = subscribeToNotes(
        (newNotes: Notes) => {
          setNotes(newNotes)
          setLoading(false)
        },
        (err: Error) => {
          setError(err.message)
          setLoading(false)
        }
      )
    } catch (err: any) {
      // If subscribeToNotes threw synchronously (as the test mocks), catch it here:
      setError(err.message)
      setLoading(false)
      return
    }

    // Clean up the listener on unmount
    return () => {
      unsubscribeFn()
    }
  }, [])

  // If we’re still loading, show the loading UI
  if (loading) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p>Loading notes...</p>
      </div>
    )
  }

  // If subscribeToNotes threw an error (or onError was called), show that error
  if (error) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  // Otherwise, render the list (or "no notes" message)
  const noteArray = Object.values(notes)
  return (
    <div className="note-list">
      <h2>Notes</h2>
      {noteArray.length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {noteArray
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  )
}

export default NoteList
