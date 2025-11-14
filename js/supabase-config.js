/**
 * Supabase 설정 및 초기화
 * IdeaFlow Mindmap - Supabase Edition
 * 
 * @version 2.0.0
 * @description Supabase 클라이언트 초기화 및 인증 관리
 */

// ==========================================
// Supabase 설정 (여기에 본인의 프로젝트 정보 입력)
// ==========================================
const SUPABASE_CONFIG = {
    url: localStorage.getItem('supabase_url') || '',
    anonKey: localStorage.getItem('supabase_anon_key') || '',
    // 기본 옵션
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

// ==========================================
// Supabase 클라이언트 초기화
// ==========================================
let supabase = null;

/**
 * Supabase 클라이언트 초기화
 * @returns {Object|null} Supabase 클라이언트 또는 null
 */
function initializeSupabase() {
    console.log('🚀 Supabase 초기화 시작...');
    
    // 설정 검증
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.warn('⚠️ Supabase 설정이 필요합니다.');
        return null;
    }

    try {
        // Supabase 클라이언트 생성
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey,
            SUPABASE_CONFIG.options
        );

        console.log('✅ Supabase 클라이언트 초기화 완료');
        return supabase;
    } catch (error) {
        console.error('❌ Supabase 초기화 실패:', error);
        return null;
    }
}

// ==========================================
// 설정 관리 함수
// ==========================================

/**
 * Supabase 설정 저장
 * @param {string} url - Supabase Project URL
 * @param {string} anonKey - Supabase Anon Key
 */
function saveSupabaseConfig(url, anonKey) {
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', anonKey);
    SUPABASE_CONFIG.url = url;
    SUPABASE_CONFIG.anonKey = anonKey;
    console.log('💾 Supabase 설정 저장 완료');
}

/**
 * Supabase 설정 불러오기
 * @returns {Object} { url, anonKey }
 */
function loadSupabaseConfig() {
    return {
        url: localStorage.getItem('supabase_url') || '',
        anonKey: localStorage.getItem('supabase_anon_key') || ''
    };
}

/**
 * Supabase 설정 여부 확인
 * @returns {boolean}
 */
function isSupabaseConfigured() {
    const config = loadSupabaseConfig();
    return !!(config.url && config.anonKey);
}

/**
 * Supabase 설정 삭제
 */
function clearSupabaseConfig() {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    SUPABASE_CONFIG.url = '';
    SUPABASE_CONFIG.anonKey = '';
    supabase = null;
    console.log('🗑️ Supabase 설정 삭제 완료');
}

// ==========================================
// 인증 관련 함수
// ==========================================

/**
 * Google 로그인
 * @returns {Promise<Object>} 인증 결과
 */
async function signInWithGoogle() {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    try {
        console.log('🔐 Google 로그인 시도...');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
        console.log('✅ Google 로그인 성공');
        return data;
    } catch (error) {
        console.error('❌ Google 로그인 실패:', error);
        throw error;
    }
}

/**
 * GitHub 로그인
 * @returns {Promise<Object>} 인증 결과
 */
async function signInWithGitHub() {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    try {
        console.log('🔐 GitHub 로그인 시도...');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
        console.log('✅ GitHub 로그인 성공');
        return data;
    } catch (error) {
        console.error('❌ GitHub 로그인 실패:', error);
        throw error;
    }
}

/**
 * 로그아웃
 * @returns {Promise<void>}
 */
async function signOut() {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    try {
        console.log('🚪 로그아웃 시도...');
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log('✅ 로그아웃 성공');
    } catch (error) {
        console.error('❌ 로그아웃 실패:', error);
        throw error;
    }
}

/**
 * 현재 사용자 정보 가져오기
 * @returns {Promise<Object|null>} 사용자 정보 또는 null
 */
async function getCurrentUser() {
    if (!supabase) {
        console.warn('⚠️ Supabase가 초기화되지 않았습니다.');
        return null;
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('❌ 사용자 정보 가져오기 실패:', error);
        return null;
    }
}

/**
 * 현재 세션 가져오기
 * @returns {Promise<Object|null>} 세션 정보 또는 null
 */
async function getCurrentSession() {
    if (!supabase) {
        console.warn('⚠️ Supabase가 초기화되지 않았습니다.');
        return null;
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('❌ 세션 정보 가져오기 실패:', error);
        return null;
    }
}

/**
 * 인증 상태 변경 리스너 등록
 * @param {Function} callback - 상태 변경 시 호출될 콜백 함수
 * @returns {Object} 구독 객체 (unsubscribe 메소드 포함)
 */
function onAuthStateChange(callback) {
    if (!supabase) {
        console.warn('⚠️ Supabase가 초기화되지 않았습니다.');
        return null;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`🔔 인증 상태 변경: ${event}`);
        callback(event, session);
    });

    return subscription;
}

// ==========================================
// 데이터베이스 관련 함수
// ==========================================

/**
 * 마인드맵 데이터 저장
 * @param {Object} mindmapData - 마인드맵 데이터
 * @returns {Promise<Object>} 저장 결과
 */
async function saveMindmap(mindmapData) {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    try {
        console.log('💾 마인드맵 저장 중...');

        // 기존 마인드맵 확인
        const { data: existing, error: fetchError } = await supabase
            .from('mindmaps')
            .select('id')
            .eq('user_id', user.id)
            .single();

        let result;
        if (existing) {
            // 업데이트
            const { data, error } = await supabase
                .from('mindmaps')
                .update({
                    title: mindmapData.title || '새 마인드맵',
                    data: mindmapData
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
            console.log('✅ 마인드맵 업데이트 완료');
        } else {
            // 새로 생성
            const { data, error } = await supabase
                .from('mindmaps')
                .insert({
                    user_id: user.id,
                    title: mindmapData.title || '새 마인드맵',
                    data: mindmapData
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
            console.log('✅ 마인드맵 생성 완료');
        }

        return result;
    } catch (error) {
        console.error('❌ 마인드맵 저장 실패:', error);
        throw error;
    }
}

/**
 * 마인드맵 데이터 불러오기
 * @returns {Promise<Object|null>} 마인드맵 데이터 또는 null
 */
async function loadMindmap() {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    try {
        console.log('📂 마인드맵 불러오기 중...');
        const { data, error } = await supabase
            .from('mindmaps')
            .select('data')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
            throw error;
        }

        if (data) {
            console.log('✅ 마인드맵 불러오기 완료');
            return data.data;
        } else {
            console.log('ℹ️ 저장된 마인드맵이 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('❌ 마인드맵 불러오기 실패:', error);
        throw error;
    }
}

/**
 * 마인드맵 실시간 구독
 * @param {Function} callback - 데이터 변경 시 호출될 콜백 함수
 * @returns {Promise<Object>} 구독 객체
 */
async function subscribeMindmap(callback) {
    if (!supabase) {
        throw new Error('Supabase가 초기화되지 않았습니다.');
    }

    const user = await getCurrentUser();
    if (!user) {
        throw new Error('로그인이 필요합니다.');
    }

    console.log('🔔 마인드맵 실시간 구독 시작...');

    const subscription = supabase
        .channel('mindmap_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'mindmaps',
                filter: `user_id=eq.${user.id}`
            },
            (payload) => {
                console.log('🔔 마인드맵 변경 감지:', payload);
                callback(payload);
            }
        )
        .subscribe();

    return subscription;
}

// ==========================================
// 유틸리티 함수
// ==========================================

/**
 * 연결 상태 확인
 * @returns {boolean}
 */
function isSupabaseConnected() {
    return !!supabase;
}

/**
 * Supabase 에러 메시지 포맷팅
 * @param {Object} error - Supabase 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
function formatSupabaseError(error) {
    if (!error) return '알 수 없는 오류가 발생했습니다.';

    const errorMessages = {
        'Invalid login credentials': '로그인 정보가 올바르지 않습니다.',
        'Email not confirmed': '이메일 인증이 필요합니다.',
        'User already registered': '이미 등록된 사용자입니다.',
        'Auth session missing!': '로그인이 필요합니다.',
        'JWT expired': '세션이 만료되었습니다. 다시 로그인해주세요.'
    };

    return errorMessages[error.message] || error.message || '오류가 발생했습니다.';
}

// ==========================================
// 초기화
// ==========================================

// 페이지 로드 시 자동 초기화
if (typeof window !== 'undefined') {
    // Supabase SDK 로드 확인
    if (window.supabase) {
        console.log('✅ Supabase SDK 감지');
        // 설정이 있으면 자동 초기화
        if (isSupabaseConfigured()) {
            initializeSupabase();
        } else {
            console.log('ℹ️ Supabase 설정이 필요합니다. 설정 버튼을 눌러주세요.');
        }
    } else {
        console.error('❌ Supabase SDK가 로드되지 않았습니다. index.html에 CDN 스크립트를 추가하세요.');
    }
}

// ==========================================
// 전역 export (window 객체에 함수 노출)
// ==========================================
if (typeof window !== 'undefined') {
    window.SupabaseClient = {
        // 초기화
        initialize: initializeSupabase,
        
        // 설정 관리
        saveConfig: saveSupabaseConfig,
        loadConfig: loadSupabaseConfig,
        isConfigured: isSupabaseConfigured,
        clearConfig: clearSupabaseConfig,
        
        // 인증
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        getCurrentUser,
        getCurrentSession,
        onAuthStateChange,
        
        // 데이터베이스
        saveMindmap,
        loadMindmap,
        subscribeMindmap,
        
        // 유틸리티
        isConnected: isSupabaseConnected,
        formatError: formatSupabaseError,
        
        // Supabase 클라이언트 직접 접근 (고급 사용자용)
        client: () => supabase
    };
}

console.log('📦 Supabase Config 모듈 로드 완료');
