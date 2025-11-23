// Fog Canvas Setup
const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouseX = width / 2;
let mouseY = height / 2;
let particles = [];

// Cursor trail for cutting through fog
let cursorTrail = [];
const trailLifetime = 1500; // Trail lasts 1.5 seconds
const trailInterval = 8; // Add trail point every 8ms for smooth fast movement
let lastTrailTime = 0;
let lastTrailX = mouseX;
let lastTrailY = mouseY;

// Nightclub lights setup
const lights = [
    { x: 0, y: 0, intensity: 0, color: [100, 150, 255], element: document.querySelector('.corner-light-tl') },
    { x: width, y: 0, intensity: 0, color: [255, 100, 150], element: document.querySelector('.corner-light-tr') },
    { x: 0, y: height, intensity: 0, color: [150, 100, 255], element: document.querySelector('.corner-light-bl') },
    { x: width, y: height, intensity: 0, color: [100, 255, 200], element: document.querySelector('.corner-light-br') }
];

// Random light pulse function
function pulseLights() {
    lights.forEach((light, index) => {
        // Random delay before each light pulses
        setTimeout(() => {
            // Quick fade in
            let intensity = 0;
            const fadeIn = setInterval(() => {
                intensity += 0.1;
                light.intensity = Math.min(intensity, 1);
                light.element.style.opacity = light.intensity;
                if (intensity >= 1) {
                    clearInterval(fadeIn);
                    // Hold for a moment
                    setTimeout(() => {
                        // Quick fade out
                        const fadeOut = setInterval(() => {
                            intensity -= 0.15;
                            light.intensity = Math.max(intensity, 0);
                            light.element.style.opacity = light.intensity;
                            if (intensity <= 0) {
                                clearInterval(fadeOut);
                            }
                        }, 30);
                    }, 100 + Math.random() * 200);
                }
            }, 20);
        }, Math.random() * 2000);
    });
    
    // Schedule next pulse cycle
    setTimeout(pulseLights, 1500 + Math.random() * 2000);
}

// Start the light show
pulseLights();

// Particle class for fog
class FogParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 200 + 150;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.opacity = Math.random() * 0.35 + 0.25;
        this.targetOpacity = this.opacity;
        this.baseOpacity = this.opacity;
    }
    
    update() {
        // Drift movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
        
        // Check clearing effect from current cursor position AND trail
        let maxClearForce = 0;
        let totalPushX = 0;
        let totalPushY = 0;
        
        // Current cursor position
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const clearRadius = 340;
        
        if (distance < clearRadius) {
            const force = (clearRadius - distance) / clearRadius;
            maxClearForce = Math.max(maxClearForce, force);
            const pushStrength = force * 6;
            totalPushX += (dx / distance) * pushStrength;
            totalPushY += (dy / distance) * pushStrength;
        }
        
        // Check each trail point
        const now = Date.now();
        cursorTrail.forEach(trail => {
            const age = now - trail.time;
            const trailStrength = 1 - (age / trailLifetime); // Fades over time
            
            if (trailStrength > 0) {
                const tdx = this.x - trail.x;
                const tdy = this.y - trail.y;
                const tDistance = Math.sqrt(tdx * tdx + tdy * tdy);
                const trailRadius = 280 * trailStrength; // Larger radius, shrinks over time
                
                if (tDistance < trailRadius) {
                    const tForce = (trailRadius - tDistance) / trailRadius * trailStrength * 0.85;
                    maxClearForce = Math.max(maxClearForce, tForce);
                    
                    const tPushStrength = tForce * 4.5;
                    totalPushX += (tdx / tDistance) * tPushStrength;
                    totalPushY += (tdy / tDistance) * tPushStrength;
                }
            }
        });
        
        // Apply clearing and pushing
        this.targetOpacity = this.baseOpacity * (1 - maxClearForce * 0.98);
        this.x += totalPushX;
        this.y += totalPushY;
    }
    
    draw() {
        // Check if particle is near any active lights
        let lightInfluence = { r: 240, g: 240, b: 255, boost: 0 };
        
        lights.forEach(light => {
            if (light.intensity > 0) {
                const ldx = this.x - light.x;
                const ldy = this.y - light.y;
                const lightDist = Math.sqrt(ldx * ldx + ldy * ldy);
                const lightRadius = 800;
                
                if (lightDist < lightRadius) {
                    const lightForce = (1 - lightDist / lightRadius) * light.intensity;
                    
                    // Mix in the light color
                    lightInfluence.r = lightInfluence.r * (1 - lightForce * 0.6) + light.color[0] * lightForce * 0.6;
                    lightInfluence.g = lightInfluence.g * (1 - lightForce * 0.6) + light.color[1] * lightForce * 0.6;
                    lightInfluence.b = lightInfluence.b * (1 - lightForce * 0.6) + light.color[2] * lightForce * 0.6;
                    lightInfluence.boost += lightForce * 0.5;
                }
            }
        });
        
        const finalOpacity = this.targetOpacity * (1 + lightInfluence.boost);
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(${lightInfluence.r}, ${lightInfluence.g}, ${lightInfluence.b}, ${finalOpacity})`);
        gradient.addColorStop(0.3, `rgba(${lightInfluence.r * 0.95}, ${lightInfluence.g * 0.95}, ${lightInfluence.b}, ${finalOpacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(${lightInfluence.r * 0.9}, ${lightInfluence.g * 0.9}, ${lightInfluence.b}, ${finalOpacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
        );
    }
}

// Create fog particles
const particleCount = 120;
for (let i = 0; i < particleCount; i++) {
    particles.push(new FogParticle());
}

// Mouse tracking with trail
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const now = Date.now();
    
    // Calculate distance moved since last trail point
    const dx = mouseX - lastTrailX;
    const dy = mouseY - lastTrailY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If moving fast, interpolate points between last and current position
    if (distance > 50) {
        const steps = Math.ceil(distance / 30);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const interpX = lastTrailX + dx * t;
            const interpY = lastTrailY + dy * t;
            cursorTrail.push({ x: interpX, y: interpY, time: now });
        }
    } else if (now - lastTrailTime > trailInterval) {
        // Normal recording for slow movement
        cursorTrail.push({ x: mouseX, y: mouseY, time: now });
        lastTrailTime = now;
    }
    
    lastTrailX = mouseX;
    lastTrailY = mouseY;
});

// Resize handler
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Update light positions
    lights[1].x = width;
    lights[2].y = height;
    lights[3].x = width;
    lights[3].y = height;
});

// Animation loop for fog
function animateFog() {
    ctx.clearRect(0, 0, width, height);
    
    // Clean up old trail points and limit total trail points
    const now = Date.now();
    cursorTrail = cursorTrail.filter(trail => now - trail.time < trailLifetime);
    
    // Limit trail to 200 points maximum for performance
    if (cursorTrail.length > 200) {
        cursorTrail = cursorTrail.slice(-200);
    }
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateFog);
}

animateFog();

// 3D parallax effect on logo
const logoText = document.querySelector('.logo-text');
if (logoText) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        logoText.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}
