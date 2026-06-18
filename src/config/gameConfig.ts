import type { GameConfig } from '../types/game'

export const gameConfig: GameConfig = {
  title: '恋爱物语',
  initialResources: 100,
  maxActionsPerDay: 3,
  daysPerWeek: 7,
  gameDurationDays: 30,
  maxAffinity: 100,
  minAffinity: -50,
  maxMood: 100,
  minMood: 0,
  moodDecayPerDay: 5,
  affinityDecayPerDay: 1,
  timeSlots: ['morning', 'afternoon', 'evening', 'night'],

  difficulties: [
    {
      mode: 'normal',
      name: '普通',
      description: '标准难度，适合初次游玩',
      icon: '🌱',
      initialResources: 100,
      maxActionsPerDay: 3,
      moodDecayPerDay: 5,
      affinityDecayPerDay: 1,
      workRewardMultiplier: 1,
      affinityGainMultiplier: 1,
      giftCostMultiplier: 1
    },
    {
      mode: 'hard',
      name: '困难',
      description: '资源更紧张，好感度衰减更快，解锁隐藏线',
      icon: '🔥',
      initialResources: 60,
      maxActionsPerDay: 2,
      moodDecayPerDay: 8,
      affinityDecayPerDay: 2,
      workRewardMultiplier: 0.8,
      affinityGainMultiplier: 0.85,
      giftCostMultiplier: 1.3
    },
    {
      mode: 'nightmare',
      name: '噩梦',
      description: '极致挑战，解锁真结局',
      icon: '💀',
      initialResources: 30,
      maxActionsPerDay: 2,
      moodDecayPerDay: 12,
      affinityDecayPerDay: 3,
      workRewardMultiplier: 0.6,
      affinityGainMultiplier: 0.7,
      giftCostMultiplier: 1.5
    }
  ],

  inheritOptions: [
    {
      type: 'cards',
      name: '卡牌收藏',
      description: '保留已收集的全部卡牌',
      icon: '🎴'
    },
    {
      type: 'character_info',
      name: '角色情报',
      description: '解锁已认识角色的完整资料',
      icon: '📖'
    },
    {
      type: 'affinity_bonus',
      name: '好感度加成',
      description: '所有角色初始好感度+10',
      icon: '💕'
    },
    {
      type: 'resources',
      name: '启动资金',
      description: '初始代币+50',
      icon: '💰'
    }
  ],

  endings: [
    {
      id: 'ending_linxiaoyu',
      name: '樱花之约',
      description: '与林小雨在樱花树下许下永恒的承诺',
      characterId: 'linxiaoyu',
      minAffinity: 90
    },
    {
      id: 'ending_sufei',
      name: '咖啡香中',
      description: '成为苏菲咖啡馆的合伙人，也是她人生的合伙人',
      characterId: 'sufei',
      minAffinity: 90
    },
    {
      id: 'ending_yeqing',
      name: '月光奏鸣',
      description: '叶青终于敞开心扉，与你共谱一曲月光奏鸣曲',
      characterId: 'yeqing',
      minAffinity: 90
    },
    {
      id: 'ending_harem',
      name: '恋爱物语',
      description: '与所有人都建立了深厚的羁绊，故事还在继续...',
      requiredFlags: ['all_characters_max'],
      isHidden: true
    },
    {
      id: 'ending_true',
      name: '真相',
      description: '揭开这座城市背后的秘密，真结局（仅噩梦难度）',
      requiredFlags: ['unlock_mystery', 'nightmare_clear'],
      isHidden: true,
      unlockCondition: 'nightmare_difficulty'
    }
  ],

  characters: [
    {
      id: 'linxiaoyu',
      name: '林小雨',
      avatar: '🌸',
      description: '温柔善良的图书馆管理员，喜欢读书和花草',
      personality: '温柔内向，有些害羞，但对喜欢的事物非常热情',
      favoriteGifts: ['flower', 'book', 'tea'],
      dislikedGifts: ['alcohol', 'game_console'],
      chatTopics: [
        { topic: '文学', affinity: 3 },
        { topic: '花草', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '游戏', affinity: -1 },
        { topic: '运动', affinity: 0 }
      ],
      baseAffinity: 10,
      baseMood: 60,
      unlocked: true
    },
    {
      id: 'sufei',
      name: '苏菲',
      avatar: '🔥',
      description: '活泼开朗的咖啡馆女老板，热爱烘焙',
      personality: '热情外向，有点毒舌但内心温柔',
      favoriteGifts: ['coffee', 'dessert', 'game_console'],
      dislikedGifts: ['flower', 'book'],
      chatTopics: [
        { topic: '美食', affinity: 3 },
        { topic: '游戏', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '文学', affinity: -1 },
        { topic: '运动', affinity: 2 }
      ],
      baseAffinity: 5,
      baseMood: 70,
      unlocked: true
    },
    {
      id: 'yeqing',
      name: '叶青',
      avatar: '🌙',
      description: '神秘的转学生，总是独来独往',
      personality: '冷静寡言，似乎藏着很多秘密',
      favoriteGifts: ['book', 'tea', 'music_box'],
      dislikedGifts: ['dessert', 'alcohol'],
      chatTopics: [
        { topic: '文学', affinity: 2 },
        { topic: '音乐', affinity: 3 },
        { topic: '天气', affinity: 0 },
        { topic: '游戏', affinity: 1 },
        { topic: '运动', affinity: -1 }
      ],
      baseAffinity: 0,
      baseMood: 50,
      unlocked: false,
      hidden: true,
      unlockCondition: 'unlock_yeqing'
    },
    {
      id: 'xingchen',
      name: '星辰',
      avatar: '✨',
      description: '二周目解锁的神秘少女，似乎知道一切的真相',
      personality: '优雅神秘，话语中总带着深意，仿佛能预知未来',
      favoriteGifts: ['music_box', 'book', 'flower'],
      dislikedGifts: ['alcohol', 'game_console'],
      chatTopics: [
        { topic: '文学', affinity: 3 },
        { topic: '音乐', affinity: 3 },
        { topic: '天气', affinity: 2 },
        { topic: '游戏', affinity: 0 },
        { topic: '运动', affinity: -2 }
      ],
      baseAffinity: 5,
      baseMood: 60,
      unlocked: false,
      hidden: true,
      unlockCondition: 'new_game_plus'
    }
  ],

  gifts: [
    { id: 'flower', name: '鲜花', price: 30, icon: '🌹', description: '一束美丽的鲜花' },
    { id: 'book', name: '小说', price: 25, icon: '📚', description: '一本畅销小说' },
    { id: 'tea', name: '茶叶', price: 40, icon: '🍵', description: '上等的茶叶礼盒' },
    { id: 'coffee', name: '咖啡豆', price: 35, icon: '☕', description: '精品咖啡豆' },
    { id: 'dessert', name: '甜点', price: 20, icon: '🍰', description: '精致的手工甜点' },
    { id: 'game_console', name: '游戏机', price: 80, icon: '🎮', description: '最新款掌上游戏机' },
    { id: 'alcohol', name: '红酒', price: 60, icon: '🍷', description: '一瓶高档红酒' },
    { id: 'music_box', name: '音乐盒', price: 50, icon: '🎵', description: '精致的八音盒' }
  ],

  cards: [
    { id: 'linxiaoyu_common_1', name: '图书馆的邂逅', characterId: 'linxiaoyu', rarity: 'common', image: '📖', description: '第一次在图书馆见到小雨的场景', unlockCondition: 'meet_linxiaoyu' },
    { id: 'linxiaoyu_rare_1', name: '花田中', characterId: 'linxiaoyu', rarity: 'rare', image: '🌻', description: '小雨在花田中微笑的样子', unlockCondition: 'linxiaoyu_affinity_40' },
    { id: 'linxiaoyu_epic_1', name: '雨中伞', characterId: 'linxiaoyu', rarity: 'epic', image: '☂️', description: '一起在雨中撑伞回家', unlockCondition: 'linxiaoyu_affinity_70' },
    { id: 'linxiaoyu_legendary_1', name: '告白', characterId: 'linxiaoyu', rarity: 'legendary', image: '💝', description: '樱花树下的告白', unlockCondition: 'linxiaoyu_affinity_100' },
    { id: 'sufei_common_1', name: '咖啡馆的相遇', characterId: 'sufei', rarity: 'common', image: '☕', description: '第一次走进苏菲的咖啡馆', unlockCondition: 'meet_sufei' },
    { id: 'sufei_rare_1', name: '烘焙时光', characterId: 'sufei', rarity: 'rare', image: '🧁', description: '苏菲教你做蛋糕', unlockCondition: 'sufei_affinity_40' },
    { id: 'sufei_epic_1', name: '深夜游戏', characterId: 'sufei', rarity: 'epic', image: '🎮', description: '一起打游戏到深夜', unlockCondition: 'sufei_affinity_70' },
    { id: 'sufei_legendary_1', name: '夕阳下的吻', characterId: 'sufei', rarity: 'legendary', image: '🌅', description: '咖啡馆关门前的浪漫时刻', unlockCondition: 'sufei_affinity_100' },
    { id: 'yeqing_common_1', name: '月下身影', characterId: 'yeqing', rarity: 'common', image: '🌙', description: '月光下独自散步的叶青', unlockCondition: 'meet_yeqing' },
    { id: 'yeqing_rare_1', name: '琴音缭绕', characterId: 'yeqing', rarity: 'rare', image: '🎹', description: '叶青弹奏钢琴的样子', unlockCondition: 'yeqing_affinity_40' },
    { id: 'yeqing_epic_1', name: '星夜告白', characterId: 'yeqing', rarity: 'epic', image: '🌌', description: '在星空下，叶青终于说出了她的秘密', unlockCondition: 'yeqing_affinity_70' },
    { id: 'yeqing_legendary_1', name: '永恒约定', characterId: 'yeqing', rarity: 'legendary', image: '💍', description: '约定好要一起看遍每一个星空', unlockCondition: 'yeqing_affinity_100' },
    { id: 'xingchen_common_1', name: '初见星辰', characterId: 'xingchen', rarity: 'common', image: '✨', description: '她的出现仿佛命中注定', unlockCondition: 'meet_xingchen' },
    { id: 'xingchen_rare_1', name: '命运之书', characterId: 'xingchen', rarity: 'rare', image: '📖', description: '星辰给你看了一本写着你名字的书', unlockCondition: 'xingchen_affinity_40' },
    { id: 'xingchen_epic_1', name: '时空裂隙', characterId: 'xingchen', rarity: 'epic', image: '🌀', description: '真相开始浮出水面', unlockCondition: 'xingchen_affinity_70' },
    { id: 'xingchen_legendary_1', name: '新世界', characterId: 'xingchen', rarity: 'legendary', image: '🌟', description: '与她一起，走向新的世界', unlockCondition: 'xingchen_affinity_100' },
    { id: 'special_newgame_1', name: '二周目纪念', characterId: 'linxiaoyu', rarity: 'legendary', image: '🎊', description: '纪念你的第一次二周目之旅', unlockCondition: 'new_game_plus_start' }
  ],

  events: [
    {
      id: 'intro_linxiaoyu',
      title: '图书馆的邂逅',
      description: '你在图书馆寻找一本书时，一位温柔的女生帮你找到了它。她叫林小雨，是这里的管理员。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 1, maxDay: 1, timeOfDay: 'morning' },
      choices: [
        {
          id: 'thankful',
          text: '道谢并和她聊聊天',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 5, moodChange: 10 }],
          addCardId: 'linxiaoyu_common_1'
        },
        {
          id: 'hurry',
          text: '道谢后匆匆离开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 2 }]
        }
      ],
      once: true,
      priority: 100
    },
    {
      id: 'intro_sufei',
      title: '咖啡馆的偶遇',
      description: '你走进一家新开的咖啡馆，热情的女老板苏菲立刻迎了上来。"欢迎光临！今天想来点什么？"',
      characterId: 'sufei',
      triggerCondition: { minDay: 1, maxDay: 2, timeOfDay: 'afternoon' },
      choices: [
        {
          id: 'coffee',
          text: '点一杯招牌咖啡',
          effects: [{ characterId: 'sufei', affinityChange: 5, moodChange: 10 }],
          resourceChange: -10,
          addCardId: 'sufei_common_1'
        },
        {
          id: 'dessert',
          text: '点一份甜点尝尝',
          effects: [{ characterId: 'sufei', affinityChange: 7, moodChange: 15 }],
          resourceChange: -20
        }
      ],
      once: true,
      priority: 99
    },
    {
      id: 'rainy_day_1',
      title: '突如其来的暴雨',
      description: '天空突然下起了大雨，你看到林小雨站在屋檐下，似乎没带伞。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 3, timeOfDay: 'evening', minAffinity: 20, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'share_umbrella',
          text: '把伞借给她',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 15, moodChange: 20 }]
        },
        {
          id: 'wait_together',
          text: '陪她等雨停',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 10 }]
        },
        {
          id: 'leave',
          text: '假装没看到走开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -5, moodChange: -10 }]
        }
      ],
      once: true,
      priority: 90
    },
    {
      id: 'cafe_late_night',
      title: '深夜咖啡馆',
      description: '你路过咖啡馆，发现灯还亮着。苏菲一个人在店里，看起来有些疲惫。',
      characterId: 'sufei',
      triggerCondition: { minDay: 5, timeOfDay: 'night', minAffinity: 30, characterId: 'sufei' },
      choices: [
        {
          id: 'help',
          text: '进去帮帮忙',
          effects: [{ characterId: 'sufei', affinityChange: 12, moodChange: 15 }],
          resourceChange: -5
        },
        {
          id: 'company',
          text: '点杯咖啡陪陪她',
          effects: [{ characterId: 'sufei', affinityChange: 8, moodChange: 10 }],
          resourceChange: -15
        },
        {
          id: 'ignore',
          text: '不打扰她了',
          effects: [{ characterId: 'sufei', affinityChange: -3 }]
        }
      ],
      once: true,
      priority: 85
    },
    {
      id: 'mysterious_girl',
      title: '神秘的转学生',
      description: '在公园的角落里，你看到一个安静的女生独自坐在长椅上。她似乎注意到了你，微微点了点头。',
      characterId: 'yeqing',
      triggerCondition: { minDay: 7, minAffinity: 40 },
      choices: [
        {
          id: 'approach',
          text: '上前打招呼',
          effects: [
            { characterId: 'yeqing', affinityChange: 5 },
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ],
          unlockCharacterId: 'yeqing',
          addCardId: 'yeqing_common_1'
        },
        {
          id: 'leave_quietly',
          text: '悄悄离开',
          effects: []
        }
      ],
      once: true,
      priority: 80
    },
    {
      id: 'birthday_surprise_1',
      title: '小雨的生日',
      description: '你想起今天是林小雨的生日，要准备什么惊喜吗？',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 14, minAffinity: 50, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'big_surprise',
          text: '准备一个大惊喜',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 25, moodChange: 30 }],
          resourceChange: -50
        },
        {
          id: 'small_gift',
          text: '送一个小礼物',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 }],
          resourceChange: -20
        },
        {
          id: 'forget',
          text: '算了，假装不知道',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -10, moodChange: -20 }]
        }
      ],
      once: true,
      priority: 95
    },
    {
      id: 'conflict_1',
      title: '两人的邀约',
      description: '林小雨和苏菲同时邀请你周末出去，你该怎么办？',
      triggerCondition: { minDay: 10, minAffinity: 35 },
      choices: [
        {
          id: 'choose_xiaoyu',
          text: '答应小雨',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 },
            { characterId: 'sufei', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'choose_sufei',
          text: '答应苏菲',
          effects: [
            { characterId: 'sufei', affinityChange: 10, moodChange: 15 },
            { characterId: 'linxiaoyu', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'reject_both',
          text: '都拒绝，说有事',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ]
        },
        {
          id: 'suggest_together',
          text: '建议三个人一起',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -2 },
            { characterId: 'sufei', affinityChange: -2 }
          ]
        }
      ],
      once: true,
      priority: 88
    },
    {
      id: 'ngp_intro_xingchen',
      title: '星辰的低语',
      description: '二周目的第一天，你总觉得有人在注视着你。转身望去，一位银发少女正站在街角微笑。"又见面了...或者说，初次见面？"',
      characterId: 'xingchen',
      triggerCondition: { minDay: 1, maxDay: 2, timeOfDay: 'morning', requiredFlags: ['new_game_plus'] },
      choices: [
        {
          id: 'talk',
          text: '上前搭话',
          effects: [{ characterId: 'xingchen', affinityChange: 10, moodChange: 10 }],
          unlockCharacterId: 'xingchen',
          addCardId: 'xingchen_common_1'
        },
        {
          id: 'ignore',
          text: '她在和别人说话吧',
          effects: [{ characterId: 'xingchen', affinityChange: -5 }]
        }
      ],
      once: true,
      priority: 200
    },
    {
      id: 'ngp_xingchen_hint',
      title: '命运的提示',
      description: '星辰找到你，递给你一张纸条。"有些事情，这一次要记得早点发现哦。"',
      characterId: 'xingchen',
      triggerCondition: { minDay: 5, characterId: 'xingchen', minAffinity: 20, requiredFlags: ['new_game_plus'] },
      choices: [
        {
          id: 'read',
          text: '认真阅读纸条',
          effects: [{ characterId: 'xingchen', affinityChange: 8 }],
          resourceChange: 30
        },
        {
          id: 'ask',
          text: '直接问她是什么意思',
          effects: [{ characterId: 'xingchen', affinityChange: 5, moodChange: 5 }]
        }
      ],
      once: true,
      priority: 75
    },
    {
      id: 'ngp_mystery_unlock',
      title: '真相的碎片',
      description: '在星辰的引导下，你开始发现这座城市不为人知的秘密...',
      triggerCondition: { minDay: 15, requiredFlags: ['new_game_plus', 'hard_or_higher'] },
      choices: [
        {
          id: 'investigate',
          text: '深入调查',
          effects: [{ characterId: 'xingchen', affinityChange: 15 }]
        },
        {
          id: 'stop',
          text: '有些事还是不知道为好',
          effects: []
        }
      ],
      once: true,
      priority: 70
    },
    {
      id: 'ngp_true_path',
      title: '通往真实之门',
      description: '只有在噩梦难度下，所有的线索才会汇聚成完整的真相。星辰的眼中闪着泪光："这一次，你能拯救大家吗？"',
      triggerCondition: { minDay: 25, requiredFlags: ['new_game_plus', 'nightmare_mode', 'unlock_mystery'] },
      choices: [
        {
          id: 'accept',
          text: '握紧她的手，接受命运',
          effects: [
            { characterId: 'xingchen', affinityChange: 20 },
            { characterId: 'linxiaoyu', affinityChange: 5 },
            { characterId: 'sufei', affinityChange: 5 },
            { characterId: 'yeqing', affinityChange: 5 }
          ]
        }
      ],
      once: true,
      priority: 150
    },
    {
      id: 'ngp_hidden_birthday',
      title: '星辰的生日',
      description: '你从之前的记忆中想起，今天是星辰的生日。要为她准备什么呢？',
      characterId: 'xingchen',
      triggerCondition: { minDay: 20, minAffinity: 50, characterId: 'xingchen', requiredFlags: ['new_game_plus'] },
      choices: [
        {
          id: 'surprise',
          text: '准备一个惊喜派对',
          effects: [{ characterId: 'xingchen', affinityChange: 30, moodChange: 30 }],
          resourceChange: -80
        },
        {
          id: 'gift',
          text: '送一份贴心的礼物',
          effects: [{ characterId: 'xingchen', affinityChange: 15, moodChange: 15 }],
          resourceChange: -30
        }
      ],
      once: true,
      priority: 92
    }
  ],

  actions: [
    { type: 'chat', name: '聊天', icon: '💬', description: '和角色聊聊天，增进感情', energyCost: 1 },
    { type: 'gift', name: '送礼', icon: '🎁', description: '送礼物给角色，效果因人而异', energyCost: 1 },
    { type: 'work', name: '打工', icon: '💼', description: '辛苦工作赚取代币', energyCost: 2 }
  ],

  workRewards: { min: 15, max: 35 }
}

export default gameConfig
