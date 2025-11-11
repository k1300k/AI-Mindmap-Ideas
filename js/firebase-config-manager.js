// Firebase 설정 관리
const firebaseConfigManager = {
    // 글로벌 변수 선언 (중복 방지) - 접두사 추가
    fbApp: null,
    fbDatabase: null,
    fbAuth: null,
    googleUser: null,
    
    // 기본 Firebase 설정 (실제 사용시 변경 필요)
    defaultConfig: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
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

    // 설정 UI 표시 (개발 이력 모달과 유사한 형태)
    showConfigUI: function() {
        console.log('Firebase Config Manager: showConfigUI called');
        
        // 기존 모달이 있다면 제거
        const existingModal = document.getElementById('firebaseConfigModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 개발 이력 모달과 유사한 형태로 변경
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'firebaseConfigModal';
        modal.innerHTML = `
            <div class="modal-content modal-large firebase-config-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> Firebase 설정</h3>
                    <button class="modal-close" id="closeFirebaseConfigModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="config-intro">
                        <h4><i class="fas fa-rocket"></i> 클라우드 저장 활성화</h4>
                        <p>Firebase를 설정하면 마인드맵 데이터를 클라우드에 저장하고 여러 기기에서 동기화할 수 있습니다.</p>
                    </div>

                    <!-- Google 계정 연결 센션 -->
                    <div class="google-signin-section">
                        <h4><i class="fab fa-google"></i> Google 계정 연결</h4>
                        <div id="googleAuthStatus" class="auth-status">
                            <div class="status-indicator">
                                <span class="status-dot disconnected"></span>
                                <span class="status-text">연결되지 않음</span>
                            </div>
                        </div>
                        <button id="googleSignInBtn" class="google-signin-btn">
                            <i class="fab fa-google"></i>
                            <span id="googleBtnText">Google로 로그인</span>
                        </button>
                        <button id="googleSignOutBtn" class="btn btn-secondary" style="display: none;">
                            <i class="fas fa-sign-out-alt"></i> 로그아웃
                        </button>
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
                                                <button class="btn btn-info" id="showManualSetupBtn">
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
                                        <label for="firebase-messaging-sender-id">💬 Messaging Sender ID</label>
                                        <input type="text" id="firebase-messaging-sender-id" placeholder="123456789" />
                                        <small class="help-text">푸시 알림 설정시 필요</small>
                                    </div>

                                    <div class="form-group">
                                        <label for="firebase-app-id">📱 App ID</label>
                                        <input type="text" id="firebase-app-id" placeholder="1:123456789:web:abcdef123456" />
                                        <small class="help-text">앱 등록시 필요</small>
                                    </div>

                                    <div class="form-actions">
                                        <button class="btn btn-secondary" id="testConnectionBtn">
                                            <i class="fas fa-plug"></i> 연결 테스트
                                        </button>
                                        <button class="btn btn-primary" id="saveConfigBtn">
                                            <i class="fas fa-save"></i> 설정 저장
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="tab-panel" id="status">
                                <div class="status-section">
                                    <h4><i class="fas fa-info-circle"></i> 연결 상태</h4>
                                    <div id="connectionStatus" class="status-info">
                                        <div class="status-item">
                                            <span class="status-label">Firebase 상태:</span>
                                            <span id="firebaseStatus" class="status-badge status-disconnected">연결 안됨</span>
                                        </div>
                                        <div class="status-item">
                                            <span class="status-label">데이터베이스:</span>
                                            <span id="databaseStatus" class="status-badge status-disconnected">연결 안됨</span>
                                        </div>
                                        <div class="status-item">
                                            <span class="status-label">인증:</span>
                                            <span id="authStatus" class="status-badge status-disconnected">연결 안됨</span>
                                        </div>
                                        <div class="status-item">
                                            <span class="status-label">Google 계정:</span>
                                            <span id="googleAuthStatusBadge" class="status-badge status-disconnected">연결 안됨</span>
                                        </div>
                                    </div>
                                    <div class="status-actions">
                                        <button class="btn btn-secondary" id="refreshStatusBtn">
                                            <i class="fas fa-sync"></i> 상태 새로고침
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="resetConfigBtn">
                        <i class="fas fa-undo"></i> 초기화
                    </button>
                    <button class="btn btn-primary" id="closeFirebaseBtn">닫기</button>
                </div>
            </div>
        `;

        console.log('Modal HTML created, appending to body...');
        document.body.appendChild(modal);
        console.log('Modal appended to body');

        // 이벤트 리스너 설정
        this.setupConfigEventListeners();
        this.setupGoogleSignIn();
        
        // 현재 설정값 로드
        this.loadCurrentConfig();
        
        // 상태 업데이트
        this.updateConnectionStatus();

        // 닫기 버튼 이벤트 추가
        const closeBtn = document.getElementById('closeFirebaseConfigModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close button clicked');
                modal.remove();
            });
        }

        const closeFirebaseBtn = document.getElementById('closeFirebaseBtn');
        if (closeFirebaseBtn) {
            closeFirebaseBtn.addEventListener('click', () => {
                console.log('Close Firebase button clicked');
                modal.remove();
            });
        }

        // ESC 키로 닫기
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // 모달 외부 클릭으로 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        console.log('Modal setup completed');
    },

    // Google Sign-In 설정
    setupGoogleSignIn: function() {
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        const googleSignOutBtn = document.getElementById('googleSignOutBtn');
        const googleBtnText = document.getElementById('googleBtnText');
        const googleAuthStatusBadge = document.getElementById('googleAuthStatusBadge');

        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => {
                this.signInWithGoogle();
            });
        }

        if (googleSignOutBtn) {
            googleSignOutBtn.addEventListener('click', () => {
                this.signOutFromGoogle();
            });
        }

        // 현재 인증 상태 확인
        this.updateGoogleAuthStatus();
    },

    // Google 로그인
    signInWithGoogle: function() {
        if (!this.fbAuth) {
            showToast('❌ Firebase 인증이 초기화되지 않았습니다. Firebase 설정을 먼저 완료해주세요.', 'error', 5000);
            return;
        }

        // Auth Domain 확인
        const config = this.loadConfig();
        if (!config.authDomain || config.authDomain === '') {
            showToast('❌ Auth Domain이 설정되지 않았습니다. Firebase 설정에서 Auth Domain을 입력해주세요.', 'error', 5000);
            return;
        }

        showToast('🔄 Google 로그인 중...', 'info', 2000);

        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        this.fbAuth.signInWithPopup(provider)
            .then((result) => {
                this.googleUser = result.user;
                this.updateGoogleAuthStatus();
                this.updateHeaderAuthUI(result.user);
                showToast(`✅ 환영합니다, ${result.user.displayName}님!`, 'success', 4000);
                console.log('✅ Google 로그인 성공:', {
                    name: result.user.displayName,
                    email: result.user.email,
                    uid: result.user.uid
                });
            })
            .catch((error) => {
                console.error('❌ Google 로그인 실패:', error);
                
                let errorMessage = 'Google 로그인 실패: ';
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = '로그인 창이 닫혔습니다. 다시 시도해주세요.';
                } else if (error.code === 'auth/popup-blocked') {
                    errorMessage = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.';
                } else if (error.code === 'auth/unauthorized-domain') {
                    errorMessage = '인증되지 않은 도메인입니다. Firebase 콘솔에서 도메인을 추가해주세요.';
                } else {
                    errorMessage += error.message;
                }
                
                showToast(errorMessage, 'error', 6000);
            });
    },

    // Google 로그아웃
    signOutFromGoogle: function() {
        if (!this.fbAuth) {
            showToast('Firebase 인증이 초기화되지 않았습니다.', 'error');
            return;
        }

        const userName = this.googleUser ? this.googleUser.displayName : '사용자';

        this.fbAuth.signOut()
            .then(() => {
                this.googleUser = null;
                this.updateGoogleAuthStatus();
                this.updateHeaderAuthUI(null);
                showToast(`👋 ${userName}님, 로그아웃되었습니다.`, 'info', 3000);
                console.log('✅ Google 로그아웃 성공');
            })
            .catch((error) => {
                console.error('❌ Google 로그아웃 실패:', error);
                showToast('로그아웃 실패: ' + error.message, 'error');
            });
    },

    // Google 인증 상태 업데이트
    updateGoogleAuthStatus: function() {
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        const googleSignOutBtn = document.getElementById('googleSignOutBtn');
        const googleBtnText = document.getElementById('googleBtnText');
        const googleAuthStatusBadge = document.getElementById('googleAuthStatusBadge');
        const googleAuthStatus = document.getElementById('googleAuthStatus');

        // 모달의 상태 표시 업데이트
        if (googleAuthStatus) {
            if (this.googleUser) {
                const statusIndicator = googleAuthStatus.querySelector('.status-indicator');
                if (statusIndicator) {
                    statusIndicator.innerHTML = `
                        <span class="status-dot connected"></span>
                        <span class="status-text">
                            ${this.googleUser.displayName || this.googleUser.email}님이 로그인됨
                        </span>
                    `;
                }
            } else {
                const statusIndicator = googleAuthStatus.querySelector('.status-indicator');
                if (statusIndicator) {
                    statusIndicator.innerHTML = `
                        <span class="status-dot disconnected"></span>
                        <span class="status-text">연결되지 않음</span>
                    `;
                }
            }
        }

        // 버튼 상태 업데이트
        if (googleSignInBtn && googleSignOutBtn) {
            if (this.googleUser) {
                // 로그인 상태
                googleSignInBtn.style.display = 'none';
                googleSignOutBtn.style.display = 'inline-flex';
            } else {
                // 로그아웃 상태
                googleSignInBtn.style.display = 'inline-flex';
                googleSignOutBtn.style.display = 'none';
            }
        }

        // 상태 탭의 배지 업데이트
        if (googleAuthStatusBadge) {
            if (this.googleUser) {
                googleAuthStatusBadge.className = 'status-badge status-connected';
                googleAuthStatusBadge.textContent = '연결됨 (' + (this.googleUser.displayName || this.googleUser.email) + ')';
            } else {
                googleAuthStatusBadge.className = 'status-badge status-disconnected';
                googleAuthStatusBadge.textContent = '연결 안됨';
            }
        }
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

    // 이벤트 리스너 설정
    setupConfigEventListeners: function() {
        const self = this;

        // 탭 버튼
        this.setupTabs();

        // 수동 설정 버튼
        const showManualSetupBtn = document.getElementById('showManualSetupBtn');
        if (showManualSetupBtn) {
            showManualSetupBtn.addEventListener('click', () => {
                this.showManualSetup();
            });
        }

        // 설정 저장 버튼
        const saveConfigBtn = document.getElementById('saveConfigBtn');
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => {
                this.applyConfig();
            });
        }

        // 연결 테스트 버튼
        const testConnectionBtn = document.getElementById('testConnectionBtn');
        if (testConnectionBtn) {
            testConnectionBtn.addEventListener('click', () => {
                this.testConnection();
            });
        }

        // 상태 새로고침 버튼
        const refreshStatusBtn = document.getElementById('refreshStatusBtn');
        if (refreshStatusBtn) {
            refreshStatusBtn.addEventListener('click', () => {
                this.updateConnectionStatus();
            });
        }

        // 초기화 버튼
        const resetConfigBtn = document.getElementById('resetConfigBtn');
        if (resetConfigBtn) {
            resetConfigBtn.addEventListener('click', () => {
                this.resetConfig();
            });
        }
    },

    // 현재 설정값 로드
    loadCurrentConfig: function() {
        const currentConfig = this.loadConfig();
        const apiKeyInput = document.getElementById('firebase-api-key');
        const authDomainInput = document.getElementById('firebase-auth-domain');
        const databaseUrlInput = document.getElementById('firebase-database-url');
        const projectIdInput = document.getElementById('firebase-project-id');
        const storageBucketInput = document.getElementById('firebase-storage-bucket');
        const messagingSenderIdInput = document.getElementById('firebase-messaging-sender-id');
        const appIdInput = document.getElementById('firebase-app-id');

        if (apiKeyInput) apiKeyInput.value = currentConfig.apiKey || '';
        if (authDomainInput) authDomainInput.value = currentConfig.authDomain || '';
        if (databaseUrlInput) databaseUrlInput.value = currentConfig.databaseURL || '';
        if (projectIdInput) projectIdInput.value = currentConfig.projectId || '';
        if (storageBucketInput) storageBucketInput.value = currentConfig.storageBucket || '';
        if (messagingSenderIdInput) messagingSenderIdInput.value = currentConfig.messagingSenderId || '';
        if (appIdInput) appIdInput.value = currentConfig.appId || '';
    },

    // 연결 상태 업데이트
    updateConnectionStatus: function() {
        const firebaseStatus = document.getElementById('firebaseStatus');
        const databaseStatus = document.getElementById('databaseStatus');
        const authStatus = document.getElementById('authStatus');

        if (this.fbApp) {
            if (firebaseStatus) {
                firebaseStatus.className = 'status-badge status-connected';
                firebaseStatus.textContent = '연결됨';
            }
            if (databaseStatus) {
                databaseStatus.className = 'status-badge status-connected';
                databaseStatus.textContent = '연결됨';
            }
            if (authStatus) {
                authStatus.className = 'status-badge status-connected';
                authStatus.textContent = '연결됨';
            }
        } else {
            if (firebaseStatus) {
                firebaseStatus.className = 'status-badge status-disconnected';
                firebaseStatus.textContent = '연결 안됨';
            }
            if (databaseStatus) {
                databaseStatus.className = 'status-badge status-disconnected';
                databaseStatus.textContent = '연결 안됨';
            }
            if (authStatus) {
                authStatus.className = 'status-badge status-disconnected';
                authStatus.textContent = '연결 안됨';
            }
        }
    },

    // 연결 테스트
    testConnection: function() {
        if (!this.fbApp) {
            // showToast 함수가 존재하는지 확인
            if (typeof showToast === 'function') {
                showToast('Firebase가 초기화되지 않았습니다. 설정을 확인해주세요.', 'error');
            } else {
                console.warn('Firebase가 초기화되지 않았습니다. 설정을 확인해주세요.');
            }
            return;
        }

        if (typeof showToast === 'function') {
            showToast('연결 테스트 중...', 'info');
        } else {
            console.log('연결 테스트 중...');
        }
        
        // 간단한 테스트 데이터 저장
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Connection test'
        };

        // 테스트 데이터를 Firebase에 저장
        const testRef = this.fbDatabase.ref('test-connection');
        testRef.set(testData)
            .then(() => {
                if (typeof showToast === 'function') {
                    showToast('✅ Firebase 연결 성공! 클라우드 저장이 활성화되었습니다.', 'success');
                } else {
                    console.log('✅ Firebase 연결 성공! 클라우드 저장이 활성화되었습니다.');
                }
                // 테스트 데이터 삭제
                return testRef.remove();
            })
            .catch((error) => {
                if (typeof showToast === 'function') {
                    showToast('❌ Firebase 연결 실패: ' + error.message, 'error');
                } else {
                    console.error('❌ Firebase 연결 실패:', error.message);
                }
            });
    },

    // 초기화 옵션 표시
    showResetOptions: function() {
        if (confirm('Firebase 설정을 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 현재 설정이 삭제됩니다.')) {
            this.resetConfig();
        }
    },

    // 헤더에 인증 UI 업데이트
    updateHeaderAuthUI: function(user) {
        // 기존 인증 UI 제거
        const existingAuthUI = document.getElementById('headerAuthUI');
        if (existingAuthUI) {
            existingAuthUI.remove();
        }

        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        // 새로운 인증 UI 생성
        const authUI = document.createElement('div');
        authUI.id = 'headerAuthUI';
        authUI.className = 'header-auth-ui';

        if (user) {
            // 로그인 상태
            authUI.innerHTML = `
                <div class="user-info">
                    ${user.photoURL ? `<img src="${user.photoURL}" alt="Profile" class="user-avatar">` : ''}
                    <span class="user-name">${user.displayName || user.email}</span>
                    <button class="btn btn-secondary btn-sm" id="headerSignOutBtn">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </button>
                </div>
            `;
            
            // 로그아웃 버튼 이벤트
            setTimeout(() => {
                const signOutBtn = document.getElementById('headerSignOutBtn');
                if (signOutBtn) {
                    signOutBtn.addEventListener('click', () => {
                        this.signOutFromGoogle();
                    });
                }
            }, 100);
        } else {
            // 로그아웃 상태
            authUI.innerHTML = `
                <button class="btn btn-primary btn-sm" id="headerSignInBtn">
                    <i class="fab fa-google"></i> Google 로그인
                </button>
            `;
            
            // 로그인 버튼 이벤트
            setTimeout(() => {
                const signInBtn = document.getElementById('headerSignInBtn');
                if (signInBtn) {
                    signInBtn.addEventListener('click', () => {
                        this.signInWithGoogle();
                    });
                }
            }, 100);
        }

        // 첫 번째 버튼 앞에 삽입
        headerActions.insertBefore(authUI, headerActions.firstChild);
    }
};

// Firebase 초기화 함수 개선 (변수명 충돌 방지)
function initializeFirebase() {
    const config = firebaseConfigManager.loadConfig();
    
    // 필수 설정 값 확인
    const hasValidConfig = config.apiKey && 
                          config.databaseURL && 
                          config.apiKey !== '' && 
                          config.databaseURL !== '' &&
                          !config.apiKey.startsWith('YOUR_');
    
    if (!hasValidConfig) {
        console.warn('⚠️ Firebase 설정이 없습니다. LocalStorage만 사용합니다.');
        console.info('💡 Firebase 클라우드 저장을 사용하려면 좌측 툴바의 "⚙️ Firebase 설정" 버튼을 클릭하세요.');
        
        // 설정 없음을 사용자에게 한 번만 알림
        if (!localStorage.getItem('firebase-config-notice-shown')) {
            setTimeout(() => {
                if (typeof showToast === 'function') {
                    showToast('💡 Firebase 설정이 필요합니다. 좌측 "⚙️ Firebase 설정" 버튼을 클릭하세요.', 'info', 5000);
                }
                localStorage.setItem('firebase-config-notice-shown', 'true');
            }, 2000);
        }
        return;
    }
    
    try {
        // 이미 초기화된 Firebase 앱이 있다면 재사용
        if (!firebase.apps || firebase.apps.length === 0) {
            firebaseConfigManager.fbApp = firebase.initializeApp(config);
        } else {
            firebaseConfigManager.fbApp = firebase.app();
        }
        
        // Firebase Realtime Database URL이 유효한지 확인
        if (config.databaseURL && config.databaseURL.includes('firebaseio.com')) {
            firebaseConfigManager.fbDatabase = firebase.database();
            console.log('✅ Firebase Realtime Database 연결됨');
        } else {
            console.warn('⚠️ 유효하지 않은 Database URL입니다.');
        }
        
        firebaseConfigManager.fbAuth = firebase.auth();
        console.log('✅ Firebase 초기화 성공');
        
        // Firebase Auth 상태 변경 리스너 설정
        firebaseConfigManager.fbAuth.onAuthStateChanged((user) => {
            if (user) {
                // 로그인 상태
                firebaseConfigManager.googleUser = user;
                console.log('✅ 사용자 로그인됨:', user.displayName || user.email);
                firebaseConfigManager.updateGoogleAuthStatus();
                firebaseConfigManager.updateHeaderAuthUI(user);
            } else {
                // 로그아웃 상태
                firebaseConfigManager.googleUser = null;
                console.log('ℹ️ 사용자 로그아웃됨');
                firebaseConfigManager.updateGoogleAuthStatus();
                firebaseConfigManager.updateHeaderAuthUI(null);
            }
        });
        
        // 초기화 성공 알림
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('✅ Firebase 클라우드 저장이 활성화되었습니다.', 'success');
            }
        }, 1000);
        
        // Firebase가 초기화되면 자동으로 데이터 로드
        setTimeout(() => {
            if (typeof autoLoadFromLocalStorage === 'function') {
                autoLoadFromLocalStorage();
            }
        }, 1500);
        
    } catch (error) {
        console.error('❌ Firebase 초기화 실패:', error);
        
        let errorMessage = 'Firebase 초기화 실패: ';
        if (error.code === 'auth/invalid-api-key') {
            errorMessage += 'API Key가 올바르지 않습니다.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage += '네트워크 연결을 확인하세요.';
        } else {
            errorMessage += error.message || '설정을 확인해주세요.';
        }
        
        if (typeof showToast === 'function') {
            showToast(errorMessage, 'error', 5000);
        }
        
        // 설정 모달 자동 표시 옵션
        console.info('💡 Firebase 설정을 다시 확인하려면 좌측 "⚙️ Firebase 설정" 버튼을 클릭하세요.');
    }
}