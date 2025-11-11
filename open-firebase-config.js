// Script to open Firebase configuration dialog
// This script will be injected into the page to trigger the Firebase settings

(function() {
    console.log('Opening Firebase configuration dialog...');
    
    // Check if firebaseConfigManager is available
    if (typeof firebaseConfigManager !== 'undefined') {
        console.log('Firebase config manager found, opening dialog...');
        firebaseConfigManager.showConfigUI();
        console.log('Firebase configuration dialog opened successfully!');
        
        // Show a visual notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = 'Firebase 설정 창이 열렸습니다!';
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
        
    } else {
        console.error('Firebase config manager not found. Available objects:', Object.keys(window).filter(key => key.includes('firebase')));
        
        // Show error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #F44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.textContent = 'Firebase 설정을 찾을 수 없습니다.';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
})();