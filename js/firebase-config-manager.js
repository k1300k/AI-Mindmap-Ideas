// Firebase 설정 관리
const firebaseConfigManager = {
    // 기본 Firebase 설정 (실제 사용시 변경 필요)
    defaultConfig: {
        apiKey: "AIzaSyBf0B2ba2M8Y6F1XbN9x2Zt8hY1n9M4X8y1",
        authDomain: "ideaflow-mindmap.firebaseapp.com",
        databaseURL: "https://ideaflow-mindmap-default-rtdb.firebaseio.com",
        projectId: "ideaflow-mindmap",
        storageBucket: "ideaflow-mindmap.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890"
    },

    // 설정 정보를 로컬 스토리지에서 불러오기
    loadConfig: function() {
        const savedConfig = localStorage.getItem('firebase-config');
        if (savedConfig) {
            try {
                return JSON.parse(savedConfig);
            } catch (e) {
                console.error('Firebase 설정 로드 실패:', e);
            }
        }
        return this.defaultConfig;
    },

    // 설정 정보 저장
    saveConfig: function(config) {
        localStorage.setItem('firebase-config', JSON.stringify(config));
        showToast('Firebase 설정이 저장되었습니다. 페이지를 새로고침하면 적용됩니다.');
    },

    // 설정 UI 표시
    showConfigUI: function() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content firebase-config-modal">
                <div class="modal-header">
                    <h2>Firebase 설정</h2>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="firebase-api-key">API Key:</label>
                        <input type="password" id="firebase-api-key" placeholder="Firebase API Key" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-auth-domain">Auth Domain:</label>
                        <input type="text" id="firebase-auth-domain" placeholder="your-project.firebaseapp.com" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-database-url">Database URL:</label>
                        <input type="text" id="firebase-database-url" placeholder="https://your-project-default-rtdb.firebaseio.com" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-project-id">Project ID:</label>
                        <input type="text" id="firebase-project-id" placeholder="your-project-id" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-storage-bucket">Storage Bucket:</label>
                        <input type="text" id="firebase-storage-bucket" placeholder="your-project.appspot.com" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-messaging-sender-id">Messaging Sender ID:</label>
                        <input type="text" id="firebase-messaging-sender-id" placeholder="123456789012" />
                    </div>
                    <div class="form-group">
                        <label for="firebase-app-id">App ID:</label>
                        <input type="text" id="firebase-app-id" placeholder="1:123456789012:web:abcdef1234567890" />
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" onclick="firebaseConfigManager.applyConfig()">
                            <i class="fas fa-save"></i> 설정 적용
                        </button>
                        <button class="btn btn-secondary" onclick="firebaseConfigManager.resetConfig()">
                            <i class="fas fa-undo"></i> 기본값으로 초기화
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <p class="help-text">
                        <i class="fas fa-info-circle"></i>
                        Firebase 설정 정보는 Firebase 콘솔에서 확인할 수 있습니다.
                        <a href="https://console.firebase.google.com/" target="_blank">Firebase 콘솔 열기</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 현재 설정으로 필드 채우기
        const currentConfig = this.loadConfig();
        document.getElementById('firebase-api-key').value = currentConfig.apiKey || '';
        document.getElementById('firebase-auth-domain').value = currentConfig.authDomain || '';
        document.getElementById('firebase-database-url').value = currentConfig.databaseURL || '';
        document.getElementById('firebase-project-id').value = currentConfig.projectId || '';
        document.getElementById('firebase-storage-bucket').value = currentConfig.storageBucket || '';
        document.getElementById('firebase-messaging-sender-id').value = currentConfig.messagingSenderId || '';
        document.getElementById('firebase-app-id').value = currentConfig.appId || '';
    },

    // 설정 적용
    applyConfig: function() {
        const config = {
            apiKey: document.getElementById('firebase-api-key').value,
            authDomain: document.getElementById('firebase-auth-domain').value,
            databaseURL: document.getElementById('firebase-database-url').value,
            projectId: document.getElementById('firebase-project-id').value,
            storageBucket: document.getElementById('firebase-storage-bucket').value,
            messagingSenderId: document.getElementById('firebase-messaging-sender-id').value,
            appId: document.getElementById('firebase-app-id').value
        };

        // 필수 필드 확인
        if (!config.apiKey || !config.databaseURL) {
            showToast('API Key와 Database URL은 필수 입력 항목입니다.', 'error');
            return;
        }

        this.saveConfig(config);
        document.querySelector('.firebase-config-modal').closest('.modal-overlay').remove();
    },

    // 기본값으로 초기화
    resetConfig: function() {
        if (confirm('정말로 기본값으로 초기화하시겠습니까?')) {
            localStorage.removeItem('firebase-config');
            showToast('Firebase 설정이 초기화되었습니다. 페이지를 새로고침해주세요.');
            document.querySelector('.firebase-config-modal').closest('.modal-overlay').remove();
        }
    }
};

// Firebase 초기화 함수 개선
function initializeFirebase() {
    const config = firebaseConfigManager.loadConfig();
    
    try {
        firebaseApp = firebase.initializeApp(config);
        database = firebase.database();
        auth = firebase.auth();
        console.log('Firebase initialized successfully');
        
        // Firebase가 초기화되면 자동으로 데이터 로드
        setTimeout(() => {
            autoLoadFromLocalStorage();
        }, 1000);
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        showToast('Firebase 초기화 실패. 설정을 확인해주세요.', 'error');
    }
}