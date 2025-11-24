'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Users,
  Download,
  LayoutDashboard,
  FileSpreadsheet,
  LogOut,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import spainFlag from '@/assets/flags/spain.jpg'
import usFlag from '@/assets/flags/us.jpg'
import logo from '@/assets/logo.png'

const LOCALES = {
  es: { flag: spainFlag, name: 'Español' },
  en: { flag: usFlag, name: 'English' },
}

interface UserInfo {
  id: string
  email: string
  whatsappNumber: string
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('nav')
  const [currentLocale, setCurrentLocale] = useState<'es' | 'en'>('es')
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as 'es' | 'en' | undefined
    setCurrentLocale(cookieLocale || 'es')

    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  // Hide navbar on certain pages
  const isCustomerViewPage = pathname.startsWith('/customers/') && pathname !== '/customers'
  const isAuthPage = pathname === '/signin' || pathname === '/signup'

  if (isCustomerViewPage || isAuthPage) {
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

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/signin')
    router.refresh()
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center h-full py-2">
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={40}
              className="h-full w-auto object-contain"
              priority
            />
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

          {/* Right side: Language Switcher + User Menu */}
          <div className="flex items-center gap-2">
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

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
