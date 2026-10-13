import { router } from 'expo-router';

import { ScreenMessage } from '@/components/screen-message';
import { Button } from '@/components/ui/button';

export default function NotFoundScreen() {
  return (
    <ScreenMessage
      icon="search"
      title="Страница не найдена"
      text="Возможно, ссылка устарела или раздел переехал.">
      <Button title="На главную" onPress={() => router.replace('/')} />
    </ScreenMessage>
  );
}
