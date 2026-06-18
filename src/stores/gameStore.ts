import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TimeOfDay, ActionType, GameEventConfig, EventChoice, DifficultyMode, InheritContentType, NewGamePlusData, EndingConfig } from '../types/game'
import gameConfig from '../config/gameConfig'
import {
  clamp,
  randomInt,
  calculateChatAffinity,
  calculateGiftAffinity,
  isGiftLiked,
  isGiftDisliked,
  getTimeLabel,
  getNextTimeSlot,
  getMoodLabel
} from '../utils/gameUtils'

const NGPLUS_STORAGE_KEY = 'love_story_ngplus_data'

export interface CharacterState {
  id: string
  affinity: number
  mood: number
  unlocked: boolean
}

export interface LogEntry {
  id: number
  day: number
  time: TimeOfDay
  type: 'action' | 'event' | 'system' | 'story'
  message: string
  characterId?: string
  timestamp: number
}

export interface HistorySnapshot {
  day: number
  timeSlot: TimeOfDay
  actionsRemaining: number
  resources: number
  characters: CharacterState[]
  flags: string[]
  triggeredEvents: string[]
  collectedCards: string[]
  logs: LogEntry[]
}

export const useGameStore = defineStore('game', () => {
  const day = ref(1)
  const timeSlot = ref<TimeOfDay>('morning')
  const actionsRemaining = ref(gameConfig.maxActionsPerDay)
  const resources = ref(gameConfig.initialResources)
  const selectedCharacterId = ref<string | null>(null)
  const currentEvent = ref<GameEventConfig | null>(null)
  const showEventModal = ref(false)
  const darkMode = ref(false)
  const difficultyMode = ref<DifficultyMode>('normal')
  const isNewGamePlus = ref(false)
  const playthroughCount = ref(0)
  const inheritedContent = ref<InheritContentType[]>([])
  const gameCleared = ref(false)
  const currentEnding = ref<EndingConfig | null>(null)
  const showEndingModal = ref(false)
  const gameStartTime = ref(Date.now())

  const characters = ref<CharacterState[]>(
    gameConfig.characters.map(c => ({
      id: c.id,
      affinity: c.baseAffinity,
      mood: c.baseMood,
      unlocked: c.unlocked && !c.hidden
    }))
  )

  const flags = ref<string[]>([])
  const triggeredEvents = ref<string[]>([])
  const collectedCards = ref<string[]>([])
  const logs = ref<LogEntry[]>([])
  const history = ref<HistorySnapshot[]>([])
  let logIdCounter = 0

  const ngplusData = ref<NewGamePlusData>({
    playthroughCount: 0,
    highestDifficultyCleared: 'normal',
    allClearedDifficulties: [],
    inheritedCards: [],
    unlockedCharacters: [],
    maxAffinityReached: {},
    totalPlayTime: 0,
    flags: [],
    clearedEndings: []
  })

  const unlockedCharacters = computed(() =>
    characters.value.filter(c => c.unlocked)
  )

  const currentCharacter = computed(() =>
    characters.value.find(c => c.id === selectedCharacterId.value) || null
  )

  const currentCharacterConfig = computed(() =>
    gameConfig.characters.find(c => c.id === selectedCharacterId.value) || null
  )

  const currentDifficultyConfig = computed(() =>
    gameConfig.difficulties.find(d => d.mode === difficultyMode.value) || gameConfig.difficulties[0]
  )

  const availableDifficulties = computed(() => {
    const difficulties = [gameConfig.difficulties[0]]
    if (ngplusData.value.playthroughCount >= 1) {
      difficulties.push(gameConfig.difficulties[1])
    }
    if (ngplusData.value.allClearedDifficulties.includes('hard')) {
      difficulties.push(gameConfig.difficulties[2])
    }
    return difficulties
  })

  const canStartNewGamePlus = computed(() => ngplusData.value.playthroughCount >= 1)

  function addLog(type: LogEntry['type'], message: string, characterId?: string) {
    logs.value.push({
      id: ++logIdCounter,
      day: day.value,
      time: timeSlot.value,
      type,
      message,
      characterId,
      timestamp: Date.now()
    })
  }

  function saveHistory() {
    history.value.push({
      day: day.value,
      timeSlot: timeSlot.value,
      actionsRemaining: actionsRemaining.value,
      resources: resources.value,
      characters: JSON.parse(JSON.stringify(characters.value)),
      flags: [...flags.value],
      triggeredEvents: [...triggeredEvents.value],
      collectedCards: [...collectedCards.value],
      logs: JSON.parse(JSON.stringify(logs.value))
    })
    if (history.value.length > 100) {
      history.value.shift()
    }
  }

  function rollbackToStep(stepIndex: number) {
    if (stepIndex < 0 || stepIndex >= history.value.length) return
    const snapshot = history.value[stepIndex]
    day.value = snapshot.day
    timeSlot.value = snapshot.timeSlot
    actionsRemaining.value = snapshot.actionsRemaining
    resources.value = snapshot.resources
    characters.value = JSON.parse(JSON.stringify(snapshot.characters))
    flags.value = [...snapshot.flags]
    triggeredEvents.value = [...snapshot.triggeredEvents]
    collectedCards.value = [...snapshot.collectedCards]
    logs.value = JSON.parse(JSON.stringify(snapshot.logs))
    history.value = history.value.slice(0, stepIndex)
    addLog('system', `回退到第 ${snapshot.day} 天 ${getTimeLabel(snapshot.timeSlot)}`)
  }

  function getCharacterState(id: string): CharacterState | undefined {
    return characters.value.find(c => c.id === id)
  }

  function updateCharacterAffinity(characterId: string, change: number) {
    const char = getCharacterState(characterId)
    if (!char || !char.unlocked) return
    const oldAffinity = char.affinity
    char.affinity = clamp(
      char.affinity + change,
      gameConfig.minAffinity,
      gameConfig.maxAffinity
    )
    if (char.affinity >= 40 && oldAffinity < 40) {
      checkCardUnlock(characterId, 40)
    }
    if (char.affinity >= 70 && oldAffinity < 70) {
      checkCardUnlock(characterId, 70)
    }
    if (char.affinity >= 100 && oldAffinity < 100) {
      checkCardUnlock(characterId, 100)
    }
  }

  function checkCardUnlock(characterId: string, threshold: number) {
    const character = gameConfig.characters.find(c => c.id === characterId)
    if (!character) return
    const cardKey = `${characterId}_affinity_${threshold}`
    const card = gameConfig.cards.find(c => c.unlockCondition === cardKey)
    if (card && !collectedCards.value.includes(card.id)) {
      collectedCards.value.push(card.id)
      addLog('system', `🎉 获得新卡牌：${card.name}`, characterId)
    }
  }

  function updateCharacterMood(characterId: string, change: number) {
    const char = getCharacterState(characterId)
    if (!char || !char.unlocked) return
    char.mood = clamp(char.mood + change, gameConfig.minMood, gameConfig.maxMood)
  }

  function advanceTime() {
    const nextSlot = getNextTimeSlot(timeSlot.value, gameConfig.timeSlots)
    if (nextSlot === gameConfig.timeSlots[0]) {
      nextDay()
    } else {
      timeSlot.value = nextSlot
    }
    checkAndTriggerEvent()
  }

  function nextDay() {
    day.value++
    timeSlot.value = gameConfig.timeSlots[0]
    actionsRemaining.value = currentDifficultyConfig.value.maxActionsPerDay

    const moodDecay = currentDifficultyConfig.value.moodDecayPerDay
    const affinityDecay = currentDifficultyConfig.value.affinityDecayPerDay

    characters.value.forEach(char => {
      if (char.unlocked) {
        char.mood = clamp(
          char.mood - moodDecay,
          gameConfig.minMood,
          gameConfig.maxMood
        )
        char.affinity = clamp(
          char.affinity - affinityDecay,
          gameConfig.minAffinity,
          gameConfig.maxAffinity
        )
      }
    })

    addLog('system', `🌅 第 ${day.value} 天开始了`)
    if (day.value > gameConfig.gameDurationDays) {
      checkGameEnding()
    }
  }

  function performAction(actionType: ActionType, targetId?: string, giftId?: string) {
    if (actionsRemaining.value <= 0) {
      addLog('system', '⚠️ 今天的行动次数已用完')
      return false
    }

    const actionConfig = gameConfig.actions.find(a => a.type === actionType)
    if (!actionConfig) return false

    if (actionsRemaining.value < actionConfig.energyCost) {
      addLog('system', '⚠️ 行动点数不足')
      return false
    }

    saveHistory()
    actionsRemaining.value -= actionConfig.energyCost

    switch (actionType) {
      case 'chat':
        return performChat(targetId!)
      case 'gift':
        return performGift(targetId!, giftId!)
      case 'work':
        return performWork()
      default:
        return false
    }
  }

  function performChat(characterId: string): boolean {
    const charState = getCharacterState(characterId)
    const charConfig = gameConfig.characters.find(c => c.id === characterId)
    if (!charState || !charConfig || !charState.unlocked) return false

    const topic = charConfig.chatTopics[
      randomInt(0, charConfig.chatTopics.length - 1)
    ]
    const baseAffinityChange = calculateChatAffinity(
      topic.topic,
      charConfig,
      charState.mood,
      timeSlot.value
    )
    const affinityChange = Math.round(baseAffinityChange * currentDifficultyConfig.value.affinityGainMultiplier * 10) / 10

    updateCharacterAffinity(characterId, affinityChange)
    updateCharacterMood(characterId, affinityChange > 0 ? 5 : -3)

    const moodBefore = charState.mood
    const characterName = charConfig.name

    let message = `和 ${characterName} 聊起了「${topic.topic}」`
    if (affinityChange > 0) {
      message += `，ta似乎很开心！（好感 +${affinityChange}）`
    } else if (affinityChange < 0) {
      message += `，ta好像不太感兴趣...（好感 ${affinityChange}）`
    } else {
      message += '，气氛平平。'
    }

    addLog('action', message, characterId)
    advanceTime()
    return true
  }

  function performGift(characterId: string, giftId: string): boolean {
    const charState = getCharacterState(characterId)
    const charConfig = gameConfig.characters.find(c => c.id === characterId)
    const giftConfig = gameConfig.gifts.find(g => g.id === giftId)
    if (!charState || !charConfig || !giftConfig || !charState.unlocked) return false
    const adjustedPrice = Math.round(giftConfig.price * currentDifficultyConfig.value.giftCostMultiplier)
    if (resources.value < adjustedPrice) {
      addLog('system', '💰 代币不足！')
      return false
    }
    resources.value -= adjustedPrice

    const baseAffinityChange = calculateGiftAffinity(
      giftId,
      charConfig,
      giftConfig.price,
      charState.mood
    )
    const affinityChange = Math.round(baseAffinityChange * currentDifficultyConfig.value.affinityGainMultiplier * 10) / 10

    updateCharacterAffinity(characterId, affinityChange)
    updateCharacterMood(
      characterId,
      isGiftLiked(giftId, charConfig) ? 15 : isGiftDisliked(giftId, charConfig) ? -10 : 5
    )

    const characterName = charConfig.name
    let message = `送给 ${characterName} 一份「${giftConfig.name}」`

    if (isGiftLiked(giftId, charConfig)) {
      message += `，ta非常喜欢！（好感 +${affinityChange}）`
    } else if (isGiftDisliked(giftId, charConfig)) {
      message += `，ta好像不太喜欢...（好感 ${affinityChange}）`
    } else {
      message += `，ta收下了。（好感 +${affinityChange}）`
    }

    addLog('action', message, characterId)
    advanceTime()
    return true
  }

  function performWork(): boolean {
    const { min, max } = gameConfig.workRewards
    const baseEarned = randomInt(min, max)
    const earned = Math.round(baseEarned * currentDifficultyConfig.value.workRewardMultiplier)
    resources.value += earned

    characters.value.forEach(char => {
      if (char.unlocked) {
        updateCharacterMood(char.id, -2)
      }
    })

    addLog('action', `💼 打工赚了 ${earned} 代币（角色们的心情略有下降）`)
    advanceTime()
    return true
  }

  function checkAndTriggerEvent() {
    if (currentEvent.value) return

    const availableEvents = gameConfig.events.filter(event => {
      if (event.once && triggeredEvents.value.includes(event.id)) return false

      const cond = event.triggerCondition

      if (cond.minDay !== undefined && day.value < cond.minDay) return false
      if (cond.maxDay !== undefined && day.value > cond.maxDay) return false
      if (cond.timeOfDay !== undefined && timeSlot.value !== cond.timeOfDay) return false

      if (cond.characterId) {
        const charState = getCharacterState(cond.characterId)
        if (!charState || !charState.unlocked) return false
        if (cond.minAffinity !== undefined && charState.affinity < cond.minAffinity) return false
        if (cond.maxAffinity !== undefined && charState.affinity > cond.maxAffinity) return false
      }

      if (cond.requiredFlags) {
        if (!cond.requiredFlags.every(f => flags.value.includes(f))) return false
      }

      return true
    })

    if (availableEvents.length > 0) {
      availableEvents.sort((a, b) => b.priority - a.priority)
      const topEvent = availableEvents[0]
      triggerEvent(topEvent)
    }
  }

  function triggerEvent(event: GameEventConfig) {
    currentEvent.value = event
    showEventModal.value = true
    triggeredEvents.value.push(event.id)
    addLog('event', `📖 触发事件：${event.title}`, event.characterId)
  }

  function handleEventChoice(choice: EventChoice) {
    saveHistory()

    choice.effects.forEach(effect => {
      if (effect.affinityChange !== undefined) {
        updateCharacterAffinity(effect.characterId, effect.affinityChange)
      }
      if (effect.moodChange !== undefined) {
        updateCharacterMood(effect.characterId, effect.moodChange)
      }
    })

    if (choice.resourceChange !== undefined) {
      resources.value = Math.max(0, resources.value + choice.resourceChange)
    }

    if (choice.unlockCharacterId) {
      const char = characters.value.find(c => c.id === choice.unlockCharacterId)
      if (char) {
        char.unlocked = true
        const charConfig = gameConfig.characters.find(c => c.id === choice.unlockCharacterId)
        addLog('system', `✨ 解锁新角色：${charConfig?.name || choice.unlockCharacterId}`)
      }
    }

    if (choice.addCardId) {
      if (!collectedCards.value.includes(choice.addCardId)) {
        collectedCards.value.push(choice.addCardId)
        const card = gameConfig.cards.find(c => c.id === choice.addCardId)
        addLog('system', `🎴 获得卡牌：${card?.name || choice.addCardId}`)
      }
    }

    addLog('story', `选择了：${choice.text}`)

    currentEvent.value = null
    showEventModal.value = false

    if (choice.nextEventId) {
      const nextEvent = gameConfig.events.find(e => e.id === choice.nextEventId)
      if (nextEvent) {
        setTimeout(() => triggerEvent(nextEvent), 300)
      }
    }
  }

  function selectCharacter(id: string) {
    const char = characters.value.find(c => c.id === id)
    if (char && char.unlocked) {
      selectedCharacterId.value = id
    }
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  function loadNgPlusData() {
    try {
      const raw = localStorage.getItem(NGPLUS_STORAGE_KEY)
      if (raw) {
        ngplusData.value = JSON.parse(raw) as NewGamePlusData
      }
    } catch (e) {
      console.error('Failed to load NewGame+ data:', e)
    }
  }

  function saveNgPlusData() {
    try {
      localStorage.setItem(NGPLUS_STORAGE_KEY, JSON.stringify(ngplusData.value))
    } catch (e) {
      console.error('Failed to save NewGame+ data:', e)
    }
  }

  function updateMaxAffinityRecords() {
    characters.value.forEach(char => {
      const current = ngplusData.value.maxAffinityReached[char.id] || 0
      if (char.affinity > current) {
        ngplusData.value.maxAffinityReached[char.id] = char.affinity
      }
      if (char.unlocked && !ngplusData.value.unlockedCharacters.includes(char.id)) {
        ngplusData.value.unlockedCharacters.push(char.id)
      }
    })
  }

  function checkGameEnding() {
    updateMaxAffinityRecords()
    const playTime = Date.now() - gameStartTime.value
    ngplusData.value.totalPlayTime += playTime

    const allMaxed = characters.value.every(c => !c.unlocked || c.affinity >= gameConfig.maxAffinity)
    if (allMaxed && characters.value.filter(c => c.unlocked).length >= 3) {
      flags.value.push('all_characters_max')
    }

    if (difficultyMode.value === 'hard' || difficultyMode.value === 'nightmare') {
      flags.value.push('hard_or_higher')
    }
    if (difficultyMode.value === 'nightmare') {
      flags.value.push('nightmare_mode')
      if (flags.value.includes('unlock_mystery')) {
        flags.value.push('nightmare_clear')
      }
    }

    let ending: EndingConfig | null = null
    const candidateEndings = gameConfig.endings.filter(e => {
      if (e.isHidden && !ngplusData.value.allClearedDifficulties.includes('hard') && !isNewGamePlus.value) {
        return false
      }
      if (e.unlockCondition === 'nightmare_difficulty' && difficultyMode.value !== 'nightmare') {
        return false
      }
      if (e.characterId) {
        const char = characters.value.find(c => c.id === e.characterId)
        if (!char || !char.unlocked) return false
        if (e.minAffinity && char.affinity < e.minAffinity) return false
      }
      if (e.requiredFlags) {
        if (!e.requiredFlags.every(f => flags.value.includes(f))) return false
      }
      return true
    })

    candidateEndings.sort((a, b) => {
      const aScore = (a.isHidden ? 100 : 0) + (a.minAffinity || 0)
      const bScore = (b.isHidden ? 100 : 0) + (b.minAffinity || 0)
      return bScore - aScore
    })

    if (candidateEndings.length > 0) {
      ending = candidateEndings[0]
    }

    currentEnding.value = ending
    gameCleared.value = true
    showEndingModal.value = true

    ngplusData.value.playthroughCount++
    playthroughCount.value = ngplusData.value.playthroughCount
    if (!ngplusData.value.allClearedDifficulties.includes(difficultyMode.value)) {
      ngplusData.value.allClearedDifficulties.push(difficultyMode.value)
    }
    const diffOrder: Record<DifficultyMode, number> = { normal: 0, hard: 1, nightmare: 2 }
    if (diffOrder[difficultyMode.value] > diffOrder[ngplusData.value.highestDifficultyCleared]) {
      ngplusData.value.highestDifficultyCleared = difficultyMode.value
    }
    ngplusData.value.inheritedCards = [...new Set([...ngplusData.value.inheritedCards, ...collectedCards.value])]
    if (ending && !ngplusData.value.clearedEndings.includes(ending.id)) {
      ngplusData.value.clearedEndings.push(ending.id)
    }
    ngplusData.value.flags = [...new Set([...ngplusData.value.flags, ...flags.value])]
    saveNgPlusData()
  }

  function startNewGamePlus(selectedInherit: InheritContentType[], selectedDifficulty: DifficultyMode) {
    difficultyMode.value = selectedDifficulty
    isNewGamePlus.value = true
    inheritedContent.value = selectedInherit
    playthroughCount.value = ngplusData.value.playthroughCount
    gameCleared.value = false
    currentEnding.value = null
    showEndingModal.value = false

    const diffConfig = gameConfig.difficulties.find(d => d.mode === selectedDifficulty) || gameConfig.difficulties[0]

    day.value = 1
    timeSlot.value = 'morning'
    actionsRemaining.value = diffConfig.maxActionsPerDay
    let startResources = diffConfig.initialResources
    if (selectedInherit.includes('resources')) {
      startResources += 50
    }
    resources.value = startResources
    selectedCharacterId.value = null
    currentEvent.value = null
    showEventModal.value = false
    gameStartTime.value = Date.now()

    characters.value = gameConfig.characters.map(c => {
      let baseAff = c.baseAffinity
      if (selectedInherit.includes('affinity_bonus')) {
        baseAff += 10
      }
      let shouldUnlock = c.unlocked && !c.hidden
      if (c.unlockCondition === 'new_game_plus' && isNewGamePlus.value) {
        shouldUnlock = true
      }
      if (selectedInherit.includes('character_info') && ngplusData.value.unlockedCharacters.includes(c.id)) {
        shouldUnlock = true
      }
      return {
        id: c.id,
        affinity: baseAff,
        mood: c.baseMood,
        unlocked: shouldUnlock
      }
    })

    flags.value = ['new_game_plus']
    if (selectedDifficulty === 'hard' || selectedDifficulty === 'nightmare') {
      flags.value.push('hard_or_higher')
    }
    if (selectedDifficulty === 'nightmare') {
      flags.value.push('nightmare_mode')
    }
    triggeredEvents.value = []

    collectedCards.value = []
    if (selectedInherit.includes('cards')) {
      collectedCards.value = [...ngplusData.value.inheritedCards]
    }
    const ngpCard = gameConfig.cards.find(c => c.unlockCondition === 'new_game_plus_start')
    if (ngpCard && !collectedCards.value.includes(ngpCard.id)) {
      collectedCards.value.push(ngpCard.id)
    }

    logs.value = []
    history.value = []
    logIdCounter = 0

    addLog('system', `🌟 二周目开启！第 ${playthroughCount.value} 轮游戏开始`)
    addLog('system', `当前难度：${diffConfig.icon} ${diffConfig.name}`)
    if (selectedInherit.length > 0) {
      const names = selectedInherit.map(t => gameConfig.inheritOptions.find(o => o.type === t)?.name).filter(Boolean).join('、')
      addLog('system', `已继承：${names}`)
    }
    checkAndTriggerEvent()
  }

  function resetGame() {
    loadNgPlusData()
    difficultyMode.value = 'normal'
    isNewGamePlus.value = false
    inheritedContent.value = []
    gameCleared.value = false
    currentEnding.value = null
    showEndingModal.value = false
    playthroughCount.value = ngplusData.value.playthroughCount

    day.value = 1
    timeSlot.value = 'morning'
    actionsRemaining.value = gameConfig.difficulties[0].maxActionsPerDay
    resources.value = gameConfig.difficulties[0].initialResources
    selectedCharacterId.value = null
    currentEvent.value = null
    showEventModal.value = false
    gameStartTime.value = Date.now()

    characters.value = gameConfig.characters.map(c => ({
      id: c.id,
      affinity: c.baseAffinity,
      mood: c.baseMood,
      unlocked: c.unlocked && !c.hidden
    }))

    flags.value = []
    triggeredEvents.value = []
    collectedCards.value = []
    logs.value = []
    history.value = []
    logIdCounter = 0

    addLog('system', '🎮 游戏开始！欢迎来到恋爱物语')
    checkAndTriggerEvent()
  }

  function initGame() {
    loadNgPlusData()
    playthroughCount.value = ngplusData.value.playthroughCount
    if (logs.value.length === 0) {
      addLog('system', '🎮 游戏开始！欢迎来到恋爱物语')
    }
    checkAndTriggerEvent()
  }

  function closeEndingModal() {
    showEndingModal.value = false
  }

  return {
    day,
    timeSlot,
    actionsRemaining,
    resources,
    characters,
    selectedCharacterId,
    currentCharacter,
    currentCharacterConfig,
    unlockedCharacters,
    flags,
    triggeredEvents,
    collectedCards,
    logs,
    history,
    currentEvent,
    showEventModal,
    darkMode,
    difficultyMode,
    isNewGamePlus,
    playthroughCount,
    inheritedContent,
    gameCleared,
    currentEnding,
    showEndingModal,
    ngplusData,
    currentDifficultyConfig,
    availableDifficulties,
    canStartNewGamePlus,
    addLog,
    saveHistory,
    rollbackToStep,
    getCharacterState,
    updateCharacterAffinity,
    updateCharacterMood,
    performAction,
    selectCharacter,
    handleEventChoice,
    toggleDarkMode,
    resetGame,
    initGame,
    checkAndTriggerEvent,
    startNewGamePlus,
    loadNgPlusData,
    saveNgPlusData,
    closeEndingModal,
    updateMaxAffinityRecords
  }
})
