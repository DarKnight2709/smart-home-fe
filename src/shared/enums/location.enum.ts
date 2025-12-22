export const Location = {
  LIVING_ROOM: 'living-room',
  BEDROOM: 'bedroom',
  KITCHEN: 'kitchen',
} as const;

export type Location = typeof Location[keyof typeof Location];
