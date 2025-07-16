import animationData from '../assets/your-lottie.json';
import Lottie from 'lottie-react';

export const CyberpunkBackground = () => {
    return (
        <>

            {/* Вторая анимация — слева сверху */}
            <div
                className="fixed top-4 left-4 w-48 h-48 pointer-events-none z-10"
                style={{ pointerEvents: 'none', overflow: 'visible' }} // чтобы большая анимация не обрезалась
            >
                <Lottie
                    animationData={animationData}
                    loop
                    style={{
                        width: '1000%',
                        height: '1000%',
                        position: 'relative',
                        left: '100%',
                        bottom: '200%'
                    }}
                />
            </div>
        </>
    );
};