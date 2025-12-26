import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/notes")
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  function addNote(newNote) {
    axios.post("http://localhost:3001/notes", newNote)
      .then(res => {
        setNotes(prev => [...prev, res.data]);
      })
      .catch(err => console.log(err));
  }

  function deleteNote(id) {
    axios.delete(`http://localhost:3001/notes/${id}`)
      .then(() => {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      })
      .catch(err => console.log(err));
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map(noteItem => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
