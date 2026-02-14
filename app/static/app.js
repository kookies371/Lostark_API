async function search() {
    const characterName = document.getElementById('characterName').value.trim();

    if (!characterName) {
        showError('캐릭터 이름을 입력해주세요.');
        return;
    }

    showLoading(true);
    hideError();
    hideResult();

    try {
        const response = await fetch(`/api/character/${encodeURIComponent(characterName)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '조회 실패');
        }

        const data = await response.json();
        showResult(data);
    } catch (error) {
        showError(`오류: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function showResult(data) {
    const resultDiv = document.getElementById('result');
    const jsonContent = document.getElementById('jsonContent');

    // 서버별로 그룹화
    const groupedByServer = groupCharactersByServer(data);

    // 정렬된 서버 목록
    const sortedServers = sortServers(groupedByServer);

    // HTML 생성
    jsonContent.innerHTML = renderCharactersByServer(sortedServers, groupedByServer);
    resultDiv.style.display = 'block';
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

function hideResult() {
    document.getElementById('result').style.display = 'none';
}
