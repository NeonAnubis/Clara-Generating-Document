import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const supportedLocales = ['en', 'es']

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const requestedLocale = cookieStore.get('locale')?.value || 'es'
  const locale = supportedLocales.includes(requestedLocale) ? requestedLocale : 'es'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
