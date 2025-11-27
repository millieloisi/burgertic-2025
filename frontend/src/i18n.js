import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: { welcome: 'Welcome', menu: 'Menu', cart: 'Cart', login: 'Login', register: 'Register' } },
  es: { translation: { welcome: 'Bienvenido', menu: 'Menú', cart: 'Carrito', login: 'Login', register: 'Registrarse' } },
  de: { translation: { welcome: 'Willkommen', menu: 'Speisekarte', cart: 'Warenkorb', login: 'Anmelden', register: 'Registrieren' } },
  fr: { translation: { welcome: 'Bienvenue', menu: 'Menu', cart: 'Panier', login: 'Connexion', register: 'Inscription' } },
  zh: { translation: { welcome: '欢迎', menu: '菜单', cart: '购物车', login: '登录', register: '注册' } }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
