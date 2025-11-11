// Direct script to open Firebase configuration
// This script can be run directly in the browser console

(function() {
    console.log('🚀 Attempting to open Firebase configuration dialog...');
    
    // Wait for the page to fully load
    function waitForFirebaseConfig() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                // Check if firebaseConfigManager is available
                if (typeof firebaseConfigManager !== 'undefined' && 
                    firebaseConfigManager.showConfigUI) {
                    clearInterval(checkInterval);
                    resolve(firebaseConfigManager);
                }
                
                // Check if firebaseConfigManager is available in different locations
                if (window.firebaseConfigManager && 
                    window.firebaseConfigManager.showConfigUI) {
                    clearInterval(checkInterval);
                    resolve(window.firebaseConfigManager);
                }
                
                // Check if the Firebase config button exists and click it
                const firebaseBtn = document.querySelector('[title*="Firebase"]') || 
                                    document.querySelector('[title*="firebase"]') ||
                                    document.querySelector('button[onclick*="firebase"]') ||
                                    document.querySelector('.firebase-btn');
                
                if (firebaseBtn) {
                    clearInterval(checkInterval);
                    firebaseBtn.click();
                    resolve({triggeredByClick: true});
                }
                
                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('Firebase configuration not found after 5 seconds'));
                }
            }, 100);
        });
    }
    
    // Execute the configuration opening
    waitForFirebaseConfig()
        .then((configManager) => {
            if (configManager.triggeredByClick) {
                console.log('✅ Firebase configuration opened via button click');
            } else {
                console.log('✅ Firebase configuration manager found, opening dialog...');
                configManager.showConfigUI();
            }
            
            // Create a visual notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-family: 'Noto Sans KR', sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                max-width: 300px;
                text-align: center;
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">⚙️</span>
                    <div>
                        <strong>Firebase 설정 창이 열렸습니다!</strong><br>
                        <small style="opacity: 0.9;">클라우드 저장소를 설정하세요</small>
                    </div>
                </div>
            `;
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);
            
            // Auto-remove after 4 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                }, 300);
            }, 4000);
            
        })
        .catch((error) => {
            console.error('❌ Failed to open Firebase configuration:', error);
            
            // Show error notification
            const errorNotification = document.createElement('div');
            errorNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #F44336, #d32f2f);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-family: 'Noto Sans KR', sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
                max-width: 300px;
                text-align: center;
            `;
            errorNotification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">❌</span>
                    <div>
                        <strong>Firebase 설정을 열 수 없습니다</strong><br>
                        <small style="opacity: 0.9;">${error.message}</small>
                    </div>
                </div>
            `;
            document.body.appendChild(errorNotification);
            
            setTimeout(() => errorNotification.remove(), 6000);
        });
    
    console.log('⏳ Waiting for Firebase configuration to be ready...');
})();