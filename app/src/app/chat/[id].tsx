import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChats } from '@/components/chat-store';
import { Avatar } from '@/components/ui/avatar';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Radius, Spacing, Type } from '@/constants/theme';
import type { Message } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { chats, send, markRead } = useChats();
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);

  const chat = chats.find((item) => item.id === id);

  useEffect(() => {
    markRead(id);
  }, [id, markRead]);

  if (!chat) {
    return (
      <View style={[styles.root, { backgroundColor: theme.surface }]}>
        <Header title="Чат" />
        <View style={styles.missing}>
          <Text color="inkMuted">Чат не найден</Text>
        </View>
      </View>
    );
  }

  const text = draft.trim();
  const submit = () => {
    if (!text) return;
    send(chat.id, text);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.root, { backgroundColor: theme.surface }]}>
      <Header
        title={chat.title}
        subtitle={chat.subtitle}
        leading={<Avatar name={chat.title} size={36} />}
      />

      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        contentContainerStyle={styles.messages}>
        {chat.messages.map((message, index) => (
          <Bubble
            key={message.id}
            message={message}
            // The author is named once per run of their messages.
            showAuthor={message.author !== chat.messages[index - 1]?.author}
          />
        ))}
      </ScrollView>

      <View
        style={[
          styles.composer,
          {
            backgroundColor: theme.surfaceRaised,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom + Spacing.s2,
          },
        ]}>
        <View style={styles.composerRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Сообщение"
            placeholderTextColor={theme.inkMuted}
            accessibilityLabel="Сообщение"
            multiline
            numberOfLines={1}
            selectionColor={theme.brand}
            style={[
              styles.input,
              {
                color: theme.ink,
                backgroundColor: theme.surfaceSunken,
                borderColor: theme.borderStrong,
              },
            ]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Отправить"
            disabled={!text}
            onPress={submit}
            style={({ pressed }) => [
              styles.send,
              { backgroundColor: !text ? theme.surfaceSunken : pressed ? theme.brandHover : theme.brand },
            ]}>
            <Icon name="send" size={20} color={text ? theme.onBrand : theme.inkMuted} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, showAuthor }: { message: Message; showAuthor: boolean }) {
  const theme = useTheme();
  const mine = message.from === 'me';

  return (
    <View
      style={[
        styles.bubble,
        mine
          ? [styles.mine, { backgroundColor: theme.brandTint, borderColor: theme.brandTint }]
          : [styles.theirs, { backgroundColor: theme.surfaceRaised, borderColor: theme.border }],
      ]}>
      {!mine && message.author && showAuthor ? (
        <Text variant="label" color="brand">
          {message.author}
        </Text>
      ) : null}
      <Text>{message.text}</Text>
      <Text variant="caption" color={mine ? 'brandTintInk' : 'inkMuted'} style={styles.time}>
        {message.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.s4,
    gap: Spacing.s2,
  },
  bubble: {
    maxWidth: '82%',
    gap: 2,
    paddingHorizontal: Spacing.s3,
    paddingVertical: Spacing.s2,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  mine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: Radius.sm,
  },
  theirs: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Radius.sm,
  },
  time: {
    alignSelf: 'flex-end',
  },
  composer: {
    borderTopWidth: 1,
    paddingTop: Spacing.s2,
    paddingHorizontal: Spacing.s3,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.s2,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: Spacing.s3,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: Radius.md,
    fontFamily: Type.body.fontFamily,
    fontSize: Type.body.fontSize,
    lineHeight: Type.body.lineHeight,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
