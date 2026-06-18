<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gameConfig from '../config/gameConfig'
import type { DifficultyMode, InheritContentType } from '../types/game'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()

const selectedInherit = ref<InheritContentType[]>([])
const selectedDifficulty = ref<DifficultyMode>('normal')

const inheritOptions = computed(() => gameConfig.inheritOptions)
const availableDifficulties = computed(() => gameStore.availableDifficulties)
const ngplusStats = computed(() => gameStore.ngplusData)

function toggleInherit(type: InheritContentType) {
  const idx = selectedInherit.value.indexOf(type)
  if (idx >= 0) {
    selectedInherit.value.splice(idx, 1)
  } else {
    selectedInherit.value.push(type)
  }
}

function isInheritSelected(type: InheritContentType): boolean {
  return selectedInherit.value.includes(type)
}

function selectDifficulty(mode: DifficultyMode) {
  selectedDifficulty.value = mode
}

function isDifficultySelected(mode: DifficultyMode): boolean {
  return selectedDifficulty.value === mode
}

function startGame() {
  if (confirm('确定要开始二周目吗？当前进度将被重置。')) {
    gameStore.startNewGamePlus(selectedInherit.value, selectedDifficulty.value)
    emit('close')
  }
}

function formatTime(ms: number): string {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content ngp-modal">
        <div class="modal-header">
          <h2>🌟 New Game+ 二周目</h2>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>

        <div class="ngp-stats">
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">已通关次数</span>
              <span class="stat-value">{{ ngplusStats.playthroughCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最高难度</span>
              <span class="stat-value">
                {{ gameConfig.difficulties.find(d => d.mode === ngplusStats.highestDifficultyCleared)?.icon }}
                {{ gameConfig.difficulties.find(d => d.mode === ngplusStats.highestDifficultyCleared)?.name }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">累计游戏时长</span>
              <span class="stat-value">{{ formatTime(ngplusStats.totalPlayTime) }}</span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">已收集卡牌</span>
              <span class="stat-value">{{ ngplusStats.inheritedCards.length }} 张</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已解锁角色</span>
              <span class="stat-value">{{ ngplusStats.unlockedCharacters.length }} 位</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已达成结局</span>
              <span class="stat-value">{{ ngplusStats.clearedEndings.length }} 个</span>
            </div>
          </div>
        </div>

        <div class="section-title">🎯 选择难度</div>
        <div class="difficulty-list">
          <div
            v-for="diff in availableDifficulties"
            :key="diff.mode"
            class="difficulty-item"
            :class="{ selected: isDifficultySelected(diff.mode), locked: !availableDifficulties.some(d => d.mode === diff.mode) }"
            @click="selectDifficulty(diff.mode)"
          >
            <div class="diff-icon">{{ diff.icon }}</div>
            <div class="diff-info">
              <div class="diff-name">{{ diff.name }}</div>
              <div class="diff-desc">{{ diff.description }}</div>
              <div class="diff-stats">
                <span>初始💰: {{ diff.initialResources }}</span>
                <span>行动⚡: {{ diff.maxActionsPerDay }}</span>
                <span>好感倍率: {{ diff.affinityGainMultiplier }}x</span>
              </div>
            </div>
            <div v-if="isDifficultySelected(diff.mode)" class="diff-check">✓</div>
          </div>
        </div>

        <div class="section-title">💎 选择继承内容</div>
        <div class="inherit-list">
          <div
            v-for="opt in inheritOptions"
            :key="opt.type"
            class="inherit-item"
            :class="{ selected: isInheritSelected(opt.type) }"
            @click="toggleInherit(opt.type)"
          >
            <div class="inherit-icon">{{ opt.icon }}</div>
            <div class="inherit-info">
              <div class="inherit-name">{{ opt.name }}</div>
              <div class="inherit-desc">{{ opt.description }}</div>
            </div>
            <div class="inherit-check">{{ isInheritSelected(opt.type) ? '✓' : '○' }}</div>
          </div>
        </div>

        <div class="action-row">
          <button class="btn-secondary" @click="emit('close')">取消</button>
          <button class="btn-primary" @click="startGame">🚀 开始二周目</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ngp-modal {
  padding: 24px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--accent-light);
}

.ngp-stats {
  background: linear-gradient(135deg, var(--accent-light), #fdf4ff);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 20px;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--accent-primary);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.difficulty-list,
.inherit-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.difficulty-item,
.inherit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.difficulty-item:hover,
.inherit-item:hover {
  background: var(--accent-light);
}

.difficulty-item.selected,
.inherit-item.selected {
  background: var(--accent-light);
  border-color: var(--accent-primary);
}

.difficulty-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.diff-icon,
.inherit-icon {
  font-size: 28px;
  width: 44px;
  text-align: center;
}

.diff-info,
.inherit-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diff-name,
.inherit-name {
  font-weight: 600;
  font-size: 14px;
}

.diff-desc,
.inherit-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.diff-stats {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.diff-check,
.inherit-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inherit-check {
  background: transparent;
  color: var(--accent-primary);
  font-size: 18px;
}

.action-row {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: none;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}
</style>
