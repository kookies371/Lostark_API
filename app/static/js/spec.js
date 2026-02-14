/**
 * 캐릭터 스펙 정보 조회 탭
 * - API 호출: /api/character/{character_name}
 * - 데이터: { ArmoryEquipment, ArmoryCard: { Cards, Effects }, ArmoryEngraving: { Engravings, Effects } }
 * - 렌더링: 장비 + 카드 + 각인 정보
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

    if (!data || typeof data !== 'object') {
        jsonContent.innerHTML = '<p>데이터 형식을 인식할 수 없습니다.</p>';
        resultDiv.style.display = 'block';
        return;
    }

    let html = '';

    // 장비 정보 렌더링
    if (Array.isArray(data.ArmoryEquipment) && data.ArmoryEquipment.length > 0) {
        html += renderEquipmentSection(data.ArmoryEquipment);
    }

    // 각인 정보 렌더링
    if (data.ArmoryEngraving && data.ArmoryEngraving.ArkPassiveEffects) {
        html += renderEngravingSection(data.ArmoryEngraving.ArkPassiveEffects);
    }

    // 카드 정보 렌더링
    if (data.ArmoryCard && data.ArmoryCard.Cards) {
        html += renderCardSection(data.ArmoryCard.Cards, data.ArmoryCard.Effects);
    }

    if (!html) {
        jsonContent.innerHTML = '<p>표시할 데이터가 없습니다.</p>';
    } else {
        jsonContent.innerHTML = html;
    }

    resultDiv.style.display = 'block';
}

// ============================================================
// 장비 섹션 렌더링
// ============================================================

function renderEquipmentSection(equipment) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">⚔️ 장비</h3>';
    html += '<div class="equipment-list">';

    equipment.forEach(item => {
        const grade = item.Grade || '미정의';
        const gradeClass = getGradeClass(grade);

        html += `<div class="equipment-item ${gradeClass}">
            <img src="${item.Icon}" alt="${item.Name}" class="item-icon">
            <div class="item-details">
                <div class="item-type">${item.Type}</div>
                <div class="item-name">${item.Name}</div>
                <div class="item-grade">${grade}</div>
            </div>
        </div>`;
    });

    html += '</div></div>';
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

// ============================================================
// 각인 섹션 렌더링
// ============================================================

function renderEngravingSection(arkPassiveEffects) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">⚡ 각인</h3>';

    // 아크 패시브 효과 (각인)
    html += '<div class="engraving-list">';
    arkPassiveEffects.forEach(effect => {
        const gradeClass = getEngravingGradeClass(effect.Grade);

        html += `<div class="engraving-item ${gradeClass}">
            <div class="engraving-details">
                <div class="engraving-grade">${effect.Grade}</div>
                <div class="engraving-name">${effect.Name}</div>
                ${effect.AbilityStoneLevel !== null ? `<div class="engraving-level">레벨 ${effect.AbilityStoneLevel}</div>` : ''}
            </div>
            <div class="engraving-desc">${effect.Description}</div>
        </div>`;
    });
    html += '</div>';

    html += '</div>';
    return html;
}

function getEngravingGradeClass(grade) {
    const gradeMap = {
        '유물': 'engraving-grade-relic',
        '고대': 'engraving-grade-ancient',
        '전설': 'engraving-grade-legend',
        '영웅': 'engraving-grade-hero',
        '희귀': 'engraving-grade-rare',
        '고급': 'engraving-grade-uncommon',
        '일반': 'engraving-grade-common'
    };
    return gradeMap[grade] || 'engraving-grade-unknown';
}

// ============================================================
// 카드 섹션 렌더링
// ============================================================

function renderCardSection(cards, effects) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">📇 카드</h3>';

    // 카드 그리드
    html += '<div class="card-list">';
    cards.forEach(card => {
        const gradeClass = getCardGradeClass(card.Grade);
        const awakeProgress = Math.round((card.AwakeCount / card.AwakeTotal) * 100);

        html += `<div class="card-item ${gradeClass}">
            <div class="card-image">
                <img src="${card.Icon}" alt="${card.Name}">
                <div class="slot-badge">${card.Slot}</div>
            </div>
            <div class="card-info">
                <div class="card-name">${card.Name}</div>
                <div class="card-grade">${card.Grade}</div>
                <div class="awake-meter">
                    <div class="awake-progress" style="width: ${awakeProgress}%"></div>
                </div>
                <div class="awake-text">${card.AwakeCount}/${card.AwakeTotal}</div>
            </div>
        </div>`;
    });
    html += '</div>';

    // 카드 세트 효과
    if (effects && Array.isArray(effects) && effects.length > 0) {
        html += '<div class="card-effects-section">';
        html += '<h4 class="effects-title">✨ 세트 효과</h4>';

        effects.forEach(effect => {
            const activeSlots = effect.CardSlots.map(s => `[${s}]`).join(' ');

            html += '<div class="effect-box">';
            html += `<div class="effect-slots">활성화 슬롯: ${activeSlots}</div>`;

            html += '<div class="effect-items">';
            effect.Items.forEach(item => {
                html += `<div class="effect-row">
                    <span class="effect-item-name">${item.Name}</span>
                    <span class="effect-item-desc">${item.Description}</span>
                </div>`;
            });
            html += '</div>';
            html += '</div>';
        });

        html += '</div>';
    }

    html += '</div>';
    return html;
}

function getCardGradeClass(grade) {
    const gradeMap = {
        '전설': 'card-grade-legend',
        '영웅': 'card-grade-hero',
        '희귀': 'card-grade-rare',
        '고급': 'card-grade-uncommon',
        '일반': 'card-grade-common'
    };
    return gradeMap[grade] || 'card-grade-unknown';
}