'use client';

import { useState } from 'react';
import scss from './phoneFrame.module.scss';

const devices = ['Mobile', 'Tablet', 'Desktop'] as const;

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [device, setDevice] = useState<(typeof devices)[number]>('Mobile');

  return (
    <div className={scss.wrap}>
      <div className={`${scss.frame} ${scss[device.toLowerCase()]}`}>
        <div className={scss.screen}>{children}</div>
      </div>
      <div className={scss.deviceSwitch}>
        {devices.map((d) => (
          <button
            key={d}
            className={`${scss.deviceBtn} ${device === d ? scss.deviceActive : ''}`}
            onClick={() => setDevice(d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
