<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gameConfig from '../config/gameConfig'

const emit = defineEmits<{
  (e: 'start-ngp'): void
  (e: 'close'): void
}>()

const gameStore = useGameStore()

const ending = computed(() => gameStore.currentEnding)
const characterAvatar = computed(() => {
  if (!ending.value?.characterId) return '🌸'
  const char = gameConfig.characters.find(c => c.id === ending.value?.characterId)
  return char?.avatar || '🌸'
})
const characterName = computed(() => {
  if (!ending.value?.characterId) return ''
  const char = gameConfig.characters.find(c => c.id === ending.value?.characterId)
  return char?.name || ''
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay ending-overlay">
      <div class="modal-content ending-modal">
        <div class="ending-header">
          <div class="ending-icon">{{ characterAvatar }}</div>
          <div class="ending-badge">
            {{ ending?.isHidden ? '🌟 隐藏结局' : '🎬 结局达成' }}
          </div>
        </div>

        <h1 class="ending-title">{{ ending?.name || '普通结局' }}</h1>

        <div v-if="characterName" class="ending-character">
          与 <strong>{{ characterName }}</strong> 的结局
        </div>

        <p class="ending-description">
          {{ ending?.description || '你的故事暂时告一段落，但新的故事即将开始...' }}
        </p>

        <div class="ending-stats">
          <div class="stat-row">
            <span>游戏天数</span>
            <span>第 {{ gameStore.day }} 天</span>
          </div>
          <div class="stat-row">
            <span>收集卡牌</span>
            <span>{{ gameStore.collectedCards.length }} 张</span>
          </div>
          <div class="stat-row">
            <span>周目数</span>
            <span>第 {{ gameStore.playthroughCount + 1 }} 周</span>
          </div>
        </div>

        <div class="ending-actions">
          <button v-if="gameStore.canStartNewGamePlus" class="btn-ngp" @click="emit('start-ngp')">
            🌟 开始二周目
          </button>
          <button class="btn-restart" @click="gameStore.resetGame(); emit('close')">
            🔄 重新开始
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ending-overlay {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
}

.ending-modal {
  padding: 40px 32px;
  max-width: 480px;
  text-align: center;
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  color: white;
  border: 2px solid rgba(236, 72, 153, 0.3);
  box-shadow: 0 0 60px rgba(236, 72, 153, 0.3);
}

.ending-header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ending-icon {
  font-size: 72px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.ending-badge {
  padding: 6px 16px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
}

.ending-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-character {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
}

.ending-character strong {
  color: #fbbf24;
}

.ending-description {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.ending-stats {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row span:first-child {
  color: rgba(255, 255, 255, 0.6);
}

.stat-row span:last-child {
  font-weight: 600;
  color: #fbbf24;
}

.ending-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-ngp,
.btn-restart {
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-ngp {
  background: linear-gradient(135deg, #f59e0b, #ec4899);
  color: white;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
}

.btn-ngp:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(236, 72, 153, 0.5);
}

.btn-restart {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-restart:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
