import Constants from 'expo-constants';
import { useState, type ReactNode } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { useThemePreference, type ThemePreference } from '@/components/theme-preference';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, Divider } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing, type Theme } from '@/constants/theme';
import { student, university } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
];

const NOTIFICATIONS = [
  { key: 'lessons', title: 'Начало пары', caption: 'За 10 минут до занятия' },
  { key: 'grades', title: 'Новые оценки', caption: 'РК, экзамены, итоговые баллы' },
  { key: 'deadlines', title: 'Дедлайны', caption: 'За день до срока сдачи' },
  { key: 'chats', title: 'Сообщения', caption: 'Чаты группы и преподавателей' },
] as const;

type NotificationKey = (typeof NOTIFICATIONS)[number]['key'];

export default function SettingsScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    lessons: true,
    grades: true,
    deadlines: true,
    chats: false,
  });
  const [biometrics, setBiometrics] = useState(true);

  const confirmLogout = () => {
    Alert.alert('Выйти из аккаунта?', 'Чтобы войти снова, понадобится логин и пароль.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive' },
    ]);
  };

  return (
    <Screen>
      <Text variant="title">Настройки</Text>

      <Card style={styles.profile}>
        <Avatar name={student.fullName} size={56} />
        <View style={styles.profileBody}>
          <Text variant="heading">{student.fullName}</Text>
          <Text color="inkMuted">{student.specialty}</Text>
          <View style={styles.badges}>
            <Badge>{student.group}</Badge>
            <Badge>{`${student.course} курс`}</Badge>
            <Badge background="surfaceSunken" color="inkMuted">{`ID ${student.id}`}</Badge>
          </View>
        </View>
      </Card>

      <Section title="Уведомления">
        <Card padded={false}>
          {NOTIFICATIONS.map((item, index) => (
            <View key={item.key}>
              {index > 0 ? <Divider /> : null}
              <Row title={item.title} caption={item.caption}>
                <Toggle
                  label={item.title}
                  value={notifications[item.key]}
                  onChange={(value) =>
                    setNotifications((current) => ({ ...current, [item.key]: value }))
                  }
                />
              </Row>
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Оформление">
        <View
          accessibilityRole="radiogroup"
          style={[styles.segments, { backgroundColor: theme.surfaceSunken }]}>
          {THEMES.map((item) => {
            const selected = item.value === preference;
            return (
              <Pressable
                key={item.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setPreference(item.value)}
                style={[
                  styles.segment,
                  selected && { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
                ]}>
                <Text variant="bodyStrong" color={selected ? 'ink' : 'inkMuted'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title="Приложение">
        <Card padded={false}>
          <Row icon="globe" title="Язык">
            <Text color="inkMuted">Русский</Text>
          </Row>
          <Divider />
          <Row icon="lock" title="Вход по биометрии">
            <Toggle label="Вход по биометрии" value={biometrics} onChange={setBiometrics} />
          </Row>
          <Divider />
          <Row icon="info" title="Версия">
            <Text color="inkMuted">{Constants.expoConfig?.version ?? '1.0.0'}</Text>
          </Row>
        </Card>
      </Section>

      <Card padded={false}>
        <Pressable
          accessibilityRole="button"
          onPress={confirmLogout}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.surfaceSunken }]}>
          <Icon name="logout" size={20} color={theme.danger} />
          <Text variant="bodyStrong" color="danger">
            Выйти из аккаунта
          </Text>
        </Pressable>
      </Card>

      <Text variant="caption" color="inkMuted" style={styles.footer}>
        {university.name} · Студенческий портал
      </Text>
    </Screen>
  );
}

type RowProps = {
  title: string;
  caption?: string;
  icon?: IconName;
  children: ReactNode;
};

function Row({ title, caption, icon, children }: RowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {icon ? <Icon name={icon} size={20} color={theme.inkMuted} /> : null}
      <View style={styles.rowBody}>
        <Text>{title}</Text>
        {caption ? (
          <Text variant="caption" color="inkMuted">
            {caption}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** react-native-web paints the "on" state with its own props; without them the thumb is teal. */
function webSwitchColors(theme: Theme) {
  if (Platform.OS !== 'web') return null;
  return { activeThumbColor: theme.onBrand, activeTrackColor: theme.brand };
}

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function Toggle({ label, value, onChange }: ToggleProps) {
  const theme = useTheme();

  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onChange}
      trackColor={{ false: theme.borderStrong, true: theme.brand }}
      thumbColor={value ? theme.onBrand : theme.surfaceRaised}
      ios_backgroundColor={theme.borderStrong}
      {...webSwitchColors(theme)}
    />
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s4,
  },
  profileBody: {
    flex: 1,
    gap: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
    marginTop: Spacing.s2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    minHeight: 56,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s2,
  },
  rowBody: {
    flex: 1,
  },
  segments: {
    flexDirection: 'row',
    gap: Spacing.s1,
    padding: Spacing.s1,
    borderRadius: Radius.md,
  },
  segment: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: Radius.sm,
  },
  footer: {
    textAlign: 'center',
  },
});
