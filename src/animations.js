// Comprehensive Animations Library for Cinematic Wedding Website

const animations = {
    fadeIn: keyframes`from { opacity: 0; } to { opacity: 1; }`,
    fadeOut: keyframes`from { opacity: 1; } to { opacity: 0; }`,
    slideInLeft: keyframes`from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`,
    slideOutLeft: keyframes`from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; }`,
    slideInRight: keyframes`from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`,
    slideOutRight: keyframes`from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; }`,
    zoomIn: keyframes`from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; }`,
    zoomOut: keyframes`from { transform: scale(1); opacity: 1; } to { transform: scale(0.5); opacity: 0; }`,
    bounce: keyframes`from, 20%, 50%, 80%, to { transform: translateY(0); } 10% { transform: translateY(-30px); } 30% { transform: translateY(-15px); }`,
    shake: keyframes`from { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } to { transform: translateX(0); }`,
    rotateIn: keyframes`from { transform: rotate(-200deg); opacity: 0; } to { transform: rotate(0); opacity: 1; }`,
    rotateOut: keyframes`from { transform: rotate(0); opacity: 1; } to { transform: rotate(200deg); opacity: 0; }`,
    flipIn: keyframes`from { transform: perspective(400px) rotateY(-180deg); opacity: 0; } to { transform: perspective(400px) rotateY(0); opacity: 1; }`,
    flipOut: keyframes`from { transform: perspective(400px) rotateY(0); opacity: 1; } to { transform: perspective(400px) rotateY(180deg); opacity: 0; }`,
    pulse: keyframes`from { transform: scale(1); } 50% { transform: scale(1.05); } to { transform: scale(1); }`,
    reveal: keyframes`from { max-height: 0; opacity: 0; } to { max-height: 1000px; opacity: 1; }`,
    collapse: keyframes`from { max-height: 1000px; opacity: 1; } to { max-height: 0; opacity: 0; }`,
    scaleUp: keyframes`from { transform: scale(0); } to { transform: scale(1); }`,
    scaleDown: keyframes`from { transform: scale(1); } to { transform: scale(0); }`
};

export default animations;