import type { NewsProvider } from '@/lib/types';
import { NewsApiProvider } from './newsapi.provider';
import { GuardianProvider } from './guardian.provider';
import { NytProvider } from './nyt.provider';

function createProviders(): NewsProvider[] {
  const providers: NewsProvider[] = [];

  if (process.env.NEWSAPI_KEY) {
    providers.push(new NewsApiProvider(process.env.NEWSAPI_KEY));
  }
  if (process.env.GUARDIAN_KEY) {
    providers.push(new GuardianProvider(process.env.GUARDIAN_KEY));
  }
  if (process.env.NYT_KEY) {
    providers.push(new NytProvider(process.env.NYT_KEY));
  }

  return providers;
}

export const providers = createProviders();

export { NewsApiProvider } from './newsapi.provider';
export { GuardianProvider } from './guardian.provider';
export { NytProvider } from './nyt.provider';
