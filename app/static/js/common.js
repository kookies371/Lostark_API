/**
 * 공통 함수들
 * - 탭 전환
 * - 레이아웃 제어
 * - JSON 포매팅 (미사용)
 */

// ============================================================
// 탭 전환
// ============================================================

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

// ============================================================
// 로딩/에러 상태 제어 (범용)
// ============================================================

function setLoading(elementId, show) {
    document.getElementById(elementId).style.display = show ? 'block' : 'none';
}

function setError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearError(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

function setResult(elementId, show) {
    document.getElementById(elementId).style.display = show ? 'block' : 'none';
}

// ============================================================
// JSON 포매팅 (아직 미사용)
// ============================================================

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