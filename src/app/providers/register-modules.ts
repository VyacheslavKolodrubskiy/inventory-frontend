import type { Router } from 'vue-router';
import type { DefaultModule } from '@/types';

interface AppModule {
  router?: (router: Router) => void
}

const modules = import.meta.globEager<DefaultModule<AppModule>>('@/modules/**/index.ts');

export function registerModules(router: Router) {
  const registerModule = (module: AppModule) => {
    if (module.router)
      module.router(router);
  };

  Object.keys(modules).sort((a, b) => a.split('/').length - b.split('/').length).forEach(async (moduleKey) => {
    const module = modules[moduleKey];

    registerModule(module.default);
  });
}
