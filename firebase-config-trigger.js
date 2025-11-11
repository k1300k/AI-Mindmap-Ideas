// Firebase Configuration Dialog Opener
// This script opens the Firebase configuration dialog in the main application

(function openFirebaseConfig() {
    console.log('🚀 Firebase Configuration Opener Script Loaded');
    
    // Function to create and show the Firebase config dialog
    function showFirebaseConfig() {
        console.log('⚙️ Opening Firebase configuration dialog...');
        
        // Check if firebaseConfigManager exists
        if (typeof firebaseConfigManager !== 'undefined' && firebaseConfigManager.showConfigUI) {
            console.log('✅ Found firebaseConfigManager, opening dialog...');
            firebaseConfigManager.showConfigUI();
            
            // Show success notification
            showNotification('Firebase 설정 창이 열렸습니다!', 'success');
            return true;
        }
        
        // Alternative: Check if there's a Firebase config button
        const firebaseButtonSelectors = [
            'button[title*="Firebase"] ',
            'button[title*="firebase"] ',
            '.btn-firebase',
            '[onclick*="firebase"]',
            'button:contains("Firebase") ',
            '.tool-btn:nth-child(6)' // Based on typical layout
        ];
        
        for (let selector of firebaseButtonSelectors) {
            try {
                const button = document.querySelector(selector);
                if (button) {
                    console.log('🔘 Found Firebase button, clicking...');
                    button.click();
                    showNotification('Firebase 설정 버튼을 클릭했습니다!', 'success');
                    return true;
                }
            } catch (e) {
                console.warn('Could not find button with selector:', selector);
            }
        }
        
        // If no direct method works, create a temporary button
        console.log('🔧 Creating temporary Firebase config button...');
        createTempFirebaseButton();
        return false;
    }
    
    // Function to create a temporary Firebase config button
    function createTempFirebaseButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-cog"></i> Firebase 설정';
        button.className = 'temp-firebase-btn';
        button.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FF6B6B, #FF8E53);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
            transition: all 0.3s ease;
        `;
        
        button.onclick = function() {
            if (typeof firebaseConfigManager !== 'undefined' && firebaseConfigManager.showConfigUI) {
                firebaseConfigManager.showConfigUI();
                button.remove();
                showNotification('Firebase 설정 창이 열렸습니다!', 'success');
            } else {
                showNotification('Firebase 설정을 사용할 수 없습니다. 설정이 필요합니다.', 'error');
            }
        };
        
        document.body.appendChild(button);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (button.parentNode) {
                button.remove();
                showNotification('Firebase 설정 버튼이 닫혔습니다. 페이지를 새로고침하고 다시 시도하세요.', 'warning');
            }
        }, 10000);
        
        showNotification('임시 Firebase 설정 버튼이 생성되었습니다. 클릭하세요!', 'info');
    }
    
    // Function to show notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'linear-gradient(45deg, #4CAF50, #45a049)',
            error: 'linear-gradient(45deg, #F44336, #d32f2f)',
            info: 'linear-gradient(45deg, #2196F3, #1976D2)',
            warning: 'linear-gradient(45deg, #FF9800, #F57C00)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            max-width: 300px;
            text-align: center;
            animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <div>${message}</div>
            </div>
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
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
    }
    
    // Execute the function
    console.log('⚙️ Executing Firebase configuration opener...');
    
    // Try to open immediately
    const result = showFirebaseConfig();
    
    if (!result) {
        // If immediate opening failed, wait for page load
        window.addEventListener('load', function() {
            setTimeout(() => {
                console.log('🔄 Retrying Firebase configuration after page load...');
                showFirebaseConfig();
            }, 1000);
        });
    }
    
    console.log('✅ Firebase Configuration Opener Script Execution Complete');
    
    // Return the function for future use
    return {
        openFirebaseConfig: showFirebaseConfig,
        createTempButton: createTempFirebaseButton
    };
})();