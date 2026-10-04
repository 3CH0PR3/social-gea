export const REACTION_CONFIGS = {
  like: {
    type: 'like',
    label: 'Me gusta',
    colorClass: 'text-[#1877F2] font-bold',
    hexColor: '#1877F2',
  },
  love: {
    type: 'love',
    label: 'Me encanta',
    colorClass: 'text-[#F02849] font-bold',
    hexColor: '#F02849',
  },
  care: {
    type: 'care',
    label: 'Me importa',
    colorClass: 'text-[#E29800] font-bold',
    hexColor: '#E29800',
  },
  haha: {
    type: 'haha',
    label: 'Me divierte',
    colorClass: 'text-[#E29800] font-bold',
    hexColor: '#E29800',
  },
  wow: {
    type: 'wow',
    label: 'Me asombra',
    colorClass: 'text-[#E29800] font-bold',
    hexColor: '#E29800',
  },
  sad: {
    type: 'sad',
    label: 'Me entristece',
    colorClass: 'text-[#E29800] font-bold',
    hexColor: '#E29800',
  },
  angry: {
    type: 'angry',
    label: 'Me enoja',
    colorClass: 'text-[#E44134] font-bold',
    hexColor: '#E44134',
  },
};

export function useReactions() {
  const getReactionConfig = (type) => REACTION_CONFIGS[type] || null;
  const getAllReactions = () => Object.values(REACTION_CONFIGS);

  return {
    REACTION_CONFIGS,
    getReactionConfig,
    getAllReactions,
  };
}
