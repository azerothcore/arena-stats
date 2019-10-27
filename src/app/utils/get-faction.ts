export function getFaction(race: number): string {
  switch (race) {
    case 2:
    case 5:
    case 6:
    case 8:
    case 9:
    case 10:
      return 'horde';
    case 1:
    case 3:
    case 4:
    case 7:
    case 11:
      return 'alliance';
  }

  return '';
}
