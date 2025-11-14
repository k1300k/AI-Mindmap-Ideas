// 전역 변수 (이름 충돌 방지를 위해 접두사 추가)
let mainFirebaseApp = null;
let mainDatabase = null;
let mainAuth = null;

// Firebase 초기화 함수 정의 (firebase-config-manager.js의 함수를 사용)
// 이 함수는 이제 firebase-config-manager.js에 정의되어 있으며,
// main.js와 firebase-config-manager.js 모두에서 사용할 수 있습니다.
const state = {
    nodes: [],
    connections: [],
    nextNodeId: 1,
    selectedNode: null,
    draggingNode: null,
    dragOffset: { x: 0, y: 0, startX: 0, startY: 0 },
    connectingMode: false,
    connectingFromNode: null,
    addingChildMode: false,
    parentNodeForNewChild: null,
    linkAddingMode: false,  // 링크 추가 모드
    linkFirstNode: null,     // 링크 추가 첫 번째 노드
    linkSecondNode: null,    // 링크 추가 두 번째 노드
    zoom: 1.0,
    minZoom: 0.25,
    maxZoom: 3.0,
    zoomStep: 0.1,
    panOffset: { x: 0, y: 0 },
    isPanning: false,
    panStart: { x: 0, y: 0 },
    spaceKeyPressed: false
};

// DOM 요소
const canvas = document.getElementById('canvas');
const nodesContainer = document.getElementById('nodesContainer');
const connectionsGroup = document.getElementById('connections');
const contextMenu = document.getElementById('contextMenu');
const colorModal = document.getElementById('colorModal');
const toast = document.getElementById('toast');

// 헤더 로그인 버튼 초기화
function initializeHeaderAuthButtons() {
    const googleSignInBtn = document.getElementById('headerGoogleSignInBtn');
    const githubSignInBtn = document.getElementById('headerGitHubSignInBtn');
    
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            if (typeof firebaseConfigManager !== 'undefined' && firebaseConfigManager.signInWithGoogle) {
                firebaseConfigManager.signInWithGoogle();
            } else {
                showToast('⚠️ Firebase 설정을 먼저 완료해주세요. 좌측 "⚙️ Firebase 설정" 버튼을 클릭하세요.', 'warning', 5000);
            }
        });
    }
    
    if (githubSignInBtn) {
        githubSignInBtn.addEventListener('click', () => {
            if (typeof firebaseConfigManager !== 'undefined' && firebaseConfigManager.signInWithGitHub) {
                firebaseConfigManager.signInWithGitHub();
            } else {
                showToast('⚠️ Firebase 설정을 먼저 완료해주세요. 좌측 "⚙️ Firebase 설정" 버튼을 클릭하세요.', 'warning', 5000);
            }
        });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Firebase 초기화 시도
        if (typeof initializeFirebase === 'function') {
            initializeFirebase();
        } else {
            console.warn('Firebase 초기화 함수를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.warn('Firebase 초기화 실패:', error);
        // Firebase 초기화 실패해도 앱은 계속 작동해야 함
    }
    
    // 헤더 로그인 버튼 초기화
    initializeHeaderAuthButtons();
    
    attachEventListeners();
    autoLoadFromLocalStorage();
    
    // 캔버스 제목 변경 시 자동 저장
    const canvasTitle = document.getElementById('canvasTitle');
    canvasTitle.addEventListener('blur', () => {
        autoSave();
    });
    canvasTitle.addEventListener('input', () => {
        if (canvasTitle.autoSaveTimeout) clearTimeout(canvasTitle.autoSaveTimeout);
        canvasTitle.autoSaveTimeout = setTimeout(() => {
            autoSave();
        }, 1000);
    });
});

// 기본 마인드맵 초기화
function initializeDefaultMap() {
    // 중앙 노드
    createNode({
        id: 'center',
        x: window.innerWidth / 2 - 140,
        y: window.innerHeight / 2 - 70,
        width: 160,
        height: 160,
        color: '#3B82F6',
        content: '모하지?\n어떤가?\n생활',
        size: 'medium'
    });

    // 왼쪽 노드 - 슬기로운 회사생활
    createNode({
        id: 'left1',
        x: window.innerWidth / 2 - 450,
        y: window.innerHeight / 2 - 70,
        width: 160,
        height: 160,
        color: '#84CC16',
        content: '슬기로운\n회사생활',
        size: 'medium'
    });

    // 오른쪽 노드 - 찾에 타면 내비가 알아서
    createNode({
        id: 'right1',
        x: window.innerWidth / 2 + 170,
        y: window.innerHeight / 2 - 70,
        width: 160,
        height: 160,
        color: '#9CA3AF',
        content: '찾에 타면\n내비가 알아서',
        size: 'medium'
    });

    // 왼쪽 상단 서브노드 - 런치톡
    createNode({
        id: 'left-sub1',
        x: window.innerWidth / 2 - 450,
        y: window.innerHeight / 2 - 250,
        width: 120,
        height: 120,
        color: '#FBBF24',
        content: '런치톡\n(소통팀)',
        size: 'small'
    });

    // 왼쪽 하단 서브노드 - 치카치카
    createNode({
        id: 'left-sub2',
        x: window.innerWidth / 2 - 600,
        y: window.innerHeight / 2 + 20,
        width: 120,
        height: 120,
        color: '#FBBF24',
        content: '치카치카',
        size: 'small'
    });

    // 빈 노드들 추가 (장식용)
    const emptyNodePositions = [
        { x: -600, y: -200 },
        { x: -350, y: -250 },
        { x: -250, y: 150 },
        { x: -200, y: -100 },
        { x: 400, y: -200 },
        { x: 350, y: 100 },
        { x: 250, y: -150 },
        { x: 500, y: -50 }
    ];

    emptyNodePositions.forEach((pos, index) => {
        createNode({
            id: `empty-${index}`,
            x: window.innerWidth / 2 + pos.x,
            y: window.innerHeight / 2 + pos.y,
            width: 100,
            height: 100,
            color: '#E5E7EB',
            content: '',
            size: 'small'
        });
    });

    // 연결선 추가
    createConnection('center', 'left1');
    createConnection('center', 'right1');
    createConnection('left1', 'left-sub1');
    createConnection('left1', 'left-sub2');
}

// 노드 생성
function createNode({ id, x, y, width, height, color, content, size = 'medium', memo = '', url = '', urlTitle = '' }) {
    const nodeId = id || `node-${state.nextNodeId++}`;
    
    const node = document.createElement('div');
    node.className = `node size-${size}`;
    node.id = nodeId;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;
    node.style.borderColor = color;
    
    const nodeContent = document.createElement('div');
    nodeContent.className = 'node-content';
    nodeContent.textContent = content;
    node.appendChild(nodeContent);
    
    // 메모 추가
    if (memo) {
        const memoDiv = document.createElement('div');
        memoDiv.className = 'node-memo';
        memoDiv.textContent = memo.length > 50 ? memo.substring(0, 50) + '...' : memo;
        memoDiv.title = memo; // 전체 메모는 툴팁으로
        node.appendChild(memoDiv);
    }
    
    // URL 링크 추가
    if (url) {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'node-link';
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${urlTitle || '링크 열기'}`;
        link.onclick = (e) => {
            e.stopPropagation(); // 노드 드래그 방지
        };
        linkDiv.appendChild(link);
        node.appendChild(linkDiv);
    }
    
    nodesContainer.appendChild(node);
    
    state.nodes.push({
        id: nodeId,
        x,
        y,
        width,
        height,
        color,
        content,
        size,
        memo,
        url,
        urlTitle
    });
    
    attachNodeEventListeners(node);
    return node;
}

// 연결선 생성
function createConnection(fromId, toId) {
    const connection = { from: fromId, to: toId };
    state.connections.push(connection);
    updateConnections();
}

// 연결선 업데이트
function updateConnections() {
    connectionsGroup.innerHTML = '';
    
    state.connections.forEach(conn => {
        const fromNode = document.getElementById(conn.from);
        const toNode = document.getElementById(conn.to);
        
        if (!fromNode || !toNode) return;
        
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const containerRect = nodesContainer.getBoundingClientRect();
        
        const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
        const x2 = toRect.left + toRect.width / 2 - containerRect.left;
        const y2 = toRect.top + toRect.height / 2 - containerRect.top;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`;
        line.setAttribute('d', d);
        line.setAttribute('class', 'connection-line');
        
        connectionsGroup.appendChild(line);
    });
}

// 노드 이벤트 리스너
function attachNodeEventListeners(node) {
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    let isTouchDragging = false;
    let mouseDownPos = { x: 0, y: 0 };
    let hasMovedMouse = false;
    
    // 마우스 드래그 시작
    node.addEventListener('mousedown', (e) => {
        if (e.target.closest('.node-link')) return;
        if (e.target.contentEditable === 'true') return;
        
        // 링크 추가 모드 처리
        if (state.linkAddingMode) {
            handleLinkNodeSelection(node);
            e.preventDefault();
            return;
        }
        
        state.draggingNode = node;
        
        const rect = node.getBoundingClientRect();
        state.dragOffset.x = e.clientX - rect.left;
        state.dragOffset.y = e.clientY - rect.top;
        state.dragOffset.startX = e.clientX;
        state.dragOffset.startY = e.clientY;
        
        e.preventDefault();
    });
    
    // 터치 시작 (모바일)
    node.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartTime = Date.now();
            touchStartPos.x = e.touches[0].clientX;
            touchStartPos.y = e.touches[0].clientY;
            
            const rect = node.getBoundingClientRect();
            state.dragOffset.x = e.touches[0].clientX - rect.left;
            state.dragOffset.y = e.touches[0].clientY - rect.top;
        }
    }, { passive: true });
    
    // 터치 이동 (모바일 드래그)
    node.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && !state.draggingNode) {
            const moveDistance = Math.hypot(
                e.touches[0].clientX - touchStartPos.x,
                e.touches[0].clientY - touchStartPos.y
            );
            
            // 10px 이상 이동하면 드래그 모드
            if (moveDistance > 10) {
                isTouchDragging = true;
                state.draggingNode = node;
                node.classList.add('dragging');
            }
        }
        
        if (state.draggingNode === node && e.touches.length === 1) {
            const x = e.touches[0].clientX - state.dragOffset.x;
            const y = e.touches[0].clientY - state.dragOffset.y;
            
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            
            updateNodePosition(node, x, y);
            updateConnections();
        }
    }, { passive: false });
    
    // 터치 종료
    node.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        
        // 짧은 탭 (300ms 이하) & 이동 없음 = 편집 모달
        if (touchDuration < 300 && !isTouchDragging) {
            state.selectedNode = node;
            // 더블탭 감지는 나중에 구현 가능
        }
        
        // 긴 탭 (500ms 이상) = 컨텍스트 메뉴
        if (touchDuration > 500 && !isTouchDragging) {
            state.selectedNode = node;
            showContextMenu(touchStartPos.x, touchStartPos.y);
        }
        
        if (state.draggingNode === node) {
            node.classList.remove('dragging');
            state.draggingNode = null;
            
            // 터치 드래그 후 자동 저장
            if (isTouchDragging) {
                autoSave();
            }
        }
        
        isTouchDragging = false;
    });
    
    // 더블클릭 편집 - 편집 모달 열기
    node.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (e.target.closest('.node-link')) return; // 링크는 제외
        state.selectedNode = node;
        openEditModal();
    });
    
    // 우클릭 메뉴
    node.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        state.selectedNode = node;
        showContextMenu(e.clientX, e.clientY);
    });
}

// 전역 이벤트 리스너
function attachEventListeners() {
    const canvasWrapper = document.getElementById('canvasWrapper');
    
    // 캔버스 패닝 (Space 키 + 드래그 또는 패닝 모드)
    canvasWrapper.addEventListener('mousedown', (e) => {
        // 노드나 다른 요소를 클릭한 경우 제외
        if (e.target.closest('.node') || e.target.closest('.canvas-title')) {
            return;
        }
        
        // Space 키가 눌려있거나 패닝 모드일 때
        if (state.spaceKeyPressed) {
            state.isPanning = true;
            state.panStart.x = e.clientX - state.panOffset.x;
            state.panStart.y = e.clientY - state.panOffset.y;
            e.preventDefault();
        }
    });
    
    // 드래그 중
    let hasActuallyDragged = false;
    document.addEventListener('mousemove', (e) => {
        // 캔버스 패닝
        if (state.isPanning) {
            const newX = e.clientX - state.panStart.x;
            const newY = e.clientY - state.panStart.y;
            setPan(newX, newY);
            return;
        }
        
        // 노드 드래그
        if (state.draggingNode) {
            // 5px 이상 이동했을 때만 실제 드래그로 간주
            const moveDistance = Math.hypot(
                e.clientX - state.dragOffset.startX,
                e.clientY - state.dragOffset.startY
            );
            
            if (moveDistance > 5) {
                hasActuallyDragged = true;
                state.draggingNode.classList.add('dragging');
                
                const x = e.clientX - state.dragOffset.x;
                const y = e.clientY - state.dragOffset.y;
                
                state.draggingNode.style.left = `${x}px`;
                state.draggingNode.style.top = `${y}px`;
                
                updateNodePosition(state.draggingNode, x, y);
                updateConnections();
            }
        }
    });
    
    // 드래그 종료
    document.addEventListener('mouseup', () => {
        if (state.isPanning) {
            state.isPanning = false;
            // 패닝 후 자동 저장
            autoSave();
        }
        
        if (state.draggingNode) {
            state.draggingNode.classList.remove('dragging');
            
            // 실제로 드래그했을 때만 자동 저장
            if (hasActuallyDragged) {
                autoSave();
            }
            
            state.draggingNode = null;
            hasActuallyDragged = false;
        }
    });
    
    // 편집 완료
    document.addEventListener('click', (e) => {
        const editingNode = document.querySelector('.node.editing');
        if (editingNode && !e.target.closest('.node')) {
            const content = editingNode.querySelector('.node-content');
            content.contentEditable = false;
            editingNode.classList.remove('editing');
            
            updateNodeContent(editingNode, content.textContent);
        }
        
        // 컨텍스트 메뉴 닫기
        if (!e.target.closest('.context-menu')) {
            hideContextMenu();
        }
    });
    
    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        // 입력 필드에서는 단축키 무시
        const isInputField = e.target.closest('input') || e.target.closest('textarea') || e.target.closest('[contenteditable="true"]');
        
        // Space 키로 패닝 모드 토글
        if (e.key === ' ' && !isInputField) {
            e.preventDefault();
            if (!state.spaceKeyPressed) {
                state.spaceKeyPressed = true;
                const panModeBtn = document.getElementById('panModeBtn');
                const panControls = document.getElementById('panControls');
                const canvasWrapper = document.getElementById('canvasWrapper');
                panModeBtn.classList.add('active');
                panControls.classList.add('active');
                canvasWrapper.classList.add('panning');
            }
        }
        
        // 방향키로 패닝 (Shift + 방향키)
        if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            const panStep = 50;
            switch(e.key) {
                case 'ArrowUp':
                    setPan(state.panOffset.x, state.panOffset.y + panStep);
                    break;
                case 'ArrowDown':
                    setPan(state.panOffset.x, state.panOffset.y - panStep);
                    break;
                case 'ArrowLeft':
                    setPan(state.panOffset.x + panStep, state.panOffset.y);
                    break;
                case 'ArrowRight':
                    setPan(state.panOffset.x - panStep, state.panOffset.y);
                    break;
            }
        }
        
        if (e.key === 'n' || e.key === 'N') {
            if (!isInputField) {
                addNewNode();
            }
        }
        
        if (e.key === 'l' || e.key === 'L') {
            if (!isInputField) {
                startLinkAddingMode();
            }
        }
        
        if (e.key === 'Delete' && state.selectedNode) {
            deleteNode(state.selectedNode);
        }
        
        // 줌 단축키 (Ctrl/Cmd + +, -, 0)
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                zoomReset();
            }
        }
        
        if (e.key === 'Escape') {
            hideContextMenu();
            closeEditModal();
            closeColorModal();
            closeAboutModal();
            closeVersionHistoryModal();
            
            // 패닝 모드 해제
            if (state.spaceKeyPressed) {
                state.spaceKeyPressed = false;
                const panModeBtn = document.getElementById('panModeBtn');
                const panControls = document.getElementById('panControls');
                const canvasWrapper = document.getElementById('canvasWrapper');
                panModeBtn.classList.remove('active');
                panControls.classList.remove('active');
                canvasWrapper.classList.remove('panning');
            }
            
            if (state.connectingMode) {
                state.connectingMode = false;
                state.connectingFromNode = null;
                showToast('연결 취소됨');
            }
            if (state.linkAddingMode) {
                exitLinkAddingMode();
                showToast('링크 추가 취소됨', 'info');
            }
            if (state.addingChildMode) {
                state.addingChildMode = false;
                state.parentNodeForNewChild = null;
                // 하이라이트 제거
                document.querySelectorAll('.node').forEach(node => {
                    node.style.boxShadow = '';
                    node.style.cursor = 'move';
                });
                showToast('노드 추가 취소됨');
            }
            if (state.linkAddingMode) {
                state.linkAddingMode = false;
                state.linkFirstNode = null;
                state.linkSecondNode = null;
                // 하이라이트 제거
                document.querySelectorAll('.node').forEach(node => {
                    node.classList.remove('link-selecting');
                    node.style.boxShadow = '';
                    node.style.cursor = 'move';
                });
                showToast('링크 추가 취소됨');
            }
        }
    });
    
    // Space 키 떼면 패닝 모드 해제
    document.addEventListener('keyup', (e) => {
        if (e.key === ' ' && state.spaceKeyPressed) {
            state.spaceKeyPressed = false;
            const panModeBtn = document.getElementById('panModeBtn');
            const panControls = document.getElementById('panControls');
            const canvasWrapper = document.getElementById('canvasWrapper');
            panModeBtn.classList.remove('active');
            panControls.classList.remove('active');
            canvasWrapper.classList.remove('panning');
        }
    });
    
    // 버튼 이벤트
    document.getElementById('addNodeBtn').addEventListener('click', addNewNode);
    document.getElementById('addLinkBtn').addEventListener('click', startLinkAddingMode);
    document.getElementById('saveBtn').addEventListener('click', saveToLocalStorage);
    document.getElementById('loadBtn').addEventListener('click', loadFromLocalStorage);
    document.getElementById('exportBtn').addEventListener('click', exportToPNG);
    
    // 템플릿 버튼
    document.getElementById('loadTemplateDefault').addEventListener('click', () => loadTemplate('default'));
    document.getElementById('loadTemplateBusiness').addEventListener('click', () => loadTemplate('business'));
    document.getElementById('loadTemplateProject').addEventListener('click', () => loadTemplate('project'));
    
    // 컨텍스트 메뉴
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            handleContextMenuAction(action);
        });
    });
    
    // 편집 모달
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveNodeEdit);
    
    // 색상 모달
    document.getElementById('closeColorModal').addEventListener('click', closeColorModal);
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;
            changeNodeColor(color);
        });
    });
    
    // 프로그램 정보 모달
    document.getElementById('showAboutBtn').addEventListener('click', showAboutModal);
    document.getElementById('closeAboutModal').addEventListener('click', closeAboutModal);
    
    // 개발 이력 모달
    document.getElementById('showVersionHistoryBtn').addEventListener('click', showVersionHistoryModal);
    document.getElementById('closeVersionHistoryModal').addEventListener('click', closeVersionHistoryModal);
    
    // Firebase 설정 모달
    document.getElementById('firebaseConfigBtn').addEventListener('click', () => {
        firebaseConfigManager.showConfigUI();
    });
    
    // 줌 컨트롤
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('zoomResetBtn').addEventListener('click', zoomReset);
    document.getElementById('panModeBtn').addEventListener('click', togglePanMode);
    
    // 패닝 컨트롤
    document.getElementById('panUpBtn').addEventListener('click', () => panByDirection('up'));
    document.getElementById('panDownBtn').addEventListener('click', () => panByDirection('down'));
    document.getElementById('panLeftBtn').addEventListener('click', () => panByDirection('left'));
    document.getElementById('panRightBtn').addEventListener('click', () => panByDirection('right'));
    document.getElementById('panCenterBtn').addEventListener('click', () => panByDirection('center'));
    
    // 터치 제스처 및 마우스 휠 줌 초기화
    initializeTouchGestures();
    
    // 윈도우 리사이즈
    window.addEventListener('resize', updateConnections);
}

// 새 노드 추가
function addNewNode() {
    state.addingChildMode = true;
    showToast('자식 노드를 추가할 부모 노드를 클릭하세요 (ESC: 취소)');
    
    // 모든 노드에 하이라이트 효과
    document.querySelectorAll('.node').forEach(node => {
        node.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
        node.style.cursor = 'pointer';
    });
    
    // 클릭 이벤트 리스너 추가
    const handleParentSelection = (e) => {
        const parentNode = e.target.closest('.node');
        if (parentNode && state.addingChildMode) {
            state.parentNodeForNewChild = parentNode;
            createChildNode(parentNode);
            
            // 하이라이트 제거
            document.querySelectorAll('.node').forEach(node => {
                node.style.boxShadow = '';
                node.style.cursor = 'move';
            });
            
            state.addingChildMode = false;
            state.parentNodeForNewChild = null;
            document.removeEventListener('click', handleParentSelection);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', handleParentSelection);
    }, 100);
}

// 자식 노드 생성
function createChildNode(parentNode) {
    const parentData = state.nodes.find(n => n.id === parentNode.id);
    if (!parentData) return;
    
    const parentRect = parentNode.getBoundingClientRect();
    const containerRect = nodesContainer.getBoundingClientRect();
    
    // 부모 노드의 위치 계산
    const parentX = parentRect.left - containerRect.left;
    const parentY = parentRect.top - containerRect.top;
    
    // 부모 노드의 기존 자식 수 계산
    const childCount = state.connections.filter(conn => conn.from === parentNode.id).length;
    
    // 자식 노드의 위치 계산 (부모 주변에 원형으로 배치)
    const angle = (childCount * 60) * (Math.PI / 180); // 60도씩 회전
    const distance = 200; // 부모로부터의 거리
    
    const childX = parentX + Math.cos(angle) * distance;
    const childY = parentY + Math.sin(angle) * distance;
    
    // 부모와 같은 크기의 자식 노드 생성
    const childSize = parentData.size || 'medium';
    const childWidth = childSize === 'small' ? 120 : childSize === 'large' ? 180 : 140;
    const childHeight = childWidth;
    
    // 자식 노드 생성 (부모 색상 상속)
    const newNode = createNode({
        x: childX,
        y: childY,
        width: childWidth,
        height: childHeight,
        color: parentData.color, // 부모 색상 상속
        content: '새 아이디어',
        size: childSize,
        memo: '',
        url: '',
        urlTitle: ''
    });
    
    // 부모와 자식 자동 연결
    createConnection(parentNode.id, newNode.id);
    
    // 자동 저장
    autoSave();
    
    showToast(`${parentData.content.substring(0, 10)}... 노드에 자식이 추가되었습니다`);
}

// 링크 추가 모드 시작
function startLinkAddingMode() {
    state.linkAddingMode = true;
    state.linkFirstNode = null;
    state.linkSecondNode = null;
    
    showToast('🔗 첫 번째 노드를 선택하세요 (ESC: 취소)', 'info', 4000);
    
    // 모든 노드에 하이라이트 효과
    document.querySelectorAll('.node').forEach(node => {
        node.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
        node.style.cursor = 'pointer';
        node.classList.add('link-selectable');
    });
    
    // 첫 번째 노드 선택 이벤트
    const handleFirstNodeSelection = (e) => {
        const clickedNode = e.target.closest('.node');
        if (clickedNode && state.linkAddingMode && !state.linkFirstNode) {
            e.stopPropagation();
            state.linkFirstNode = clickedNode;
            
            // 첫 번째 노드 강조
            clickedNode.style.boxShadow = '0 0 30px rgba(34, 197, 94, 1)';
            clickedNode.style.border = '3px solid #22c55e';
            clickedNode.classList.add('link-selected');
            
            showToast('✅ 첫 번째 노드 선택됨. 연결할 두 번째 노드를 선택하세요', 'success', 4000);
            
            // 두 번째 노드 선택 대기
            document.removeEventListener('click', handleFirstNodeSelection);
            setTimeout(() => {
                document.addEventListener('click', handleSecondNodeSelection);
            }, 100);
        }
    };
    
    // 두 번째 노드 선택 이벤트
    const handleSecondNodeSelection = (e) => {
        const clickedNode = e.target.closest('.node');
        if (clickedNode && state.linkAddingMode && state.linkFirstNode) {
            e.stopPropagation();
            
            // 같은 노드를 선택한 경우
            if (clickedNode === state.linkFirstNode) {
                showToast('⚠️ 같은 노드는 연결할 수 없습니다. 다른 노드를 선택하세요', 'warning', 4000);
                return;
            }
            
            state.linkSecondNode = clickedNode;
            
            // 두 번째 노드 강조
            clickedNode.style.boxShadow = '0 0 30px rgba(34, 197, 94, 1)';
            clickedNode.style.border = '3px solid #22c55e';
            clickedNode.classList.add('link-selected');
            
            // 연결 생성
            const firstNodeId = state.linkFirstNode.id;
            const secondNodeId = state.linkSecondNode.id;
            
            // 이미 연결되어 있는지 확인
            const alreadyConnected = state.connections.some(
                conn => (conn.from === firstNodeId && conn.to === secondNodeId) ||
                        (conn.from === secondNodeId && conn.to === firstNodeId)
            );
            
            if (alreadyConnected) {
                showToast('⚠️ 이미 연결된 노드입니다', 'warning', 3000);
            } else {
                createConnection(firstNodeId, secondNodeId);
                updateConnections();
                autoSave();
                showToast('🎉 링크가 생성되었습니다!', 'success', 3000);
            }
            
            // 링크 추가 모드 종료
            exitLinkAddingMode();
            document.removeEventListener('click', handleSecondNodeSelection);
        }
    };
    
    // 첫 번째 노드 선택 이벤트 등록
    setTimeout(() => {
        document.addEventListener('click', handleFirstNodeSelection);
    }, 100);
}

// 링크 추가 모드 종료
function exitLinkAddingMode() {
    state.linkAddingMode = false;
    state.linkFirstNode = null;
    state.linkSecondNode = null;
    
    // 모든 노드의 하이라이트 제거
    document.querySelectorAll('.node').forEach(node => {
        node.style.boxShadow = '';
        node.style.border = '';
        node.style.cursor = 'move';
        node.classList.remove('link-selectable', 'link-selected');
    });
}

// 컨텍스트 메뉴 표시
function showContextMenu(x, y) {
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('active');
}

function hideContextMenu() {
    contextMenu.classList.remove('active');
}

// 컨텍스트 메뉴 액션 처리
function handleContextMenuAction(action) {
    if (!state.selectedNode) return;
    
    switch(action) {
        case 'edit':
            openEditModal();
            break;
            
        case 'changeColor':
            openColorModal();
            break;
            
        case 'resize':
            cycleNodeSize(state.selectedNode);
            break;
            
        case 'connect':
            startConnecting();
            break;
            
        case 'delete':
            deleteNode(state.selectedNode);
            break;
    }
    
    hideContextMenu();
}

// 노드 편집 모달
function openEditModal() {
    if (!state.selectedNode) return;
    
    const editModal = document.getElementById('editModal');
    const nodeData = state.nodes.find(n => n.id === state.selectedNode.id);
    
    if (nodeData) {
        document.getElementById('nodeTitle').value = nodeData.content || '';
        document.getElementById('nodeMemo').value = nodeData.memo || '';
        document.getElementById('nodeUrl').value = nodeData.url || '';
        document.getElementById('nodeUrlTitle').value = nodeData.urlTitle || '';
    }
    
    editModal.classList.add('active');
    document.getElementById('nodeTitle').focus();
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.classList.remove('active');
}

function saveNodeEdit() {
    if (!state.selectedNode) return;
    
    const title = document.getElementById('nodeTitle').value.trim();
    const memo = document.getElementById('nodeMemo').value.trim();
    const url = document.getElementById('nodeUrl').value.trim();
    const urlTitle = document.getElementById('nodeUrlTitle').value.trim();
    
    if (!title) {
        alert('제목을 입력해주세요');
        return;
    }
    
    // 노드 데이터 업데이트
    const nodeData = state.nodes.find(n => n.id === state.selectedNode.id);
    if (nodeData) {
        nodeData.content = title;
        nodeData.memo = memo;
        nodeData.url = url;
        nodeData.urlTitle = urlTitle;
    }
    
    // 노드 DOM 업데이트
    updateNodeDisplay(state.selectedNode, title, memo, url, urlTitle);
    
    // 자동 저장
    autoSave();
    
    closeEditModal();
    showToast('노드가 업데이트되었습니다');
}

// 노드 화면 업데이트
function updateNodeDisplay(node, title, memo, url, urlTitle) {
    // 제목 업데이트
    const contentDiv = node.querySelector('.node-content');
    contentDiv.textContent = title;
    
    // 기존 메모/링크 제거
    const existingMemo = node.querySelector('.node-memo');
    const existingLink = node.querySelector('.node-link');
    if (existingMemo) existingMemo.remove();
    if (existingLink) existingLink.remove();
    
    // 메모 추가
    if (memo) {
        const memoDiv = document.createElement('div');
        memoDiv.className = 'node-memo';
        memoDiv.textContent = memo.length > 50 ? memo.substring(0, 50) + '...' : memo;
        memoDiv.title = memo;
        node.appendChild(memoDiv);
    }
    
    // URL 링크 추가
    if (url) {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'node-link';
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${urlTitle || '링크 열기'}`;
        link.onclick = (e) => {
            e.stopPropagation();
        };
        linkDiv.appendChild(link);
        node.appendChild(linkDiv);
    }
}

// 색상 모달
function openColorModal() {
    colorModal.classList.add('active');
}

function closeColorModal() {
    colorModal.classList.remove('active');
}

function changeNodeColor(color) {
    if (state.selectedNode) {
        state.selectedNode.style.borderColor = color;
        
        const nodeData = state.nodes.find(n => n.id === state.selectedNode.id);
        if (nodeData) {
            nodeData.color = color;
        }
        
        // 자동 저장
        autoSave();
        
        showToast('색상이 변경되었습니다');
    }
    closeColorModal();
}

// 노드 크기 순환
function cycleNodeSize(node) {
    const currentSize = node.classList.contains('size-small') ? 'small' :
                       node.classList.contains('size-large') ? 'large' : 'medium';
    
    let newSize;
    if (currentSize === 'small') newSize = 'medium';
    else if (currentSize === 'medium') newSize = 'large';
    else newSize = 'small';
    
    node.classList.remove('size-small', 'size-medium', 'size-large');
    node.classList.add(`size-${newSize}`);
    
    const nodeData = state.nodes.find(n => n.id === node.id);
    if (nodeData) {
        nodeData.size = newSize;
    }
    
    updateConnections();
    
    // 자동 저장
    autoSave();
    
    showToast(`크기 변경: ${newSize}`);
}

// 연결 시작
function startConnecting() {
    state.connectingMode = true;
    state.connectingFromNode = state.selectedNode;
    showToast('연결할 노드를 클릭하세요 (ESC: 취소)');
    
    // 다음 노드 클릭 대기
    const handleNodeClick = (e) => {
        const targetNode = e.target.closest('.node');
        if (targetNode && targetNode !== state.connectingFromNode) {
            createConnection(state.connectingFromNode.id, targetNode.id);
            
            // 자동 저장
            autoSave();
            
            showToast('노드가 연결되었습니다');
            state.connectingMode = false;
            state.connectingFromNode = null;
            document.removeEventListener('click', handleNodeClick);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', handleNodeClick);
    }, 100);
}

// 노드 삭제
function deleteNode(node) {
    const nodeId = node.id;
    
    // 연결선 제거
    state.connections = state.connections.filter(
        conn => conn.from !== nodeId && conn.to !== nodeId
    );
    
    // 노드 데이터 제거
    state.nodes = state.nodes.filter(n => n.id !== nodeId);
    
    // DOM에서 제거
    node.remove();
    
    // 자동 저장
    autoSave();
    
    updateConnections();
    showToast('노드가 삭제되었습니다');
}

// 노드 위치 업데이트
function updateNodePosition(node, x, y) {
    const nodeData = state.nodes.find(n => n.id === node.id);
    if (nodeData) {
        nodeData.x = x;
        nodeData.y = y;
    }
}

// 노드 콘텐츠 업데이트
function updateNodeContent(node, content) {
    const nodeData = state.nodes.find(n => n.id === node.id);
    if (nodeData) {
        nodeData.content = content;
    }
}

// JSON 파일로 저장
// 자동 저장 (Firebase + LocalStorage 백업)
function autoSave() {
    const data = {
        id: 'default',
        version: '1.3.0',
        title: document.getElementById('canvasTitle').textContent,
        nodes: state.nodes,
        connections: state.connections,
        zoom: state.zoom,
        panOffset: state.panOffset,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Firebase에 저장 시도
    if (firebaseUtils.isInitialized()) {
        firebaseUtils.saveToFirebase(data, 
            function() {
                console.log('자동 저장 완료 (Firebase)');
            },
            function(error) {
                console.error('Firebase 저장 실패, LocalStorage로 대체:', error);
                // Firebase 실패시 LocalStorage에 백업
                const jsonString = JSON.stringify(data, null, 2);
                localStorage.setItem('mindmap-data', jsonString);
            }
        );
    } else {
        // Firebase가 초기화되지 않은 경우 LocalStorage에만 저장
        const jsonString = JSON.stringify(data, null, 2);
        localStorage.setItem('mindmap-data', jsonString);
        console.log('자동 저장 완료 (LocalStorage)');
    }
}

// JSON 파일로 저장 (다운로드)
function saveToLocalStorage() {
    const data = {
        version: '1.3.0',
        title: document.getElementById('canvasTitle').textContent,
        nodes: state.nodes,
        connections: state.connections,
        zoom: state.zoom,
        panOffset: state.panOffset,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // JSON 파일 다운로드
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 로컬 스토리지에도 저장 (백업용)
    if (firebaseUtils.isInitialized()) {
        firebaseUtils.saveToFirebase(data, 
            function() {
                console.log('JSON 파일 저장 완료 (Firebase)');
            },
            function(error) {
                console.error('Firebase 저장 실패, LocalStorage로 대체:', error);
                localStorage.setItem('mindmap-data', jsonString);
            }
        );
    } else {
        localStorage.setItem('mindmap-data', jsonString);
    }
    
    showToast('JSON 파일로 저장되었습니다');
}

// JSON 파일에서 불러오기
function loadFromLocalStorage() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.json')) {
            alert('JSON 파일만 불러올 수 있습니다');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                loadMindmapData(data);
                showToast('JSON 파일을 불러왔습니다');
            } catch (error) {
                console.error('파일 읽기 실패:', error);
                alert('JSON 파일 형식이 올바르지 않습니다');
            }
        };
        reader.readAsText(file);
        
        // 파일 입력 초기화
        fileInput.value = '';
    };
}

// 마인드맵 데이터 로드
function loadMindmapData(data) {
    // 기존 데이터 초기화
    nodesContainer.innerHTML = '';
    state.nodes = [];
    state.connections = [];
    
    // 타이틀 복원
    if (data.title) {
        document.getElementById('canvasTitle').textContent = data.title;
    }
    
    // 노드 복원
    if (data.nodes && Array.isArray(data.nodes)) {
        data.nodes.forEach(nodeData => {
            createNode(nodeData);
        });
    }
    
    // 연결선 복원
    if (data.connections && Array.isArray(data.connections)) {
        state.connections = data.connections;
        updateConnections();
    }
    
    // 줌 및 패닝 복원
    if (data.zoom !== undefined) {
        setZoom(data.zoom);
    }
    if (data.panOffset) {
        setPan(data.panOffset.x, data.panOffset.y);
    }
    
    // 로컬 스토리지에도 저장
    localStorage.setItem('mindmap-data', JSON.stringify(data));
}

// 페이지 로드 시 자동으로 Firebase에서 불러오기 (LocalStorage 백업)
function autoLoadFromLocalStorage() {
    // Firebase에서 먼저 시도
    if (firebaseUtils.isInitialized()) {
        firebaseUtils.loadFromFirebase('default',
            function(data) {
                if (data) {
                    // Firebase에서 데이터를 찾은 경우
                    console.log('Firebase에서 데이터 불러오기 성공');
                    loadMindmapData(data);
                } else {
                    // Firebase에 데이터가 없는 경우 LocalStorage에서 시도
                    loadFromLocalStorageBackup();
                }
            },
            function(error) {
                console.error('Firebase에서 불러오기 실패, LocalStorage로 대체:', error);
                loadFromLocalStorageBackup();
            }
        );
    } else {
        // Firebase가 초기화되지 않은 경우 LocalStorage에서만 시도
        loadFromLocalStorageBackup();
    }
}

// LocalStorage 백업에서 불러오기
function loadFromLocalStorageBackup() {
    const saved = localStorage.getItem('mindmap-data');
    
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // 마이그레이션: "블핀" -> "불편" 자동 수정
            if (data.title && data.title.includes('블핀')) {
                data.title = data.title.replace(/블핀/g, '불편');
                console.log('제목 자동 수정: 블핀 -> 불편');
                // 수정된 데이터를 다시 저장
                localStorage.setItem('mindmap-data', JSON.stringify(data));
            }
            
            loadMindmapData(data);
            console.log('자동으로 이전 작업을 불러왔습니다 (LocalStorage)');
        } catch (e) {
            console.error('자동 불러오기 실패:', e);
            // 실패하면 기본 맵 로드
            initializeDefaultMap();
        }
    } else {
        // 저장된 데이터가 없으면 기본 맵 로드
        initializeDefaultMap();
    }
}

// PNG 내보내기
function exportToPNG() {
    if (typeof html2canvas === 'undefined') {
        showToast('html2canvas 라이브러리 로딩 중...');
        return;
    }
    
    showToast('PNG 내보내기 중...');
    
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    
    // html2canvas 옵션 설정
    html2canvas(canvasWrapper, {
        backgroundColor: '#f8fafc',
        scale: 2, // 고해상도
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        // 타임스탬프 생성
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `mindmap_${timestamp}.png`;
        
        // PNG 다운로드
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('PNG 파일이 다운로드되었습니다');
    }).catch(error => {
        console.error('PNG 내보내기 오류:', error);
        showToast('PNG 내보내기에 실패했습니다');
    });
}

// 템플릿 로드
function loadTemplate(type) {
    if (!confirm('현재 작업이 삭제됩니다. 계속하시겠습니까?')) return;
    
    // 기존 데이터 초기화
    nodesContainer.innerHTML = '';
    state.nodes = [];
    state.connections = [];
    state.nextNodeId = 1;
    
    switch(type) {
        case 'default':
            document.getElementById('canvasTitle').textContent = '질문으로 접근하는 생활형 불편 대응 아이디어';
            initializeDefaultMap();
            break;
            
        case 'business':
            document.getElementById('canvasTitle').textContent = '비즈니스 아이디어 맵';
            initializeBusinessTemplate();
            break;
            
        case 'project':
            document.getElementById('canvasTitle').textContent = '프로젝트 계획';
            initializeProjectTemplate();
            break;
    }
    
    showToast('템플릿이 로드되었습니다');
}

// 비즈니스 템플릿
function initializeBusinessTemplate() {
    const centerX = window.innerWidth / 2 - 140;
    const centerY = window.innerHeight / 2 - 70;
    
    createNode({
        id: 'center',
        x: centerX,
        y: centerY,
        width: 160,
        height: 160,
        color: '#3B82F6',
        content: '비즈니스\n아이디어',
        size: 'large'
    });
    
    createNode({
        id: 'market',
        x: centerX - 300,
        y: centerY - 200,
        width: 140,
        height: 140,
        color: '#10B981',
        content: '시장 분석',
        size: 'medium'
    });
    
    createNode({
        id: 'product',
        x: centerX + 300,
        y: centerY - 200,
        width: 140,
        height: 140,
        color: '#F59E0B',
        content: '제품/서비스',
        size: 'medium'
    });
    
    createNode({
        id: 'revenue',
        x: centerX - 300,
        y: centerY + 100,
        width: 140,
        height: 140,
        color: '#8B5CF6',
        content: '수익 모델',
        size: 'medium'
    });
    
    createNode({
        id: 'marketing',
        x: centerX + 300,
        y: centerY + 100,
        width: 140,
        height: 140,
        color: '#EC4899',
        content: '마케팅 전략',
        size: 'medium'
    });
    
    createConnection('center', 'market');
    createConnection('center', 'product');
    createConnection('center', 'revenue');
    createConnection('center', 'marketing');
}

// 프로젝트 템플릿
function initializeProjectTemplate() {
    const centerX = window.innerWidth / 2 - 140;
    const centerY = window.innerHeight / 2 - 70;
    
    createNode({
        id: 'center',
        x: centerX,
        y: centerY,
        width: 160,
        height: 160,
        color: '#3B82F6',
        content: '프로젝트\n목표',
        size: 'large'
    });
    
    createNode({
        id: 'planning',
        x: centerX - 250,
        y: centerY - 150,
        width: 130,
        height: 130,
        color: '#14B8A6',
        content: '기획',
        size: 'medium'
    });
    
    createNode({
        id: 'design',
        x: centerX + 250,
        y: centerY - 150,
        width: 130,
        height: 130,
        color: '#F59E0B',
        content: '디자인',
        size: 'medium'
    });
    
    createNode({
        id: 'development',
        x: centerX - 250,
        y: centerY + 100,
        width: 130,
        height: 130,
        color: '#8B5CF6',
        content: '개발',
        size: 'medium'
    });
    
    createNode({
        id: 'testing',
        x: centerX + 250,
        y: centerY + 100,
        width: 130,
        height: 130,
        color: '#EF4444',
        content: '테스트',
        size: 'medium'
    });
    
    createNode({
        id: 'deploy',
        x: centerX,
        y: centerY + 250,
        width: 130,
        height: 130,
        color: '#10B981',
        content: '배포',
        size: 'medium'
    });
    
    createConnection('center', 'planning');
    createConnection('center', 'design');
    createConnection('center', 'development');
    createConnection('center', 'testing');
    createConnection('planning', 'development');
    createConnection('design', 'development');
    createConnection('development', 'testing');
    createConnection('testing', 'deploy');
}

// 토스트 표시
function showToast(message, type = 'info', duration = 3000) {
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    
    // 기존 타입 클래스 제거
    toast.classList.remove('toast-success', 'toast-error', 'toast-warning', 'toast-info');
    
    // 타입별 클래스 추가
    if (type === 'success') {
        toast.classList.add('toast-success');
    } else if (type === 'error') {
        toast.classList.add('toast-error');
    } else if (type === 'warning') {
        toast.classList.add('toast-warning');
    } else {
        toast.classList.add('toast-info');
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

// 프로그램 설명 모달
function showAboutModal() {
    const aboutModal = document.getElementById('aboutModal');
    aboutModal.classList.add('active');
    
    // 배경 클릭시 닫기
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            closeAboutModal();
        }
    });
}

function closeAboutModal() {
    const aboutModal = document.getElementById('aboutModal');
    aboutModal.classList.remove('active');
}

// 개발 이력 모달
function showVersionHistoryModal() {
    const versionHistoryModal = document.getElementById('versionHistoryModal');
    versionHistoryModal.classList.add('active');
    
    // 배경 클릭시 닫기
    versionHistoryModal.addEventListener('click', (e) => {
        if (e.target === versionHistoryModal) {
            closeVersionHistoryModal();
        }
    });
}

function closeVersionHistoryModal() {
    const versionHistoryModal = document.getElementById('versionHistoryModal');
    versionHistoryModal.classList.remove('active');
}

// 줌 및 패닝 적용
function applyTransform() {
    const nodesContainer = document.getElementById('nodesContainer');
    const canvas = document.getElementById('canvas');
    
    const transform = `translate(${state.panOffset.x}px, ${state.panOffset.y}px) scale(${state.zoom})`;
    
    if (nodesContainer) {
        nodesContainer.style.transform = transform;
    }
    if (canvas) {
        canvas.style.transform = transform;
    }
    
    // 연결선 업데이트
    updateConnections();
}

// 줌 기능
function setZoom(newZoom) {
    state.zoom = Math.max(state.minZoom, Math.min(state.maxZoom, newZoom));
    
    applyTransform();
    
    // 줌 레벨 표시 업데이트
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    
    // 자동 저장 (디바운스)
    if (setZoom.timeout) clearTimeout(setZoom.timeout);
    setZoom.timeout = setTimeout(() => {
        autoSave();
    }, 500);
}

// 패닝 설정
function setPan(x, y) {
    state.panOffset.x = x;
    state.panOffset.y = y;
    applyTransform();
}

function zoomIn() {
    setZoom(state.zoom + state.zoomStep);
}

function zoomOut() {
    setZoom(state.zoom - state.zoomStep);
}

function zoomReset() {
    setZoom(1.0);
    setPan(0, 0);
}

// 패닝 모드 토글
function togglePanMode() {
    state.spaceKeyPressed = !state.spaceKeyPressed;
    const panModeBtn = document.getElementById('panModeBtn');
    const panControls = document.getElementById('panControls');
    const canvasWrapper = document.getElementById('canvasWrapper');
    
    if (state.spaceKeyPressed) {
        panModeBtn.classList.add('active');
        panControls.classList.add('active');
        canvasWrapper.classList.add('panning');
        showToast('캔버스 이동 모드 활성화 (드래그하여 이동)');
    } else {
        panModeBtn.classList.remove('active');
        panControls.classList.remove('active');
        canvasWrapper.classList.remove('panning');
        showToast('캔버스 이동 모드 비활성화');
    }
}

// 방향키로 패닝
function panByDirection(direction) {
    const panStep = 100;
    
    switch(direction) {
        case 'up':
            setPan(state.panOffset.x, state.panOffset.y + panStep);
            break;
        case 'down':
            setPan(state.panOffset.x, state.panOffset.y - panStep);
            break;
        case 'left':
            setPan(state.panOffset.x + panStep, state.panOffset.y);
            break;
        case 'right':
            setPan(state.panOffset.x - panStep, state.panOffset.y);
            break;
        case 'center':
            setPan(0, 0);
            showToast('캔버스가 중앙으로 이동되었습니다');
            break;
    }
}

// 터치 제스처 지원 (핀치 줌)
function initializeTouchGestures() {
    const canvasWrapper = document.getElementById('canvasWrapper');
    let touchStartDistance = 0;
    let touchStartZoom = 1;
    let isPinching = false;
    
    canvasWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // 두 손가락 터치 시작 - 핀치 줌 모드
            isPinching = true;
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            touchStartZoom = state.zoom;
            e.preventDefault();
        } else {
            isPinching = false;
        }
    }, { passive: false });
    
    canvasWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && isPinching) {
            // 핀치 줌
            e.preventDefault();
            e.stopPropagation();
            
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (touchStartDistance > 0) {
                const scale = currentDistance / touchStartDistance;
                const newZoom = touchStartZoom * scale;
                setZoom(newZoom);
            }
        }
    }, { passive: false });
    
    canvasWrapper.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            isPinching = false;
        }
    }, { passive: false });
    
    canvasWrapper.addEventListener('touchcancel', () => {
        isPinching = false;
    }, { passive: false });
    
    // 마우스 휠 줌 (데스크톱)
    canvasWrapper.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY / 1000;
            setZoom(state.zoom + delta);
        }
    }, { passive: false });
    
    // 더블탭 줌 방지 (브라우저 기본 동작)
    canvasWrapper.addEventListener('dblclick', (e) => {
        // 노드가 아닌 경우에만 줌 리셋
        if (!e.target.closest('.node')) {
            e.preventDefault();
        }
    });
}

// 링크 추가 모드 시작
function startLinkAddingMode() {
    // 기존 모드 취소
    if (state.addingChildMode) {
        state.addingChildMode = false;
        state.parentNodeForNewChild = null;
    }
    if (state.connectingMode) {
        state.connectingMode = false;
        state.connectingFromNode = null;
    }
    
    state.linkAddingMode = true;
    state.linkFirstNode = null;
    state.linkSecondNode = null;
    
    showToast('🔗 첫 번째 노드를 선택하세요 (ESC: 취소)', 'info', 4000);
    
    // 모든 노드에 선택 가능 상태 표시
    document.querySelectorAll('.node').forEach(node => {
        node.classList.add('link-selecting');
        node.style.cursor = 'pointer';
    });
}

// 링크 추가를 위한 노드 선택 처리
function handleLinkNodeSelection(nodeElement) {
    if (!state.linkAddingMode) return;
    
    const nodeId = nodeElement.id;
    
    if (!state.linkFirstNode) {
        // 첫 번째 노드 선택
        state.linkFirstNode = nodeId;
        nodeElement.classList.add('link-selected-first');
        nodeElement.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.8)';
        showToast('✅ 첫 번째 노드 선택됨. 두 번째 노드를 선택하세요', 'success', 4000);
    } else if (!state.linkSecondNode) {
        // 두 번째 노드 선택
        if (nodeId === state.linkFirstNode) {
            showToast('⚠️ 동일한 노드는 연결할 수 없습니다', 'warning', 3000);
            return;
        }
        
        // 이미 연결되어 있는지 확인
        const existingConnection = state.connections.find(conn => 
            (conn.from === state.linkFirstNode && conn.to === nodeId) ||
            (conn.from === nodeId && conn.to === state.linkFirstNode)
        );
        
        if (existingConnection) {
            showToast('⚠️ 이미 연결된 노드입니다', 'warning', 3000);
            // 첫 번째 노드 선택 초기화하고 다시 시작
            const firstNodeEl = document.getElementById(state.linkFirstNode);
            if (firstNodeEl) {
                firstNodeEl.classList.remove('link-selected-first');
                firstNodeEl.style.boxShadow = '';
            }
            state.linkFirstNode = null;
            return;
        }
        
        state.linkSecondNode = nodeId;
        nodeElement.classList.add('link-selected-second');
        nodeElement.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.8)';
        
        // 연결 생성
        createConnection(state.linkFirstNode, state.linkSecondNode);
        
        showToast('🎉 노드 연결이 생성되었습니다!', 'success', 3000);
        
        // 모드 종료 및 정리
        setTimeout(() => {
            endLinkAddingMode();
        }, 500);
    }
}

// 링크 추가 모드 종료
function endLinkAddingMode() {
    state.linkAddingMode = false;
    state.linkFirstNode = null;
    state.linkSecondNode = null;
    
    // 모든 노드의 스타일 초기화
    document.querySelectorAll('.node').forEach(node => {
        node.classList.remove('link-selecting', 'link-selected-first', 'link-selected-second');
        node.style.boxShadow = '';
        node.style.cursor = 'move';
    });
}
