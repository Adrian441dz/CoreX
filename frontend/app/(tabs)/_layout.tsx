import { Slot } from 'expo-router';

export default function RootLayout() {
  // <Slot /> renderiza tu index.tsx directamente sin envoltorios extra
  return <Slot />; 
}