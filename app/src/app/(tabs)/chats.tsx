import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useChats } from '@/components/chat-store';
import { Avatar } from '@/components/ui/avatar';
import { Card, Divider } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing, Type } from '@/constants/theme';
import type { Chat } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

function preview(chat: Chat) {
  const last = chat.messages[chat.messages.length - 1];
  if (!last) return '';
  if (last.from === 'me') return `Вы: ${last.text}`;
  // In a group the name before the comma is enough: «Данияр, староста» → «Данияр».
  return last.author ? `${last.author.split(',')[0]}: ${last.text}` : last.text;
}

export default function ChatsScreen() {
  const theme = useTheme();
  const { chats } = useChats();
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const found = needle
    ? chats.filter(
        (chat) =>
          chat.title.toLowerCase().includes(needle) ||
          chat.subtitle.toLowerCase().includes(needle) ||
          chat.messages.some((message) => message.text.toLowerCase().includes(needle))
      )
    : chats;

  return (
    <Screen>
      <Text variant="title">Чаты</Text>

      <View
        style={[
          styles.search,
          { backgroundColor: theme.surfaceSunken, borderColor: theme.borderStrong },
        ]}>
        <Icon name="search" size={20} color={theme.inkMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск"
          placeholderTextColor={theme.inkMuted}
          accessibilityLabel="Поиск по чатам"
          returnKeyType="search"
          autoCorrect={false}
          selectionColor={theme.brand}
          style={[styles.searchInput, { color: theme.ink }]}
        />
      </View>

      {found.length === 0 ? (
        <Card style={styles.empty}>
          <Text variant="heading">Ничего не найдено</Text>
          <Text color="inkMuted">Проверьте запрос или найдите чат по имени.</Text>
        </Card>
      ) : (
        <Card padded={false}>
          {found.map((chat, index) => (
            <View key={chat.id}>
              {index > 0 ? <Divider /> : null}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.id } })}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: theme.surfaceSunken },
                ]}>
                <Avatar name={chat.title} />
                <View style={styles.rowBody}>
                  <View style={styles.rowLine}>
                    <Text variant="bodyStrong" numberOfLines={1} style={styles.grow}>
                      {chat.title}
                    </Text>
                    <Text variant="caption" color="inkMuted">
                      {chat.lastAt}
                    </Text>
                  </View>
                  <View style={styles.rowLine}>
                    <Text color="inkMuted" numberOfLines={1} style={styles.grow}>
                      {preview(chat)}
                    </Text>
                    {chat.unread > 0 ? (
                      <View
                        accessibilityLabel={`Непрочитанных: ${chat.unread}`}
                        style={[styles.unread, { backgroundColor: theme.brandTint }]}>
                        <Text variant="label" color="brandTintInk">
                          {chat.unread}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    height: 44,
    paddingHorizontal: Spacing.s3,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: Type.body.fontFamily,
    fontSize: Type.body.fontSize,
    padding: 0,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.s1,
    paddingVertical: Spacing.s8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  grow: {
    flex: 1,
  },
  unread: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
