import React, { useState } from "react";

function CreateArea(props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function expand() {
    setIsExpanded(true);
  }

  function submitNote(event) {
    event.preventDefault();

    if (!note.title.trim() && !note.content.trim()) return;

    props.onAdd(note);
    setNote({ title: "", content: "" });
    setIsExpanded(false);
  }

  return (
    <div>
      <form className="create-note">

        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}   // SMALL when not expanded
        />

        {isExpanded && (
          <button onClick={submitNote}>Add</button>
        )}

      </form>
    </div>
  );
}

export default CreateArea;
