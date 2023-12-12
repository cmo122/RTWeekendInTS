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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full height of the viewport
            }}>
            <canvas
                ref={canvasRef}
                width={400}
                height={450}
                id="canvas"
                style={{ border: '1px solid black' }}
            />
            <button style={{
                margin: "1rem"
            }} onClick={renderMain}>Render</button>
            {loading && (
                <div>
                    Rendering...
                </div>
            )}
        </div>
    )
}