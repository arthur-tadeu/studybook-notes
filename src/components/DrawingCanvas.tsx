import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  initialData?: string;
  onSave: (dataUrl: string) => void;
  brushColor: string;
  isDrawingEnabled: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ initialData, onSave, brushColor, isDrawingEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to parent size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Save current content
        const currentContent = canvas.toDataURL();
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        // Restore content
        const img = new Image();
        img.src = currentContent;
        img.onload = () => ctx.drawImage(img, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial load
    if (initialData) {
      const img = new Image();
      img.src = initialData;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    // Reload if initialData changes externally (e.g. page change)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (initialData) {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       const img = new Image();
       img.src = initialData;
       img.onload = () => ctx.drawImage(img, 0, 0);
    } else {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingEnabled) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isDrawingEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: isDrawingEnabled ? 10 : 1,
        cursor: isDrawingEnabled ? 'crosshair' : 'default',
        pointerEvents: isDrawingEnabled ? 'auto' : 'none'
      }}
    />
  );
};

export default DrawingCanvas;
