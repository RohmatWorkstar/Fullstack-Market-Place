export const dictionaries = {
  en: {
    navbar: {
      searchPlaceholder: 'Search products...',
      dashboard: 'Dashboard',
      orders: 'Orders',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Log in',
      signup: 'Sign up',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
    }
  },
  id: {
    navbar: {
      searchPlaceholder: 'Cari produk...',
      dashboard: 'Dasbor',
      orders: 'Pesanan',
      profile: 'Profil',
      logout: 'Keluar',
      login: 'Masuk',
      signup: 'Daftar',
    },
    common: {
      loading: 'Memuat...',
      save: 'Simpan',
      cancel: 'Batal',
    }
  }
};

export type Dictionary = typeof dictionaries.en;
