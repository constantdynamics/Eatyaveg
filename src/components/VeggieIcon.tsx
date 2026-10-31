import { VeggieCharacter } from '../characters/VeggieCharacter';
import type { VeggieId } from '../domain/types';

interface VeggieIconProps {
  id: VeggieId;
  size?: number;
}

/** Het vriendje als rustig, stilstaand icoon in de ouder-app. */
export function VeggieIcon({ id, size = 40 }: VeggieIconProps) {
  return <VeggieCharacter veggie={id} size={size} animated={false} />;
}
