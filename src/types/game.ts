export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export type MoodLevel = 'happy' | 'good' | 'neutral' | 'bad' | 'angry'

export type ActionType = 'chat' | 'gift' | 'work'

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export type DifficultyMode = 'normal' | 'hard' | 'nightmare'

export type InheritContentType = 'cards' | 'character_info' | 'affinity_bonus' | 'resources'

export interface CharacterConfig {
  id: string
  name: string
  avatar: string
  description: string
  personality: string
  favoriteGifts: string[]
  dislikedGifts: string[]
  chatTopics: { topic: string; affinity: number }[]
  baseAffinity: number
  baseMood: number
  unlocked: boolean
  hidden?: boolean
  unlockCondition?: string
}

export interface GiftConfig {
  id: string
  name: string
  price: number
  icon: string
  description: string
}

export interface CardConfig {
  id: string
  name: string
  characterId: string
  rarity: Rarity
  image: string
  description: string
  unlockCondition: string
}

export interface EventChoice {
  id: string
  text: string
  effects: {
    characterId: string
    affinityChange?: number
    moodChange?: number
  }[]
  resourceChange?: number
  nextEventId?: string
  unlockCharacterId?: string
  addCardId?: string
}

export interface GameEventConfig {
  id: string
  title: string
  description: string
  characterId?: string
  triggerCondition: {
    minAffinity?: number
    maxAffinity?: number
    minDay?: number
    maxDay?: number
    timeOfDay?: TimeOfDay
    requiredFlags?: string[]
    characterId?: string
  }
  choices: EventChoice[]
  once: boolean
  priority: number
}

export interface ActionConfig {
  type: ActionType
  name: string
  icon: string
  description: string
  cost?: number
  reward?: number
  energyCost: number
}

export interface DifficultyConfig {
  mode: DifficultyMode
  name: string
  description: string
  icon: string
  initialResources: number
  maxActionsPerDay: number
  moodDecayPerDay: number
  affinityDecayPerDay: number
  workRewardMultiplier: number
  affinityGainMultiplier: number
  giftCostMultiplier: number
}

export interface InheritConfig {
  type: InheritContentType
  name: string
  description: string
  icon: string
  unlockCondition?: string
}

export interface NewGamePlusData {
  playthroughCount: number
  highestDifficultyCleared: DifficultyMode
  allClearedDifficulties: DifficultyMode[]
  inheritedCards: string[]
  unlockedCharacters: string[]
  maxAffinityReached: Record<string, number>
  totalPlayTime: number
  flags: string[]
  clearedEndings: string[]
}

export interface EndingConfig {
  id: string
  name: string
  description: string
  characterId?: string
  minAffinity?: number
  requiredFlags?: string[]
  isHidden?: boolean
  unlockCondition?: string
}

export interface GameConfig {
  title: string
  initialResources: number
  maxActionsPerDay: number
  daysPerWeek: number
  gameDurationDays: number
  maxAffinity: number
  minAffinity: number
  maxMood: number
  minMood: number
  moodDecayPerDay: number
  affinityDecayPerDay: number
  timeSlots: TimeOfDay[]
  characters: CharacterConfig[]
  gifts: GiftConfig[]
  cards: CardConfig[]
  events: GameEventConfig[]
  actions: ActionConfig[]
  workRewards: { min: number; max: number }
  difficulties: DifficultyConfig[]
  inheritOptions: InheritConfig[]
  endings: EndingConfig[]
}
