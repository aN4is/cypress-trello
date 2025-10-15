export const VISUAL_TEST_DATA = {
  SPECIAL_CHARACTERS: {
    CHINESE: '测试',
    EMOJI: '🎉🎊',
    SYMBOLS: '!@#$%^&*()',
  },
  LONG_TITLES: {
    BOARD:
      'This is a very long board name that should test how the UI handles lengthy text content without breaking the layout',
    LIST: 'This is a very long list name that should test how the UI handles lengthy text content without breaking the layout',
    CARD: 'This is a very long card name that should test how the UI handles lengthy text content without breaking the layout or causing display issues',
  },
  STANDARD_NAMES: {
    BOARD: 'Test Board',
    LIST: 'Test List',
    CARD: 'Test Card',
  },
} as const;
