import { Modal } from "../cmps/Modal.jsx"
import { noteService } from '../services/note.service.js'
import { CreateNoteByImg } from '../cmps/CreateNoteByImg.jsx'
import { CreateNoteByVideo } from '../cmps/CreateNoteByVideo.jsx'
import { CreateNoteByTodos } from '../cmps/CreateNoteByTodos.jsx'
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React

export function NoteEdit({ note, onCloseModal, loadNotes, setNoteType }) {

    const [noteToEdit, setNoteToEdit] = useState(note)

    function handleChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            case 'color':
                value = { backgroundColor: value }
                break
        }
        setNoteToEdit((prevNote) => ({ ...prevNote, [field]: value }))
    }

    function handleInfoChange({ target }) {
        let { value, name: field, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setNoteToEdit((prevNote) => ({ ...prevNote, info: { ...noteToEdit.book, [field]: value } }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        setNoteType(noteToEdit)
        noteService.save(noteToEdit)
            .then(note => {
                console.log(note)
                console.log('Note updated')
                showSuccessMsg('Note has been saved successfully')
                loadNotes()
                onCloseModal()
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Problems saving note`)
            })
    }

    function renderImgOrVideo(element) {
        return (
            <div className="edit-video-or-img">
                {element}
                <button type='button'><i className="fa-solid fa-trash"></i></button>
            </div>
        )
    }

    return (
        <section>

            <form className="edit-note-form" onSubmit={onSubmit} style={{ backgroundColor: noteToEdit.style.backgroundColor }}>
                {noteToEdit.info.imgUrl && renderImgOrVideo(<img src={note.info.imgUrl} />)}
                {noteToEdit.info.videoUrl && renderImgOrVideo(<iframe src={note.info.videoUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                </iframe>)}


                <input
                    type="text"
                    name="noteTitle"
                    id="title-update"
                    placeholder="Title"
                    value={noteToEdit.noteTitle}
                    onChange={handleChange}
                    style={{ backgroundColor: noteToEdit.style.backgroundColor }} />

                <input
                    type="text"
                    name="txt"
                    id="note-content"
                    placeholder="New note..."
                    value={noteToEdit.info.txt}
                    onChange={handleInfoChange}
                    style={{ backgroundColor: noteToEdit.style.backgroundColor }} />

                <DynamicCmp
                    noteType={noteToEdit.type}
                    handleChange={handleChange}
                    handleInfoChange={handleInfoChange}
                    note={noteToEdit} />


                <div className="actions">
                    <div className="actions-toolbar">
                        <label htmlFor="color-input-edit"><i className="fa-solid fa-palette"></i></label>
                        <input
                            type="color"
                            className="control-color"
                            id="color-input-edit"
                            name="style"
                            value={noteToEdit.style.backgroundColor}
                            onChange={handleChange} />

                        <button
                            type='button'
                            title="Add image">
                            <i className="fa-solid fa-image"></i>
                        </button>

                        <button
                            type='button'>
                            <i className="fa-solid fa-video"></i>
                        </button>

                        <button
                            type='button'>
                            <i className="fa-regular fa-square-check"></i>
                        </button>
                    </div>
                    <button className="save-new-note-btn">Save</button>
                </div>
            </form>


        </section>
    )
}

function DynamicCmp(props) {
    switch (props.noteType) {
        // case 'NoteTxt':
        //     return <CreateNoteByTextbox {...props} />
        case 'NoteImg':
            return <CreateNoteByImg {...props} />
        case 'NoteVideo':
            return <CreateNoteByVideo {...props} />
        case 'NoteTodos':
            return <CreateNoteByTodos {...props} />
        default:
            return null
    }
}