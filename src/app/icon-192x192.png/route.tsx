import { ImageResponse } from 'next/og';
import { PwaIcon } from '@/components/pwa-icon';

export function GET() {
  return new ImageResponse(<PwaIcon />, { width: 192, height: 192 });
}
