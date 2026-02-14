/**
 * 원정대 정보 조회 탭
 * - API 호출: /api/expedition/{character_name}
 * - 데이터: 서버별 캐릭터 목록
 * - 렌더링: 서버별 그룹화 및 정렬
 */

// ============================================================
// API 호출
// ============================================================

async function searchExpedition() {
    const characterName = document.getElementById('characterNameExpedition').value.trim();

    if (!characterName) {
        showErrorExpedition('캐릭터 이름을 입력해주세요.');
        return;
    }

    showLoadingExpedition(true);
    hideErrorExpedition();
    hideResultExpedition();

    try {
        const response = await fetch(`/api/expedition/${encodeURIComponent(characterName)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '조회 실패');
        }

        const data = await response.json();
        showResultExpedition(data);
    } catch (error) {
        showErrorExpedition(`오류: ${error.message}`);
    } finally {
        showLoadingExpedition(false);
    }
}

// ============================================================
// UI 제어
// ============================================================

function showLoadingExpedition(show) {
    setLoading('loadingExpedition', show);
}

function showErrorExpedition(message) {
    setError('errorExpedition', message);
}

function hideErrorExpedition() {
    clearError('errorExpedition');
}

function hideResultExpedition() {
    setResult('resultExpedition', false);
}

function showResultExpedition(data) {
    const resultDiv = document.getElementById('resultExpedition');
    const jsonContent = document.getElementById('jsonContentExpedition');

    // 서버별로 그룹화
    const groupedByServer = groupCharactersByServer(data);

    // 정렬된 서버 목록
    const sortedServers = sortServers(groupedByServer);

    // HTML 생성
    jsonContent.innerHTML = renderCharactersByServer(sortedServers, groupedByServer);
    resultDiv.style.display = 'block';
}

// ============================================================
// 데이터 처리 및 렌더링
// ============================================================

function groupCharactersByServer(characters) {
    const grouped = {};

    characters.forEach(char => {
        const server = char.ServerName || '미정의';
        if (!grouped[server]) {
            grouped[server] = [];
        }
        grouped[server].push(char);
    });

    return grouped;
}

function sortServers(groupedByServer) {
    return Object.keys(groupedByServer).sort((a, b) => {
        const countA = groupedByServer[a].length;
        const countB = groupedByServer[b].length;

        // 캐릭터 수가 많은 순서 (내림차순)
        if (countA !== countB) {
            return countB - countA;
        }

        // 캐릭터 수가 같으면 서버 이름 가나다순
        return a.localeCompare(b, 'ko-KR');
    });
}

function sortCharactersByLevel(characters) {
    const sorted = [...characters].sort((a, b) => {
        // ItemAvgLevel에서 쉼표를 제거하고 float으로 변환
        const levelAStr = String(a.ItemAvgLevel || '0').trim().replace(/,/g, '');
        const levelBStr = String(b.ItemAvgLevel || '0').trim().replace(/,/g, '');

        const levelA = parseFloat(levelAStr);
        const levelB = parseFloat(levelBStr);

        // NaN 체크
        const numA = isNaN(levelA) ? 0 : levelA;
        const numB = isNaN(levelB) ? 0 : levelB;

        // 높은 레벨 순서 (내림차순)
        return numB - numA;
    });

    return sorted;
}

function renderCharactersByServer(sortedServers, groupedByServer) {
    let html = '<div class="servers-container">';

    sortedServers.forEach(server => {
        const characters = sortCharactersByLevel(groupedByServer[server]);
        html += `<div class="server-section">
            <h3 class="server-name">${server} (${characters.length})</h3>
            <div class="characters-list">`;

        characters.forEach(char => {
            html += `<div class="character-card">
                <div class="char-name">${char.CharacterName}</div>
                <div class="char-class">${char.CharacterClassName}</div>
                <div class="char-level">아이템 레벨: ${char.ItemAvgLevel}</div>
                <div class="char-game-level">캐릭터 레벨: ${char.CharacterLevel}</div>
            </div>`;
        });

        html += `</div></div>`;
    });

    html += '</div>';
    return html;
}