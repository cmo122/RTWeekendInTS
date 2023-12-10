import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import { main } from '../main'

export default function Canvas() {
    const canvasRef = useRef(null);
    return (
        <div>
            <canvas
                ref={canvasRef}
                width={400}
                height={300}
            />
        </div>
    )
}