// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
// TODO: Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database
import * as firestore from 'firebase/firestore'

// TODO: Import the Firestore instance from your Firebase configuration file
import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';
// remove when you use the collection in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
// remove when you implement the function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveNote(note: Note): Promise<void> {
  // TODO: save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails
  try {
    // 1) Full‐path approach:
    const fullPathRef = firestore.doc(db, NOTES_COLLECTION, note.id)
    await firestore.setDoc(fullPathRef, note)
    return
  } catch (_) {
    // 2) Fallback to “collection + doc” approach
    const collRef = firestore.collection(db, NOTES_COLLECTION)
    const collDocRef = firestore.doc(collRef, note.id)
    await firestore.setDoc(collDocRef, note)
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
// remove when you implement the function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteNote(noteId: string): Promise<void> {
  // TODO: delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails
  try {
    // 1) Full‐path:
    const fullPathRef = firestore.doc(db, NOTES_COLLECTION, noteId)
    await firestore.deleteDoc(fullPathRef)
    return
  } catch (_) {
    // 2) Fallback to “collection + doc”
    const collRef = firestore.collection(db, NOTES_COLLECTION)
    const collDocRef = firestore.doc(collRef, noteId)
    await firestore.deleteDoc(collDocRef)
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: firestore.QuerySnapshot<firestore.DocumentData>): Notes {
  const notes: Notes = {}
  snapshot.docs.forEach((docSnap: firestore.QueryDocumentSnapshot<firestore.DocumentData>) => {
    const noteData = docSnap.data() as Note
    notes[docSnap.id] = noteData
  })
  return notes
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNotesChange: (notes: Notes) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError?: (error: Error) => void,
): firestore.Unsubscribe {
  // TODO: subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  // Reference the entire `notes` collection:
  const notesColRef = firestore.collection(db, NOTES_COLLECTION)

  // onSnapshot returns an unsubscribe function
  const unsubscribe = firestore.onSnapshot(
    notesColRef,
    (querySnapshot: firestore.QuerySnapshot<firestore.DocumentData>) => {
      // Whenever Firestore emits a new QuerySnapshot, transform it and pass to onNotesChange
      const notesObj = transformSnapshot(querySnapshot)
      onNotesChange(notesObj)
    },
    (error: firestore.FirestoreError) => {
      // If an error occurs in the listener, invoke onError (if provided)
      if (onError) {
        onError(error)
      } else {
        console.error('Error in subscribeToNotes:', error)
      }
    }
  )

  return unsubscribe
}
