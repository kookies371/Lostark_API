/**
 * 캐릭터 스펙 정보 조회 탭
 * - API 호출: /api/character/{character_name}
 * - 데이터: ArmoryEquipment 배열
 * - 렌더링: 장비 카드 리스트
 */

// ============================================================
// API 호출
// ============================================================

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

// ============================================================
// UI 제어
// ============================================================

function showLoadingSpec(show) {
    setLoading('loadingSpec', show);
}

function showErrorSpec(message) {
    setError('errorSpec', message);
}

function hideErrorSpec() {
    clearError('errorSpec');
}

function hideResultSpec() {
    setResult('resultSpec', false);
}

function showResultSpec(data) {
    const resultDiv = document.getElementById('resultSpec');
    const jsonContent = document.getElementById('jsonContentSpec');

    // ArmoryEquipment 배열인지 확인
    if (Array.isArray(data.ArmoryEquipment)) {
        // 장비 정보 렌더링
        jsonContent.innerHTML = renderArmoryEquipment(data.ArmoryEquipment);
    } else if (Array.isArray(data)) {
        // 캐릭터 원정대 정보 렌더링 (혹시 모를 대비)
        const groupedByServer = groupCharactersByServer(data);
        const sortedServers = sortServers(groupedByServer);
        jsonContent.innerHTML = renderCharactersByServer(sortedServers, groupedByServer);
    } else {
        jsonContent.innerHTML = '<p>데이터 형식을 인식할 수 없습니다.</p>';
    }
    resultDiv.style.display = 'block';
}

// ============================================================
// 데이터 처리 및 렌더링
// ============================================================

function renderArmoryEquipment(equipment) {
    let html = '<div class="equipment-container">';

    equipment.forEach(item => {
        const grade = item.Grade || '미정의';
        const gradeClass = getGradeClass(grade);

        html += `<div class="equipment-card ${gradeClass}">
            <div class="item-header">
                <img src="${item.Icon}" alt="${item.Name}" class="item-icon">
                <div class="item-info">
                    <div class="item-type">${item.Type}</div>
                    <div class="item-name">${item.Name}</div>
                    <div class="item-grade">${grade}</div>
                </div>
            </div>
        </div>`;
    });

    html += '</div>';
    return html;
}

function getGradeClass(grade) {
    const gradeMap = {
        '고대': 'grade-ancient',
        '유물': 'grade-relic',
        '전설': 'grade-legend',
        '영웅': 'grade-hero',
        '희귀': 'grade-rare',
        '고급': 'grade-uncommon',
        '일반': 'grade-common'
    };
    return gradeMap[grade] || 'grade-unknown';
}