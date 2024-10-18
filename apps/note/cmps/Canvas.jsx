
const { useEffect, useRef } = React

export function Canvas({ setNoteToAdd, closeDrawingModal, setIsExpandedForm }) {

    const canvasRef = useRef(null)
    let context = null
    let gLastPos = { x: 0, y: 0 }

    useEffect(() => {

        const canvas = canvasRef.current;
        if (canvas) {
            context = canvas.getContext('2d') // Get the canvas 2D context
            canvas.width = 600 // Set canvas width
            canvas.height = 600 // Set canvas height
        }

        document.addEventListener('mousedown', onDown)
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)

        return () => {
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }
    }, [])

    function drawLine(x, y, xEnd = 300, yEnd = 300) {
        if (!context) return
        context.beginPath()

        context.moveTo(x, y)
        context.lineTo(xEnd, yEnd)
        context.lineWidth = 3
        context.stroke()
    }

    function onDown(ev) {
        const pos = getEvPos(ev)
        gLastPos = pos

        document.body.style.cursor = 'grabbing'
    }

    function onMove(ev) {
        if (ev.buttons !== 1) return
        const pos = getEvPos(ev)

        drawLine(gLastPos.x, gLastPos.y, pos.x, pos.y)

        gLastPos = pos
    }

    function onUp() {
        document.body.style.cursor = 'grab'
    }

    function getEvPos(ev) {
        let pos = {
            x: ev.offsetX,
            y: ev.offsetY
        }

        // if (TOUCH_EVS.includes(ev.type)) {
        //     //* Prevent triggering the mouse screen dragging event
        //     ev.preventDefault()
        //     //* Gets the first touch point
        //     ev = ev.changedTouches[0]
        //     //* Calc the right pos according to the touch screen
        //     pos = {
        //         x: ev.clientX - ev.target.offsetLeft - ev.target.clientLeft,
        //         y: ev.clientY - ev.target.offsetTop - ev.target.clientTop,
        //     }
        // }

        return pos
    }

    function onSaveDrawing() {
        const dataURL = canvasRef.current.toDataURL('image/png')
        setNoteToAdd(prevNote => ({ ...prevNote, info: { drawingUrl: dataURL } }))
        setIsExpandedForm(true)
        closeDrawingModal()
        console.log('Drawing saved!')
    }

    return (
        <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
            <button className="save-drawing-btn" onClick={(ev) => { ev.stopPropagation(); onSaveDrawing() }}>Save</button>
        </div>
    )
}