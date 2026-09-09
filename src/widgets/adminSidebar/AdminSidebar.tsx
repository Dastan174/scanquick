'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Play,
  Plus,
  QrCode,
  Receipt,
  Settings,
  Shield,
  User,
  X,
} from 'lucide-react';
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
    { href: '/dashboard', icon: LayoutDashboard, label: t.dashboard },
    { href: '/projects', icon: Heart, label: t.projects },
    { href: projectHref('edit'), icon: Pencil, label: t.editor },
    { href: projectHref('preview'), icon: Play, label: t.preview },
    { href: projectHref('qr'), icon: QrCode, label: t.qrCode },
  ];

  const pagesNav = [
    { href: '/projects/new', icon: Plus, label: t.createProject },
    { href: '/upgrade', icon: CreditCard, label: t.payment },
    { href: projectHref('settings'), icon: Settings, label: t.settings },
    { href: '/billing', icon: Receipt, label: t.billing },
    { href: '/profile', icon: User, label: t.profile },
    { href: '/admin', icon: Shield, label: t.admin },
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
        <Menu size={20} />
      </button>
      {mobileOpen && <div className={scss.overlay} onClick={() => setMobileOpen(false)} />}
      <aside
        className={`${scss.sidebar} ${collapsed ? scss.collapsed : ''} ${mobileOpen ? scss.mobileOpen : ''}`}
        style={mobileOpen ? { transform: 'translateX(0)' } : undefined}
      >
        <div className={scss.top}>
          <Link href="/" className={scss.logo}>
            <span className={scss.logoIcon}>
              <Image src="/logo.png" alt="" width={32} height={32} />
            </span>
            {!collapsed && <span>scanquick.kg</span>}
          </Link>
          <button
            className={scss.closeMobile}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
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
              <span className={scss.linkIcon}>
                <item.icon size={18} />
              </span>
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
              <span className={scss.linkIcon}>
                <item.icon size={18} />
              </span>
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
            <span className={scss.linkIcon}>
              <LogOut size={18} />
            </span>
            {!collapsed && <span>{t.signOut}</span>}
          </button>
        </form>

        <button className={scss.collapseBtn} onClick={() => setCollapsed((c) => !c)}>
          <span className={scss.linkIcon}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </span>
          {!collapsed && <span>{t.collapse}</span>}
        </button>
      </aside>
    </>
  );
}
