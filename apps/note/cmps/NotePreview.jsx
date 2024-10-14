import { NoteEdit } from '../cmps/NoteEdit.jsx'
import { Modal } from '../cmps/Modal.jsx'

const { Fragment, useState } = React

export function NotePreview({ notes, onRemoveNote, loadNotes, onPinNote, onDuplicateNote }) {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState(null)

    function onCloseModal() {
        setIsEditModalOpen(false)
        setNoteToEdit(null)
    }

    function handleEditClick(note) {
        setNoteToEdit(note)
        setIsEditModalOpen(true)
    }

    return (

        <Fragment>
            <ul className="notes">
                {notes.map(note =>
                    <li key={note.id} style={{ backgroundColor: note.style.backgroundColor }}>
                        <h2>{note.noteTitle}</h2>
                        <p>{note.info.txt}</p>
                        {note.info.imgUrl && <img src={note.info.imgUrl} />}
                        {note.info.videoUrl &&
                            <iframe src={note.info.videoUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                            </iframe>}
                        <button onClick={() => onRemoveNote(note.id)}><i className="fa-solid fa-trash"></i></button>
                        <button onClick={() => handleEditClick(note)}>Edit</button>
                        <button onClick={() => onPinNote(note)}>{note.isPinned ? 'Pinned' : 'Pin'}</button>
                        <button onClick={() => onDuplicateNote(note)}><i className="fa-regular fa-clone"></i></button>
                    </li>
                )}
            </ul>

            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onCloseModal={onCloseModal}>
                    <NoteEdit note={noteToEdit} onCloseModal={onCloseModal} loadNotes={loadNotes} />
                </Modal>
            )}
        </Fragment>
    )
}