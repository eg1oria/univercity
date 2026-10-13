import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, Divider } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing, type Theme } from '@/constants/theme';
import { allGrades, attendance, gpa, student, university } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

const NOTIFICATIONS = [
  { key: 'lessons', title: 'Начало пары', caption: 'За 10 минут до занятия' },
  { key: 'grades', title: 'Новые оценки', caption: 'РК, экзамены, итоговые баллы' },
  { key: 'chats', title: 'Сообщения', caption: 'Чаты группы и преподавателей' },
] as const;

type NotificationKey = (typeof NOTIFICATIONS)[number]['key'];

export default function SettingsScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    lessons: true,
    grades: true,
    chats: false,
  });
  const [biometrics, setBiometrics] = useState(true);
  const overallGpa = gpa(allGrades);
  const attendanceRate = attendance.attended / attendance.total;

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

      <View style={styles.stats}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Журнал и GPA"
          style={styles.stat}
          onPress={() => router.push('/grades')}>
          {({ pressed }) => (
            <Card style={[styles.statCard, pressed && { backgroundColor: theme.surfaceSunken }]}>
              <View style={styles.statHeader}>
                <Text variant="caption" color="inkMuted">
                  Средний балл
                </Text>
                <Icon name="chevronRight" size={16} color={theme.inkMuted} />
              </View>
              <Text variant="display">{overallGpa?.toFixed(2) ?? '—'}</Text>
              <Text variant="caption" color="inkMuted">
                GPA из 4.0
              </Text>
            </Card>
          )}
        </Pressable>
        <Card style={[styles.stat, styles.statCard]}>
          <Text variant="caption" color="inkMuted">
            Посещаемость
          </Text>
          <Text variant="display">{Math.round(attendanceRate * 100)}%</Text>
          <View style={styles.statBar}>
            <ProgressBar value={attendanceRate} />
          </View>
        </Card>
      </View>

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
  stats: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  stat: {
    flex: 1,
  },
  statCard: {
    gap: Spacing.s1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBar: {
    height: 18,
    justifyContent: 'center',
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
  footer: {
    textAlign: 'center',
  },
});
