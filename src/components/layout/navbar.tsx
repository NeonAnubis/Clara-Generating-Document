'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Users,
  FileText,
  Download,
  LayoutDashboard,
  FileSpreadsheet,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import spainFlag from '@/assets/flags/spain.jpg'
import usFlag from '@/assets/flags/us.jpg'

const LOCALES = {
  es: { flag: spainFlag, name: 'Español' },
  en: { flag: usFlag, name: 'English' },
}

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [currentLocale, setCurrentLocale] = useState<'es' | 'en'>('es')

  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as 'es' | 'en' | undefined
    setCurrentLocale(cookieLocale || 'es')
  }, [])

  // Hide navbar on customer view page (/customers/[id])
  const isCustomerViewPage = pathname.startsWith('/customers/') && pathname !== '/customers'
  if (isCustomerViewPage) {
    return null
  }

  const navigation = [
    { name: t('dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('customers'), href: '/customers', icon: Users },
    // { name: t('templates'), href: '/templates', icon: FileText },
    { name: t('export'), href: '/export', icon: Download },
    { name: t('history'), href: '/history', icon: FileSpreadsheet },
  ]

  const switchLocale = async (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`
    window.location.reload()
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">📋</span>
            <span>{t('brand')}</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Image
                  src={LOCALES[currentLocale].flag}
                  alt={LOCALES[currentLocale].name}
                  width={24}
                  height={16}
                  className="rounded-sm"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale('es')} className="flex items-center gap-2">
                <Image src={spainFlag} alt="Español" width={20} height={14} className="rounded-sm" />
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('en')} className="flex items-center gap-2">
                <Image src={usFlag} alt="English" width={20} height={14} className="rounded-sm" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
