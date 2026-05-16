// Scene Timings in seconds
const SCENE_TIMINGS = [
    5.5, // Intro
    5.5, // Dashboard
    6.0, // Blocks & Flats
    5.5, // Maintenance
    5.0, // Society Funds
    5.5, // Expenses
    5.5, // App Tour
    5.5, // Admin Approval
    5.0, // Multi-Device
    7.0  // Outro
];

let currentScene = 0;
let sceneTimeout;

function showScene(idx) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(s => s.classList.remove('active'));
    
    if (scenes[idx]) {
        scenes[idx].classList.add('active');
        
        // Reset and start counter if dashboard
        if (idx === 1) {
            setTimeout(() => {
                const vals = scenes[idx].querySelectorAll('.stat-val');
                vals.forEach(v => {
                    const target = parseInt(v.getAttribute('data-count'));
                    const prefix = v.getAttribute('data-prefix') || '₹';
                    animateValue(v, 0, target, 2000, prefix);
                });
            }, 500);
        }
    }
}

function animateValue(obj, start, end, duration, prefix) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const val = Math.floor(progress * (end - start) + start);
        obj.innerHTML = prefix + val.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function nextScene() {
    currentScene++;
    if (currentScene >= SCENE_TIMINGS.length) {
        currentScene = 0;
    }
    
    const progress = document.getElementById('progressBar');
    if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '0%';
        setTimeout(() => {
            progress.style.transition = `width ${SCENE_TIMINGS[currentScene]}s linear`;
            progress.style.width = '100%';
        }, 50);
    }
    
    showScene(currentScene);
    sceneTimeout = setTimeout(nextScene, SCENE_TIMINGS[currentScene] * 1000);
}

// Start
window.onload = () => {
    nextScene();
};
