// 탭 전환 함수
function switchTab(tabName, button) {
    // 모든 탭 내용 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // 모든 탭 버튼 비활성화
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // 선택된 탭 활성화
    document.getElementById(`tab-${tabName}`).classList.add('active');
    button.classList.add('active');
}

// 원정대 정보 검색
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

// 스펙 정보 검색
async function searchSpec() {
    const characterName = document.getElementById('characterNameSpec').value.trim();

    if (!characterName) {
        showErrorSpec('캐릭터 이름을 입력해주세요.');
        return;
    }

    showLoadingSpec(true);
    hideErrorSpec();
    hideResultSpec();

    try {
        const response = await fetch(`/api/character/${encodeURIComponent(characterName)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '조회 실패');
        }

        const data = await response.json();
        showResultSpec(data);
    } catch (error) {
        showErrorSpec(`오류: ${error.message}`);
    } finally {
        showLoadingSpec(false);
    }
}

// 원정대 정보 탭 헬퍼 함수
function showLoadingExpedition(show) {
    document.getElementById('loadingExpedition').style.display = show ? 'block' : 'none';
}

function showErrorExpedition(message) {
    const errorDiv = document.getElementById('errorExpedition');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideErrorExpedition() {
    document.getElementById('errorExpedition').style.display = 'none';
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

function hideResultExpedition() {
    document.getElementById('resultExpedition').style.display = 'none';
}

// 스펙 정보 탭 헬퍼 함수
function showLoadingSpec(show) {
    document.getElementById('loadingSpec').style.display = show ? 'block' : 'none';
}

function showErrorSpec(message) {
    const errorDiv = document.getElementById('errorSpec');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideErrorSpec() {
    document.getElementById('errorSpec').style.display = 'none';
}

function showResultSpec(data) {
    const resultDiv = document.getElementById('resultSpec');
    const jsonContent = document.getElementById('jsonContentSpec');

    // 서버별로 그룹화
    const groupedByServer = groupCharactersByServer(data);

    // 정렬된 서버 목록
    const sortedServers = sortServers(groupedByServer);

    // HTML 생성
    jsonContent.innerHTML = renderCharactersByServer(sortedServers, groupedByServer);
    resultDiv.style.display = 'block';
}

function hideResultSpec() {
    document.getElementById('resultSpec').style.display = 'none';
}

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

        // 높은 레벨 순서 (내림차순): numB - numA
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

function formatJsonPretty(obj, indent = 0) {
    const indentStr = '  '.repeat(indent);
    const nextIndentStr = '  '.repeat(indent + 1);

    if (obj === null) {
        return `<span class="json-null">null</span>`;
    }

    if (typeof obj === 'boolean') {
        return `<span class="json-boolean">${obj}</span>`;
    }

    if (typeof obj === 'number') {
        return `<span class="json-number">${obj}</span>`;
    }

    if (typeof obj === 'string') {
        const escaped = obj
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        return `<span class="json-string">"${escaped}"</span>`;
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return '<span class="json-bracket">[]</span>';
        }

        const items = obj.map((item, idx) => {
            const comma = idx < obj.length - 1 ? '<span class="json-comma">,</span>' : '';
            return `${nextIndentStr}${formatJsonPretty(item, indent + 1)}${comma}`;
        }).join('\n');

        return `<span class="json-bracket">[</span>\n${items}\n${indentStr}<span class="json-bracket">]</span>`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '<span class="json-bracket">{}</span>';
        }

        const items = keys.map((key, idx) => {
            const escapedKey = key
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            const value = formatJsonPretty(obj[key], indent + 1);
            const comma = idx < keys.length - 1 ? '<span class="json-comma">,</span>' : '';
            return `${nextIndentStr}<span class="json-key">"${escapedKey}"</span><span class="json-colon">:</span> ${value}${comma}`;
        }).join('\n');

        return `<span class="json-bracket">{</span>\n${items}\n${indentStr}<span class="json-bracket">}</span>`;
    }

    return String(obj);
}

