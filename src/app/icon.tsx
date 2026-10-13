import { ImageResponse } from 'next/og';
import { PwaIcon } from '@/components/pwa-icon';

export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<PwaIcon />, { ...size });
}
