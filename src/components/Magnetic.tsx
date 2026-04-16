import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './Magnetic.css';

const Magnetic = () => {
    const props = useSpring({
        from: { opacity: 0, transform: 'scale(0.5)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { duration: 800 }
    });

    return (
        <animated.div style={props} className="magnetic-container">
            <h1 className="magnetic-title">Cinematic Wedding Films</h1>
            <div className="magnetic-image">
                <animated.img 
                    src="your-image.jpg" 
                    alt="Cinematic Wedding" 
                    style={props} 
                    className="magnetic-hover" 
                />
            </div>
        </animated.div>
    );
};

export default Magnetic;