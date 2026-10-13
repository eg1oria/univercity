import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { QrTabButton, TabBar, TabButton } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="home" label="Главная" />
          </TabTrigger>
          <TabTrigger name="schedule" href="/schedule" asChild>
            <TabButton icon="calendar" label="Расписание" />
          </TabTrigger>
          <TabTrigger name="qr" href="/qr" asChild>
            <QrTabButton />
          </TabTrigger>
          <TabTrigger name="chats" href="/chats" asChild>
            <TabButton icon="chat" label="Чаты" />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon="settings" label="Настройки" />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
});
