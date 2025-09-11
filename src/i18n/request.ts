import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  const resolved = locale ?? 'vi';
  const messages = (await import(`@/messages/${resolved}.json`)).default;
  return {messages, locale: resolved};
});
