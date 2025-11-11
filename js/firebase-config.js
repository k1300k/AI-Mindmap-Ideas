/**
 * Firebase 유틸리티 함수
 * firebaseConfigManager에서 초기화된 Firebase 인스턴스를 사용합니다.
 */
const firebaseUtils = {
    // 현재 사용자 ID 가져오기 (인증되지 않은 경우 임시 ID 사용)
    getCurrentUserId: function() {
        if (firebaseConfigManager.fbAuth && firebaseConfigManager.fbAuth.currentUser) {
            return firebaseConfigManager.fbAuth.currentUser.uid;
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
        if (!firebaseConfigManager.fbDatabase) {
            console.warn('Firebase database not initialized - data will be saved to LocalStorage only');
            if (errorCallback) errorCallback(new Error('Firebase not initialized'));
            return;
        }

        const userId = this.getCurrentUserId();
        const mindmapId = mindmapData.id || 'default';
        
        try {
            const mindmapRef = firebaseConfigManager.fbDatabase.ref(`mindmaps/${userId}/${mindmapId}`);
            mindmapData.lastModified = firebase.database.ServerValue.TIMESTAMP;
            
            mindmapRef.set(mindmapData)
                .then(() => {
                    console.log('✅ Mindmap saved to Firebase');
                    if (successCallback) successCallback();
                })
                .catch((error) => {
                    console.error('❌ Error saving to Firebase:', error);
                    if (errorCallback) errorCallback(error);
                });
        } catch (error) {
            console.error('❌ Error in saveToFirebase:', error);
            if (errorCallback) errorCallback(error);
        }
    },

    // Firebase에서 마인드맵 데이터 불러오기
    loadFromFirebase: function(mindmapId, successCallback, errorCallback) {
        if (!firebaseConfigManager.fbDatabase) {
            console.warn('Firebase database not initialized - will load from LocalStorage');
            if (errorCallback) errorCallback(new Error('Firebase not initialized'));
            return;
        }

        const userId = this.getCurrentUserId();
        
        try {
            const mindmapRef = firebaseConfigManager.fbDatabase.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
            
            mindmapRef.once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        console.log('✅ Mindmap loaded from Firebase');
                        if (successCallback) successCallback(data);
                    } else {
                        console.log('ℹ️ No mindmap found in Firebase');
                        if (successCallback) successCallback(null);
                    }
                })
                .catch((error) => {
                    console.error('❌ Error loading from Firebase:', error);
                    if (errorCallback) errorCallback(error);
                });
        } catch (error) {
            console.error('❌ Error in loadFromFirebase:', error);
            if (errorCallback) errorCallback(error);
        }
    },

    // Firebase에서 실시간 데이터 감시
    watchMindmap: function(mindmapId, callback) {
        if (!firebaseConfigManager.fbDatabase) return;

        const userId = this.getCurrentUserId();
        const mindmapRef = firebaseConfigManager.fbDatabase.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
        
        return mindmapRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && callback) {
                callback(data);
            }
        });
    },

    // Firebase 감시 중지
    unwatchMindmap: function(mindmapId, callback) {
        if (!firebaseConfigManager.fbDatabase) return;

        const userId = this.getCurrentUserId();
        const mindmapRef = firebaseConfigManager.fbDatabase.ref(`mindmaps/${userId}/${mindmapId || 'default'}`);
        mindmapRef.off('value', callback);
    },

    // Firebase 인증 상태 확인
    isAuthenticated: function() {
        return firebaseConfigManager.fbAuth && firebaseConfigManager.fbAuth.currentUser !== null;
    },

    // Firebase 초기화 상태 확인
    isInitialized: function() {
        return firebaseConfigManager.fbApp !== null && firebaseConfigManager.fbDatabase !== null;
    }
};