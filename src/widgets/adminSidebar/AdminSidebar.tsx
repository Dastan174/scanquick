'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(auth)/actions';
import scss from './adminSidebar.module.scss';

interface AdminSidebarProps {
  userEmail: string;
  latestProjectId: string | null;
}

export default function AdminSidebar({ userEmail, latestProjectId }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Editor/Preview/QR/Settings need a specific project — send people to
  // their most recently updated one, or to the wizard if they have none yet.
  const projectHref = (suffix: string) =>
    latestProjectId ? `/projects/${latestProjectId}/${suffix}` : '/projects/new';

  const mainNav = [
    { href: '/dashboard', icon: '◈', label: 'Dashboard' },
    { href: '/projects', icon: '♡', label: 'Projects' },
    { href: projectHref('edit'), icon: '◻', label: 'Editor' },
    { href: projectHref('preview'), icon: '▷', label: 'Preview' },
    { href: projectHref('qr'), icon: '⊞', label: 'QR Code' },
  ];

  const pagesNav = [
    { href: '/projects/new', icon: '+', label: 'Create Project' },
    { href: '/upgrade', icon: '◈', label: 'Payment' },
    { href: projectHref('settings'), icon: '⚙', label: 'Settings' },
    { href: '/billing', icon: '◉', label: 'Billing' },
    { href: '/profile', icon: '⊙', label: 'Profile' },
    { href: '/admin', icon: '⬡', label: 'Admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/projects') return pathname === '/projects';
    return pathname === href;
  };

  return (
    <>
      <button
        className={scss.mobileToggle}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>
      {mobileOpen && <div className={scss.overlay} onClick={() => setMobileOpen(false)} />}
      <aside
        className={`${scss.sidebar} ${collapsed ? scss.collapsed : ''} ${mobileOpen ? scss.mobileOpen : ''}`}
        style={mobileOpen ? { transform: 'translateX(0)' } : undefined}
      >
        <div className={scss.top}>
          <Link href="/" className={scss.logo}>
            <span className={scss.logoIcon}>♥</span>
            {!collapsed && <span>LoveQR</span>}
          </Link>
          <button
            className={scss.closeMobile}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={scss.nav}>
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${scss.link} ${isActive(item.href) ? scss.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={scss.linkIcon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {!collapsed && <span className={scss.groupLabel}>Pages</span>}
        <nav className={scss.nav}>
          {pagesNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${scss.link} ${isActive(item.href) ? scss.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={scss.linkIcon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {!collapsed && <span className={scss.userEmail}>{userEmail}</span>}

        <form action={signOut}>
          <button type="submit" className={scss.collapseBtn}>
            <span className={scss.linkIcon}>⏻</span>
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>

        <button className={scss.collapseBtn} onClick={() => setCollapsed((c) => !c)}>
          <span className={scss.linkIcon}>{collapsed ? '▸' : '◂'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
