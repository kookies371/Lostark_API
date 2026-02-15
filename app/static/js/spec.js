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

    // 프로필 정보 렌더링
    if (data.ArmoryProfile) {
        html += renderProfileSection(data.ArmoryProfile);
    }

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

    // 보석 정보 렌더링
    if (data.ArmoryGem && data.ArmoryGem.Gems) {
        html += renderGemSection(data.ArmoryGem.Gems, data.ArmoryGem.Effects);
    }

    // 아크패시브 정보 렌더링
    if (data.ArkPassive) {
        html += renderArkPassiveSection(data.ArkPassive);
    }

    // 아크그리드 정보 렌더링
    if (data.ArkGrid && data.ArkGrid.Slots) {
        html += renderArkGridSection(data.ArkGrid.Slots);
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

// ============================================================
// 보석 섹션 렌더링
// ============================================================

function renderGemSection(gems, effects) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">💎 보석</h3>';

    // 보석 그리드
    html += '<div class="gem-list">';
    gems.forEach(gem => {
        const gradeClass = getGemGradeClass(gem.Grade);

        html += `<div class="gem-item ${gradeClass}">
            <div class="gem-image">
                <img src="${gem.Icon}" alt="${gem.Name}">
                <div class="slot-badge">${gem.Slot}</div>
                <div class="level-badge">Lv.${gem.Level}</div>
            </div>
            <div class="gem-info">
                <div class="gem-name">${gem.Name}</div>
                <div class="gem-grade">${gem.Grade}</div>
            </div>
        </div>`;
    });
    html += '</div>';

    // 보석 효과
    if (effects && effects.Skills && Array.isArray(effects.Skills) && effects.Skills.length > 0) {
        html += '<div class="gem-effects-section">';
        html += '<h4 class="effects-title">✨ 보석 효과</h4>';

        if (effects.Description) {
            html += `<div class="effects-description">${effects.Description}</div>`;
        }

        html += '<div class="gem-skills">';
        effects.Skills.forEach(skill => {
            html += '<div class="gem-skill-box">';
            html += `<div class="skill-name">${skill.Name}</div>`;

            if (skill.Description && Array.isArray(skill.Description)) {
                html += '<div class="skill-desc">';
                skill.Description.forEach(desc => {
                    html += `<div>${desc}</div>`;
                });
                html += '</div>';
            }

            if (skill.Option) {
                html += `<div class="skill-option">${skill.Option}</div>`;
            }

            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
    }

    html += '</div>';
    return html;
}

function getGemGradeClass(grade) {
    const gradeMap = {
        '유물': 'gem-grade-relic',
        '고대': 'gem-grade-ancient',
        '전설': 'gem-grade-legend',
        '영웅': 'gem-grade-hero',
        '희귀': 'gem-grade-rare',
        '고급': 'gem-grade-uncommon',
        '일반': 'gem-grade-common'
    };
    return gradeMap[grade] || 'gem-grade-unknown';
}

// ============================================================
// 프로필 섹션 렌더링
// ============================================================

function renderProfileSection(profile) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">👤 프로필</h3>';

    html += '<div class="profile-container">';

    // 캐릭터 이미지 및 기본 정보
    html += '<div class="profile-header">';
    if (profile.CharacterImage) {
        html += `<div class="profile-image">
            <img src="${profile.CharacterImage}" alt="${profile.CharacterName}">
        </div>`;
    }

    html += '<div class="profile-basic-info">';
    html += `<div class="profile-name">${profile.CharacterName}</div>`;
    html += `<div class="profile-class">${profile.CharacterClassName}</div>`;
    html += `<div class="profile-server">${profile.ServerName}</div>`;

    if (profile.Title) {
        html += `<div class="profile-title">칭호: ${profile.Title}</div>`;
    }

    if (profile.GuildName) {
        html += `<div class="profile-guild">길드: ${profile.GuildName} (${profile.GuildMemberGrade})</div>`;
    }

    html += '</div>';
    html += '</div>';

    // 전투력 및 레벨
    html += '<div class="profile-stats-grid">';
    html += `<div class="stat-box">
        <div class="stat-label">전투력</div>
        <div class="stat-value">${profile.CombatPower}</div>
    </div>`;
    html += `<div class="stat-box">
        <div class="stat-label">캐릭터 레벨</div>
        <div class="stat-value">${profile.CharacterLevel}</div>
    </div>`;
    html += `<div class="stat-box">
        <div class="stat-label">원정대 레벨</div>
        <div class="stat-value">${profile.ExpeditionLevel}</div>
    </div>`;
    html += `<div class="stat-box">
        <div class="stat-label">아이템 레벨</div>
        <div class="stat-value">${profile.ItemAvgLevel}</div>
    </div>`;

    if (profile.TownLevel) {
        html += `<div class="stat-box">
            <div class="stat-label">마을 레벨</div>
            <div class="stat-value">${profile.TownLevel} - ${profile.TownName}</div>
        </div>`;
    }

    html += '</div>';

    // 스킬 포인트
    html += `<div class="skill-point-info">
        <div class="sp-used">사용한 스킬 포인트: ${profile.UsingSkillPoint} / ${profile.TotalSkillPoint}</div>
        <div class="sp-bar">
            <div class="sp-progress" style="width: ${(profile.UsingSkillPoint / profile.TotalSkillPoint) * 100}%"></div>
        </div>
    </div>`;

    // 스탯 정보
    if (profile.Stats && Array.isArray(profile.Stats)) {
        html += '<div class="profile-stats-section">';
        html += '<h4 class="stats-title">스탯</h4>';
        html += '<div class="stats-grid">';

        profile.Stats.forEach(stat => {
            html += `<div class="stat-item">
                <div class="stat-type">${stat.Type}</div>
                <div class="stat-val">${stat.Value}</div>
            </div>`;
        });

        html += '</div>';
        html += '</div>';
    }

    // 성향 정보
    if (profile.Tendencies && Array.isArray(profile.Tendencies)) {
        html += '<div class="profile-tendencies-section">';
        html += '<h4 class="tendencies-title">성향</h4>';
        html += '<div class="tendencies-grid">';

        profile.Tendencies.forEach(tendency => {
            const progress = Math.round((tendency.Point / tendency.MaxPoint) * 100);
            html += `<div class="tendency-item">
                <div class="tendency-name">${tendency.Type}</div>
                <div class="tendency-bar">
                    <div class="tendency-progress" style="width: ${progress}%"></div>
                </div>
                <div class="tendency-value">${tendency.Point} / ${tendency.MaxPoint}</div>
            </div>`;
        });

        html += '</div>';
        html += '</div>';
    }

    html += '</div>';
    html += '</div>';
    return html;
}

// ============================================================
// 아크패시브 섹션 렌더링
// ============================================================

function renderArkPassiveSection(arkPassive) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">🔮 아크패시브</h3>';

    html += '<div class="arkpassive-container">';

    // 아크패시브 제목
    if (arkPassive.Title) {
        html += `<div class="arkpassive-title">${arkPassive.Title}</div>`;
    }

    // 포인트 정보
    if (arkPassive.Points && Array.isArray(arkPassive.Points)) {
        html += '<div class="arkpassive-points">';

        arkPassive.Points.forEach(point => {
            html += `<div class="point-item">
                <div class="point-name">${point.Name}</div>
                <div class="point-value">${point.Value}</div>
                <div class="point-desc">${point.Description}</div>
            </div>`;
        });

        html += '</div>';
    }

    // 효과 정보
    if (arkPassive.Effects && Array.isArray(arkPassive.Effects)) {
        html += '<div class="arkpassive-effects">';
        html += '<h4 class="effects-title">✨ 활성화 효과</h4>';

        arkPassive.Effects.forEach(effect => {
            html += `<div class="arkpassive-effect-item">
                <div class="effect-header">
                    <img src="${effect.Icon}" alt="${effect.Name}" class="effect-icon">
                    <div class="effect-info">
                        <div class="effect-name">${effect.Name}</div>
                        <div class="effect-desc">${effect.Description}</div>
                    </div>
                </div>
            </div>`;
        });

        html += '</div>';
    }

    html += '</div>';
    html += '</div>';
    return html;
}

// ============================================================
// 아크그리드 섹션 렌더링
// ============================================================

function renderArkGridSection(slots) {
    let html = '<div class="spec-section">';
    html += '<h3 class="section-title">⚙️ 아크그리드</h3>';

    html += '<div class="arkgrid-container">';

    slots.forEach(slot => {
        const gradeClass = getArkGridGradeClass(slot.Grade);

        html += `<div class="arkgrid-slot ${gradeClass}">
            <div class="slot-header">
                <img src="${slot.Icon}" alt="${slot.Name}" class="slot-icon">
                <div class="slot-info">
                    <div class="slot-name">${slot.Name}</div>
                    <div class="slot-point">포인트: ${slot.Point}</div>
                    <div class="slot-grade">${slot.Grade}</div>
                </div>
            </div>`;

        // 슬롯에 장착된 젬들
        if (slot.Gems && Array.isArray(slot.Gems) && slot.Gems.length > 0) {
            html += '<div class="slot-gems">';

            slot.Gems.forEach(gem => {
                const gemGradeClass = getArkGridGemGradeClass(gem.Grade);
                const activeClass = gem.IsActive ? 'active' : 'inactive';

                html += `<div class="slot-gem ${gemGradeClass} ${activeClass}">
                    <img src="${gem.Icon}" alt="gem" class="gem-icon">
                    <div class="gem-status">${gem.Grade}</div>
                </div>`;
            });

            html += '</div>';
        }

        html += '</div>';
    });

    html += '</div>';
    html += '</div>';
    return html;
}

function getArkGridGradeClass(grade) {
    const gradeMap = {
        '고대': 'arkgrid-grade-ancient',
        '유물': 'arkgrid-grade-relic',
        '전설': 'arkgrid-grade-legend'
    };
    return gradeMap[grade] || 'arkgrid-grade-unknown';
}

function getArkGridGemGradeClass(grade) {
    const gradeMap = {
        '유물': 'arkgem-grade-relic',
        '전설': 'arkgem-grade-legend'
    };
    return gradeMap[grade] || 'arkgem-grade-unknown';
}