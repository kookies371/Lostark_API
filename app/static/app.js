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
    jsonContent.innerHTML = formatJsonPretty(data, 0);
    resultDiv.style.display = 'block';
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
