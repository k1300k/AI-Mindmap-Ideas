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
                    <h2><i class="fas fa-cloud"></i> Firebase 설정</h2>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="config-intro">
                        <h3><i class="fas fa-rocket"></i> 클라우드 저장 활성화</h3>
                        <p>Firebase를 설정하면 마인드맵 데이터를 클라우드에 저장하고 여러 기기에서 동기화할 수 있습니다.</p>
                    </div>

                    <div class="config-tabs">
                        <div class="tab-buttons">
                            <button class="tab-btn active" data-tab="quick-setup">⚡ 빠른 설정</button>
                            <button class="tab-btn" data-tab="manual-setup">🔧 수동 설정</button>
                            <button class="tab-btn" data-tab="status">📊 연결 상태</button>
                        </div>

                        <div class="tab-content">
                            <div class="tab-panel active" id="quick-setup">
                                <div class="quick-setup-section">
                                    <h4><i class="fas fa-magic"></i> 1분 만에 시작하기</h4>
                                    <div class="setup-steps">
                                        <div class="step">
                                            <span class="step-number">1</span>
                                            <div class="step-content">
                                                <strong>Firebase 프로젝트 만들기</strong>
                                                <p><a href="https://console.firebase.google.com/" target="_blank" class="link-btn">Firebase 콘솔</a>에서 새 프로젝트를 만드세요.</p>
                                            </div>
                                        </div>
                                        <div class="step">
                                            <span class="step-number">2</span>
                                            <div class="step-content">
                                                <strong>Realtime Database 활성화</strong>
                                                <p>왼쪽 메뉴에서 Realtime Database를 찾아 만들기를 클릭하세요.</p>
                                            </div>
                                        </div>
                                        <div class="step">
                                            <span class="step-number">3</span>
                                            <div class="step-content">
                                                <strong>설정 정보 복사</strong>
                                                <p>프로젝트 설정에서 웹 앱을 등록하고 설정 정보를 복사하세요.</p>
                                                <button class="btn btn-info" onclick="firebaseConfigManager.showManualSetup()">
                                                    <i class="fas fa-copy"></i> 수동 설정 열기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-panel" id="manual-setup">
                                <div class="manual-setup-section">
                                    <div class="info-box info-box-info">
                                        <i class="fas fa-info-circle"></i>
                                        <div>
                                            <strong>필수 입력 항목:</strong> API Key와 Database URL만 입력하면 즉시 사용 가능합니다. 다른 필드는 선택사항입니다.
                                        </div>
                                    </div>

                                    <div class="form-group required">
                                        <label for="firebase-api-key">🔑 API Key <span class="required">*</span></label>
                                        <input type="password" id="firebase-api-key" placeholder="AIzaSy..." />
                                        <small class="help-text">Firebase 콘솔의 프로젝트 설정에서 확인 가능</small>
                                    </div>

                                    <div class="form-group required">
                                        <label for="firebase-database-url">🗄️ Database URL <span class="required">*</span></label>
                                        <input type="text" id="firebase-database-url" placeholder="https://your-project-default-rtdb.firebaseio.com" />
                                        <small class="help-text">Realtime Database 페이지에서 URL 확인 가능</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-auth-domain">🔐 Auth Domain</label>
                                        <input type="text" id="firebase-auth-domain" placeholder="your-project.firebaseapp.com" />
                                        <small class="help-text">인증 설정시 필요</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-project-id">📋 Project ID</label>
                                        <input type="text" id="firebase-project-id" placeholder="your-project-id" />
                                        <small class="help-text">프로젝트 고유 ID</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-storage-bucket">📦 Storage Bucket</label>
                                        <input type="text" id="firebase-storage-bucket" placeholder="your-project.appspot.com" />
                                        <small class="help-text">파일 업로드시 필요</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-messaging-sender-id">📨 Messaging Sender ID</label>
                                        <input type="text" id="firebase-messaging-sender-id" placeholder="123456789012" />
                                        <small class="help-text">푸시 알림시 필요</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-app-id">📱 App ID</label>
                                        <input type="text" id="firebase-app-id" placeholder="1:123456789012:web:abcdef1234567890" />
                                        <small class="help-text">앱 고유 ID</small>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-panel" id="status">
                                <div class="status-section">
                                    <h4><i class="fas fa-heartbeat"></i> 연결 상태</h4>
                                    <div class="status-card" id="firebase-status">
                                        <div class="status-indicator">
                                            <span class="status-dot ${firebaseUtils.isInitialized() ? 'connected' : 'disconnected'}"></span>
                                            <span class="status-text">${firebaseUtils.isInitialized() ? '연결됨' : '연결 안됨'}</span>
                                        </div>
                                        <div class="status-details">
                                            <p><strong>현재 상태:</strong> ${firebaseUtils.isInitialized() ? 'Firebase가 활성화되어 있습니다' : 'Firebase가 초기화되지 않았습니다'}</p>
                                            <p><strong>저장소:</strong> ${firebaseUtils.isInitialized() ? 'Firebase Realtime Database' : 'LocalStorage (로컬 저장소)'}</p>
                                            <p><strong>동기화:</strong> ${firebaseUtils.isInitialized() ? '실시간 클라우드 동기화' : '로컬 저장소만 사용 중'}</p>
                                        </div>
                                    </div>

                                    <div class="action-buttons">
                                        <button class="btn btn-success" onclick="firebaseConfigManager.testConnection()" ${!firebaseUtils.isInitialized() ? 'disabled' : ''}>
                                            <i class="fas fa-plug"></i> 연결 테스트
                                        </button>
                                        <button class="btn btn-warning" onclick="firebaseConfigManager.showResetOptions()">
                                            <i class="fas fa-refresh"></i> 초기화 옵션
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button class="btn btn-primary" onclick="firebaseConfigManager.applyConfig()">
                            <i class="fas fa-save"></i> 설정 저장 및 적용
                        </button>
                        <button class="btn btn-secondary" onclick="firebaseConfigManager.resetConfig()">
                            <i class="fas fa-undo"></i> 초기화
                        </button>
                        <button class="btn btn-info" onclick="window.open('https://console.firebase.google.com/', '_blank')">
                            <i class="fas fa-external-link-alt"></i> Firebase 콘솔
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="help-section">
                        <div class="help-grid">
                            <div class="help-item">
                                <i class="fas fa-shield-alt"></i>
                                <span><strong>보안:</strong> API 키는 공개되어도 문제없습니다</span>
                            </div>
                            <div class="help-item">
                                <i class="fas fa-backup"></i>
                                <span><strong>백업:</strong> Firebase 연결 실패시 자동으로 LocalStorage로 전환</span>
                            </div>
                            <div class="help-item">
                                <i class="fas fa-mobile-alt"></i>
                                <span><strong>동기화:</strong> 여러 기기에서 동일한 데이터 접근 가능</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 탭 기능 활성화
        this.setupTabs();
        
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
            apiKey: document.getElementById('firebase-api-key').value.trim(),
            authDomain: document.getElementById('firebase-auth-domain').value.trim(),
            databaseURL: document.getElementById('firebase-database-url').value.trim(),
            projectId: document.getElementById('firebase-project-id').value.trim(),
            storageBucket: document.getElementById('firebase-storage-bucket').value.trim(),
            messagingSenderId: document.getElementById('firebase-messaging-sender-id').value.trim(),
            appId: document.getElementById('firebase-app-id').value.trim()
        };

        // 필수 필드 확인
        if (!config.apiKey || !config.databaseURL) {
            showToast('API Key와 Database URL은 필수 입력 항목입니다.', 'error');
            // 필수 필드 강조
            if (!config.apiKey) {
                document.getElementById('firebase-api-key').style.borderColor = 'var(--danger-color)';
            }
            if (!config.databaseURL) {
                document.getElementById('firebase-database-url').style.borderColor = 'var(--danger-color)';
            }
            return;
        }

        // 기본값 설정
        if (!config.authDomain && config.projectId) {
            config.authDomain = `${config.projectId}.firebaseapp.com`;
        }
        if (!config.storageBucket && config.projectId) {
            config.storageBucket = `${config.projectId}.appspot.com`;
        }

        this.saveConfig(config);
        document.querySelector('.firebase-config-modal').closest('.modal-overlay').remove();
        
        // Firebase 재초기화
        setTimeout(() => {
            initializeFirebase();
        }, 500);
    },

    // 기본값으로 초기화
    resetConfig: function() {
        if (confirm('정말로 기본값으로 초기화하시겠습니까?')) {
            localStorage.removeItem('firebase-config');
            showToast('Firebase 설정이 초기화되었습니다. 페이지를 새로고침해주세요.');
            document.querySelector('.firebase-config-modal').closest('.modal-overlay').remove();
        }
    },

    // 탭 기능 설정
    setupTabs: function() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // 버튼 활성화 토글
                tabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // 패널 표시 토글
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetTab) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    },

    // 수동 설정 탭 표시
    showManualSetup: function() {
        const manualTab = document.querySelector('[data-tab="manual-setup"]');
        if (manualTab) {
            manualTab.click();
        }
    },

    // 연결 테스트
    testConnection: function() {
        if (!firebaseUtils.isInitialized()) {
            showToast('Firebase가 초기화되지 않았습니다. 설정을 확인해주세요.', 'error');
            return;
        }

        showToast('연결 테스트 중...', 'info');
        
        // 간단한 테스트 데이터 저장
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Connection test'
        };

        firebaseUtils.saveToFirebase(
            { id: 'test', ...testData },
            function() {
                showToast('✅ Firebase 연결 성공! 클라우드 저장이 활성화되었습니다.', 'success');
            },
            function(error) {
                showToast('❌ Firebase 연결 실패: ' + error.message, 'error');
            }
        );
    },

    // 초기화 옵션 표시
    showResetOptions: function() {
        if (confirm('Firebase 설정을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 현재 설정이 삭제됩니다.')) {
            this.resetConfig();
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