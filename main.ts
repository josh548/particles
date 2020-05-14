const canvas = document.querySelector("canvas")!;
canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);

const context = canvas.getContext("2d")!;

interface Particle {
    x: number;
    y: number;
    radius: number;
    dx: number;
    dy: number;
}

const particles: Particle[] = [];
for (let i = 0; i < 10; i++) {
    particles.push({
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        radius: 10,
        dx: Math.ceil(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
        dy: Math.ceil(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
    });
}

function wrapAround(particle: Particle) {
    if (particle.dx < 0 && (particle.x + particle.radius) < 0) {
        particle.x = canvas.width;
    }
    if (particle.dx > 0 && (particle.x - particle.radius) > canvas.width) {
        particle.x = 0;
    }
    if (particle.dy < 0 && (particle.y + particle.radius) < 0) {
        particle.y = canvas.height;
    }
    if (particle.dy > 0 && (particle.y - particle.radius) > canvas.height) {
        particle.y = 0;
    }
}

function getDistance(particle1: Particle, particle2: Particle): number {
    return Math.sqrt(Math.pow(particle2.x - particle1.x, 2) + Math.pow(particle2.y - particle1.y, 2));
}

function animate() {
    context.fillStyle = "hsl(0, 0%, 20%)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "hsl(0, 0%, 80%)";
    for (const particle of particles) {
        for (const otherParticle of particles) {
            const distance = getDistance(particle, otherParticle);
            if (distance < 500) {
                const lightness = 30 + Math.ceil(((500 - distance) / 500) * 50);
                context.strokeStyle = `hsl(0, 0%, ${lightness}%)`;
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(otherParticle.x, otherParticle.y);
                context.stroke();
                context.closePath();
            }
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        particle.x += particle.dx;
        particle.y += particle.dy;
        wrapAround(particle);
    }
    requestAnimationFrame(animate);
}

animate();
