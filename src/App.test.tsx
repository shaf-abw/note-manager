import React from 'react';
import App from './App';
import { render, fireEvent, cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

const renderApp = () => render(<App />);

let noteInput: Node | Window, noteContent: Node | Window,
  addAndUpdateButton: Node | Window, notesList: HTMLElement;
const initialNoteCount = 0;

afterEach(() => {
  cleanup()
});

beforeEach(() => {
  let { getByTestId } = renderApp();
  noteInput = getByTestId('form-input');
  noteContent = getByTestId('form-textarea');
  addAndUpdateButton = getByTestId('form-submit-button');
  notesList = getByTestId('notes-list');
  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }
});

describe("Initial UI", () => {
  it("note input box should be of type text", () => {
    expect(noteInput).toHaveAttribute("type", "text");
  });

  it("initially the notes list should be empty", () => {
    cleanup();
    let { getByTestId } = renderApp();
    notesList = getByTestId('notes-list');
    expect(notesList.children.length).toBe(initialNoteCount);
  });
});

describe("Add Note", () => {
  it("add note button should add a note", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 Content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 1");
    expect(noteInput).toHaveValue("");
    expect(noteContent).toHaveValue("");
  });

  it("should empty the input boxes on adding a valid note", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 Content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 1");
    expect(noteInput).toHaveTextContent("");
    expect(noteContent).toHaveValue("");
  });

  it("should not submit the form when either title or content is empty", () => {
    cleanup();
    let { getByTestId } = renderApp();
    notesList = getByTestId('notes-list');
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount);

    fireEvent.change(noteInput, { target: { value: "" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 Content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount);
  });

  it("should keep the add note button disabled when title is empty", () => {
    fireEvent.change(noteInput, { target: { value: "" } });
    fireEvent.change(noteContent, { target: { value: "Note Content" } });
    expect(addAndUpdateButton).toBeDisabled();
  });

  it("should keep the add note button disabled when content is empty", () => {
    fireEvent.change(noteInput, { target: { value: "Note Title" } });
    fireEvent.change(noteContent, { target: { value: "" } });
    expect(addAndUpdateButton).toBeDisabled();
  });
});

describe("Delete Note", () => {
  it("delete button should delete the corresponding note", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 1");

    fireEvent.change(noteInput, { target: { value: "Note 2" } });
    fireEvent.change(noteContent, { target: { value: "Note 2 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 2);
    expect(notesList.children[initialNoteCount + 1]).toHaveTextContent("Note 2");

    const deleteButton = notesList.children[initialNoteCount].children[3].children[0];
    expect(deleteButton).toHaveTextContent("Delete");
    // Click Delete Button for Note 1
    fireEvent.click(deleteButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 2");
  });
});

describe("Edit Note", () => {
  it("edit button should show the corresponding note in the input fields", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 1");

    const editButton = notesList.children[initialNoteCount].children[2].children[0];
    expect(editButton).toHaveTextContent("Edit");
    // Click Edit Button for Note 1
    fireEvent.click(editButton);
    expect(noteInput).toHaveValue("Note 1");
    expect(noteContent).toHaveValue("Note 1 content");
  });

  it("should update the note with new values after editing", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Note 1");

    const editButton = notesList.children[initialNoteCount].children[2].children[0];
    expect(editButton).toHaveTextContent("Edit");
    // Click Edit Button for Note 1
    fireEvent.click(editButton);

    fireEvent.change(noteInput, { target: { value: "Updated Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Updated Note 1 content" } });
    // Click Save Changes Button
    fireEvent.click(addAndUpdateButton);
    expect(notesList.children.length).toBe(initialNoteCount + 1);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Updated Note 1");
  });

  it("should maintain the order of notes and update the note with new values after editing", () => {
    fireEvent.change(noteInput, { target: { value: "Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Note 1 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);
    fireEvent.change(noteInput, { target: { value: "Note 2" } });
    fireEvent.change(noteContent, { target: { value: "Note 2 content" } });
    // Click Add Note Button
    fireEvent.click(addAndUpdateButton);

    const editButton = notesList.children[initialNoteCount].children[2].children[0];
    expect(editButton).toHaveTextContent("Edit");
    // Click Edit Button for Note 1
    fireEvent.click(editButton);

    fireEvent.change(noteInput, { target: { value: "Updated Note 1" } });
    fireEvent.change(noteContent, { target: { value: "Updated Note 1 content" } });
    // Click Save Changes Button
    fireEvent.click(addAndUpdateButton);

    expect(notesList.children.length).toBe(initialNoteCount + 2);
    expect(notesList.children[initialNoteCount]).toHaveTextContent("Updated Note 1");
    expect(notesList.children[initialNoteCount + 1]).toHaveTextContent("Note 2");
  });
});
