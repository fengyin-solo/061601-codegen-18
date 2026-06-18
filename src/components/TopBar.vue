<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { getTimeLabel, getTimeIcon } from '../utils/gameUtils'
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-save'): void
  (e: 'toggle-cards'): void
  (e: 'toggle-history'): void
  (e: 'toggle-theme'): void
  (e: 'reset'): void
  (e: 'toggle-ngp'): void
}>()

const gameStore = useGameStore()

const difficultyLabel = computed(() => gameStore.currentDifficultyConfig)
const playthroughLabel = computed(() => gameStore.playthroughCount > 0 ? `第${gameStore.playthroughCount + 1}周` : '')
</script>

<template>
  <header class="top-bar card">
    <div class="game-title">
      <span class="title-icon">💝</span>
      <h1>恋爱物语</h1>
      <div v-if="gameStore.isNewGamePlus" class="ngp-badge">🌟 NG+</div>
      <div v-if="playthroughLabel" class="playthrough-badge">{{ playthroughLabel }}</div>
      <div class="difficulty-badge" :class="gameStore.difficultyMode">
        {{ difficultyLabel.icon }} {{ difficultyLabel.name }}
      </div>
    </div>

    <div class="status-info">
      <div class="status-item day">
        <span class="status-icon">📅</span>
        <span>第 {{ gameStore.day }} 天</span>
      </div>
      <div class="status-item time">
        <span class="status-icon">{{ getTimeIcon(gameStore.timeSlot) }}</span>
        <span>{{ getTimeLabel(gameStore.timeSlot) }}</span>
      </div>
      <div class="status-item actions">
        <span class="status-icon">⚡</span>
        <span>行动力 {{ gameStore.actionsRemaining }}</span>
      </div>
      <div class="status-item resources">
        <span class="status-icon">💰</span>
        <span>{{ gameStore.resources }} 代币</span>
      </div>
    </div>

    <div class="toolbar">
      <button 
        v-if="gameStore.canStartNewGamePlus" 
        class="toolbar-btn ngp-btn" 
        @click="emit('toggle-ngp')" 
        title="New Game+ 二周目"
      >
        🌟
      </button>
      <button class="toolbar-btn" @click="emit('toggle-cards')" title="卡牌收藏">
        🎴
      </button>
      <button class="toolbar-btn" @click="emit('toggle-history')" title="历史记录">
        📜
      </button>
      <button class="toolbar-btn" @click="emit('toggle-save')" title="存档/读档">
        💾
      </button>
      <button class="toolbar-btn" @click="emit('toggle-theme')" title="切换主题">
        {{ gameStore.darkMode ? '☀️' : '🌙' }}
      </button>
      <button class="toolbar-btn reset" @click="emit('reset')" title="重新开始">
        🔄
      </button>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 20px;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 28px;
}

.game-title h1 {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ngp-badge {
  padding: 4px 10px;
  background: linear-gradient(135deg, #f59e0b, #ec4899);
  color: white;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
}

.playthrough-badge {
  padding: 4px 10px;
  background: var(--accent-light);
  color: var(--accent-primary);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.difficulty-badge {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.difficulty-badge.normal {
  background: #e0f2fe;
  color: #0369a1;
}

.difficulty-badge.hard {
  background: #fef3c7;
  color: #b45309;
}

.difficulty-badge.nightmare {
  background: #fee2e2;
  color: #b91c1c;
}

.status-info {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
}

.status-icon {
  font-size: 18px;
}

.toolbar {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background: var(--accent-light);
  transform: scale(1.05);
}

.toolbar-btn.reset:hover {
  background: #fee2e2;
}

.toolbar-btn.ngp-btn {
  background: linear-gradient(135deg, #fef3c7, #fce7f3);
  animation: ngp-pulse 2s ease-in-out infinite;
}

.toolbar-btn.ngp-btn:hover {
  background: linear-gradient(135deg, #fde68a, #fbcfe8);
}

@keyframes ngp-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-wrap: wrap;
  }
  
  .status-info {
    order: 3;
    width: 100%;
    justify-content: space-around;
    gap: 8px;
  }
  
  .status-item {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .game-title h1 {
    font-size: 18px;
  }
}
</style>
