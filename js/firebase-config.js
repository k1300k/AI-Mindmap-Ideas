// Firebase 설정
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase 초기화
let firebaseApp = null;
let database = null;
let auth = null;

try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization failed:', error);
}

// Firebase 관련 유틸리티 함수
const firebaseUtils = {
    // 현재 사용자 ID 가져오기 (인증되지 않은 경우 임시 ID 사용)
    getCurrentUserId: function() {
        if (auth && auth.currentUser) {
            return auth.currentUser.uid;
        }
        // 임시 사용자 ID (로컬 스토리지에 저장)
        let tempUserId = localStorage.getItem('tempUserId');
        if (!tempUserId) {
            tempUserId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tempUserId', tempUserId);
        }
        return tempUserId;
    },

    // 마인드맵 데이터를 Firebase에 저장
    saveToFirebase: function(mindmapData, successCallback, errorCallback) {
        if (!database) {
            console.error('Firebase database not initialized');
            if (errorCallback) errorCallback(new Error('Firebase not initialized'));
            return;
        }

        const userId = this.getCurrentUserId();
        const mindmapId = mindmapData.id || 'default';
        
        try {
            const mindmapRef = database.ref(`mindmaps/${userId}/${mindmapId}`);
            mindmapData.lastModified = firebase.database.ServerValue.TIMESTAMP;
            
            mindmapRef.set(mindmapData)
                .then(() => {
                    console.log('Mindmap saved to Firebase');
                    if (successCallback) successCallback();
                })
                .catch((error) => {
                    console.error('Error saving to Firebase:', error);
                    if (errorCallback) errorCallback(error);
                });
        } catch (error) {
            console.error('Error in saveToFirebase:', error);
            if (errorCallback) errorCallback(error);
        }
    },

    // Firebase에서 마인드맵 데이터 불러오기
    loadFromFirebase: function(mindmapId, successCallback, errorCallback) {
        if (!database) {
            console.error('Firebase database not initialized');
            if (errorCallback) errorCallback(new Error('Firebase not initialized'));
            return;
        }

        const userId = this.getCurrentUserId();
        
        try {
            const mindmapRef = database.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
            
            mindmapRef.once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        console.log('Mindmap loaded from Firebase');
                        if (successCallback) successCallback(data);
                    } else {
                        console.log('No mindmap found in Firebase');
                        if (successCallback) successCallback(null);
                    }
                })
                .catch((error) => {
                    console.error('Error loading from Firebase:', error);
                    if (errorCallback) errorCallback(error);
                });
        } catch (error) {
            console.error('Error in loadFromFirebase:', error);
            if (errorCallback) errorCallback(error);
        }
    },

    // Firebase에서 실시간 데이터 감시
    watchMindmap: function(mindmapId, callback) {
        if (!database) return;

        const userId = this.getCurrentUserId();
        const mindmapRef = database.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
        
        return mindmapRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && callback) {
                callback(data);
            }
        });
    },

    // Firebase 감시 중지
    unwatchMindmap: function(mindmapId, callback) {
        if (!database) return;

        const userId = this.getCurrentUserId();
        const mindmapRef = database.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
        mindmapRef.off('value', callback);
    },

    // Firebase 인증 상태 확인
    isAuthenticated: function() {
        return auth && auth.currentUser !== null;
    },

    // Firebase 초기화 상태 확인
    isInitialized: function() {
        return firebaseApp !== null && database !== null;
    }
};