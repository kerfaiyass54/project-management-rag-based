import { useEffect, useRef } from 'react';

const Iris = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    class Blob {
      constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > width + this.r || this.x < -this.r || this.y > height + this.r || this.y < -this.r) {
          this.x = Math.random() * width;
          this.y = -this.r;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const blobs = [];
    const colors = ['#ffffff', '#f0f0f0', '#d9d9d9', '#c2c2c2', '#ababab'];
    for (let i = 0; i < 5; i++) {
      blobs.push(new Blob(Math.random() * width, Math.random() * height, Math.random() * 100 + 50, colors[i % colors.length]));
    }

    let animate = () => {
      ctx.clearRect(0, 0, width, height);

      const targetX = mouse.x;
      const targetY = mouse.y;

      blobs.forEach(blob => {
        const dx = targetX - blob.x;
        const dy = targetY - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          blob.vx += dx * 0.001;
          blob.vy += dy * 0.001;
        }

        blob.vx *= 0.99;
        blob.vy *= 0.99;

        blob.update();
        blob.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default Iris;