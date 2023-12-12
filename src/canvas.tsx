import React, { useRef, useState } from 'react'
import { main } from '../main'

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const renderMain = () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                setLoading(true)
                main();

            }
        }
        setLoading(false)
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={400}
                height={800}
                id="canvas"
                style={{ border: '1px solid black' }}
            />
            <button onClick={renderMain}>Render</button>
            {loading && (
                <div>
                    Rendering...
                </div>
            )}
        </div>
    )
}