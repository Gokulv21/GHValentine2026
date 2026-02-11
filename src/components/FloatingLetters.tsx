import { useEffect, useRef } from "react";

const FloatingLetters = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const characters = ["❤️", "💖", "💝", "💕", "💗", "G", "H", "L", "O", "V", "E"];
        const particles: Particle[] = [];
        const particleCount = 60;

        class Particle {
            x: number;
            y: number;
            size: number;
            speed: number;
            content: string;
            opacity: number;
            rotation: number;
            rotationSpeed: number;
            swing: number;
            swingSpeed: number;
            offset: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = 15 + Math.random() * 30;
                this.speed = 0.5 + Math.random() * 1.5;
                this.content = characters[Math.floor(Math.random() * characters.length)];
                this.opacity = 0.1 + Math.random() * 0.4;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.swing = Math.random() * Math.PI * 2;
                this.swingSpeed = 0.01 + Math.random() * 0.02;
                this.offset = Math.random() * 50;
            }

            update() {
                this.y += this.speed;
                this.rotation += this.rotationSpeed;
                this.swing += this.swingSpeed;
                this.x += Math.sin(this.swing) * 0.5;

                if (this.y > canvas.height + 50) {
                    this.y = -50;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.content, 0, 0);
                ctx.restore();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const init = () => {
            resize();
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const mouseParticles: MouseParticle[] = [];
        let mouseX = 0;
        let mouseY = 0;

        class MouseParticle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            life: number;
            content: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = (Math.random() - 0.5) * 3;
                this.size = 10 + Math.random() * 20;
                this.life = 1;
                this.content = "❤️";
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.02;
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.life * 0.5;
                ctx.font = `${this.size}px serif`;
                ctx.fillText(this.content, this.x, this.y);
                ctx.restore();
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (mouseParticles.length < 50) {
                mouseParticles.push(new MouseParticle(mouseX, mouseY));
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                if (mouseParticles.length < 50) {
                    mouseParticles.push(new MouseParticle(mouseX, mouseY));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background particles
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            // Draw mouse trail
            for (let i = mouseParticles.length - 1; i >= 0; i--) {
                const p = mouseParticles[i];
                p.update();
                if (p.life <= 0) {
                    mouseParticles.splice(i, 1);
                } else {
                    p.draw();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ filter: "blur(0.5px)" }}
        />
    );
};

export default FloatingLetters;
