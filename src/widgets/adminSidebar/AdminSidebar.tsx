'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/(auth)/actions';
import { useLockBodyScroll } from '@/shared/lib/useLockBodyScroll';
import type { Dictionary } from '@/shared/lib/i18n/dictionaries';
import type { Locale } from '@/shared/lib/i18n/shared';
import LanguageSwitcher from '@/widgets/languageSwitcher/LanguageSwitcher';
import scss from './adminSidebar.module.scss';

interface AdminSidebarProps {
  userEmail: string;
  latestProjectId: string | null;
  locale: Locale;
  t: Dictionary['adminSidebar'];
}

export default function AdminSidebar({ userEmail, latestProjectId, locale, t }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useLockBodyScroll(mobileOpen);

  // Editor/Preview/QR/Settings need a specific project — send people to
  // their most recently updated one, or to the wizard if they have none yet.
  const projectHref = (suffix: string) =>
    latestProjectId ? `/projects/${latestProjectId}/${suffix}` : '/projects/new';

  const mainNav = [
    { href: '/dashboard', icon: '◈', label: t.dashboard },
    { href: '/projects', icon: '♡', label: t.projects },
    { href: projectHref('edit'), icon: '◻', label: t.editor },
    { href: projectHref('preview'), icon: '▷', label: t.preview },
    { href: projectHref('qr'), icon: '⊞', label: t.qrCode },
  ];

  const pagesNav = [
    { href: '/projects/new', icon: '+', label: t.createProject },
    { href: '/upgrade', icon: '◈', label: t.payment },
    { href: projectHref('settings'), icon: '⚙', label: t.settings },
    { href: '/billing', icon: '◉', label: t.billing },
    { href: '/profile', icon: '⊙', label: t.profile },
    { href: '/admin', icon: '⬡', label: t.admin },
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

        {!collapsed && <span className={scss.groupLabel}>{t.pages}</span>}
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
        {!collapsed && (
          <div className={scss.langRow}>
            <LanguageSwitcher locale={locale} />
          </div>
        )}

        <form action={signOut}>
          <button type="submit" className={scss.collapseBtn}>
            <span className={scss.linkIcon}>⏻</span>
            {!collapsed && <span>{t.signOut}</span>}
          </button>
        </form>

        <button className={scss.collapseBtn} onClick={() => setCollapsed((c) => !c)}>
          <span className={scss.linkIcon}>{collapsed ? '▸' : '◂'}</span>
          {!collapsed && <span>{t.collapse}</span>}
        </button>
      </aside>
    </>
  );
}
