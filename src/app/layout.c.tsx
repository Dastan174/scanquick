import Header from '@/widgets/header/Header';
import React from 'react';

interface ChildrenProps {
  children: React.ReactNode;
}

const layout = ({ children }: ChildrenProps) => (
  <div className="layout">
    <Header />
    <main>{children}</main>
  </div>
);

export default layout;
