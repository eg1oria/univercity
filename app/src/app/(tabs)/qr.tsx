import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from 'expo-router';
import { useRef, useState, type ReactNode } from 'react';
import { Linking, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { lessonPlace } from '@/components/lesson-card';
import { TabBarOverhang } from '@/components/tab-bar';
import { Button } from '@/components/ui/button';
import { Card, Divider } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { currentOrNextLesson, type Lesson } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { formatDateTime } from '@/lib/date';

const CODE_LENGTH = 6;
const FRAME_SIZE = 248;
// The viewfinder sits on a live camera image, so it uses the dark palette in both themes.
const overlay = Colors.dark;
const SCRIM = 'rgba(13, 19, 32, 0.72)';

type Attendance = {
  lesson: Lesson;
  at: Date;
};

export default function QrScreen() {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [cameraFailed, setCameraFailed] = useState(false);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  // The camera reports the same code many times a second; only the first hit counts.
  const marked = useRef(false);

  // In the prototype any QR code or six-digit code marks the lesson that is on now (or the nearest one).
  const markAttendance = () => {
    const upcoming = currentOrNextLesson(new Date());
    if (!upcoming || marked.current) return;
    marked.current = true;
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setAttendance({ lesson: upcoming.lesson, at: new Date() });
  };

  if (attendance) {
    return (
      <Marked
        attendance={attendance}
        onDone={() => {
          marked.current = false;
          setAttendance(null);
          setMode('scan');
        }}
      />
    );
  }

  if (mode === 'manual') {
    return <ManualEntry onSubmit={markAttendance} onScan={() => setMode('scan')} />;
  }

  if (!permission) {
    return <Centered />;
  }

  if (cameraFailed) {
    return (
      <Notice
        icon="camera"
        title="Камера недоступна"
        text="Отметьте посещаемость кодом занятия — его показывает преподаватель."
        action={<Button title="Ввести код вручную" onPress={() => setMode('manual')} />}
      />
    );
  }

  if (!permission.granted) {
    return (
      <Notice
        icon="camera"
        title="Доступ к камере"
        text="Камера нужна, чтобы отметить посещаемость по QR-коду преподавателя."
        action={
          <>
            {permission.canAskAgain ? (
              <Button title="Разрешить доступ" onPress={requestPermission} />
            ) : (
              <Button title="Открыть настройки" onPress={() => Linking.openSettings()} />
            )}
            <Button
              variant="secondary"
              title="Ввести код вручную"
              onPress={() => setMode('manual')}
            />
          </>
        }
      />
    );
  }

  return (
    <Scanner
      active={isFocused}
      onScanned={markAttendance}
      onManual={() => setMode('manual')}
      onError={() => setCameraFailed(true)}
    />
  );
}

type ScannerProps = {
  active: boolean;
  onScanned: () => void;
  onManual: () => void;
  onError: () => void;
};

function Scanner({ active, onScanned, onManual, onError }: ScannerProps) {
  const insets = useSafeAreaInsets();
  const [torch, setTorch] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: overlay.surfaceSunken }]}>
      {active ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={onScanned}
          onMountError={onError}
        />
      ) : null}

      <View style={[styles.scannerTop, { paddingTop: insets.top + Spacing.s4 }]}>
        <Text variant="title" style={{ color: overlay.ink }}>
          Отметка посещаемости
        </Text>
        <View style={styles.hint}>
          <Text variant="caption" style={{ color: overlay.ink }}>
            Наведите камеру на QR-код преподавателя
          </Text>
        </View>
      </View>

      <View style={styles.frameArea}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
      </View>

      <View style={[styles.scannerBottom, { paddingBottom: TabBarOverhang + Spacing.s6 }]}>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Фонарик"
          accessibilityState={{ checked: torch }}
          onPress={() => setTorch((value) => !value)}
          style={[styles.control, styles.torch, torch && { backgroundColor: overlay.ink }]}>
          <Icon
            name={torch ? 'torchOn' : 'torchOff'}
            size={22}
            color={torch ? overlay.surface : overlay.ink}
          />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onManual} style={styles.control}>
          <Icon name="keyboard" size={20} color={overlay.ink} />
          <Text variant="bodyStrong" style={{ color: overlay.ink }}>
            Ввести код вручную
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ManualEntry({ onSubmit, onScan }: { onSubmit: () => void; onScan: () => void }) {
  const theme = useTheme();
  const [code, setCode] = useState('');
  const complete = code.length === CODE_LENGTH;

  return (
    <Centered>
      <View style={styles.texts}>
        <Text variant="title" style={styles.centeredText}>
          Код занятия
        </Text>
        <Text color="inkMuted" style={styles.centeredText}>
          Введите шестизначный код, который показал преподаватель.
        </Text>
      </View>
      <TextInput
        value={code}
        onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
        onSubmitEditing={() => complete && onSubmit()}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={CODE_LENGTH}
        placeholder="000000"
        placeholderTextColor={theme.borderStrong}
        accessibilityLabel="Код занятия"
        selectionColor={theme.brand}
        style={[
          styles.codeInput,
          {
            color: theme.ink,
            backgroundColor: theme.surfaceSunken,
            borderColor: theme.borderStrong,
          },
        ]}
      />
      <View style={styles.actions}>
        <Button title="Отметить посещение" disabled={!complete} onPress={onSubmit} />
        <Button variant="secondary" title="Сканировать QR-код" onPress={onScan} />
      </View>
    </Centered>
  );
}

function Marked({ attendance, onDone }: { attendance: Attendance; onDone: () => void }) {
  const theme = useTheme();
  const { lesson, at } = attendance;

  return (
    <Centered>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.marked}>
        <Icon name="check" size={56} color={theme.success} style={styles.markedIcon} />
        <View style={styles.texts}>
          <Text variant="title" style={styles.centeredText}>
            Посещение отмечено
          </Text>
          <Text color="inkMuted" style={styles.centeredText}>
            Преподаватель увидит отметку в журнале.
          </Text>
        </View>
        <Card padded={false}>
          <View style={styles.markedLesson}>
            <Text variant="heading">{lesson.subject}</Text>
            <Text color="inkMuted">
              {lessonPlace(lesson)} · {lesson.teacher}
            </Text>
          </View>
          <Divider />
          <View style={styles.markedRow}>
            <Text color="inkMuted">Пара</Text>
            <Text variant="bodyStrong">
              {lesson.start}–{lesson.end}
            </Text>
          </View>
          <Divider />
          <View style={styles.markedRow}>
            <Text color="inkMuted">Отмечено</Text>
            <Text variant="bodyStrong">{formatDateTime(at)}</Text>
          </View>
        </Card>
        <Button title="Готово" onPress={onDone} />
      </Animated.View>
    </Centered>
  );
}

type NoticeProps = {
  icon: IconName;
  title: string;
  text: string;
  action: ReactNode;
};

function Notice({ icon, title, text, action }: NoticeProps) {
  const theme = useTheme();

  return (
    <Centered>
      <View style={[styles.noticeIcon, { backgroundColor: theme.brandTint }]}>
        <Icon name={icon} size={28} color={theme.brandTintInk} />
      </View>
      <View style={styles.texts}>
        <Text variant="title" style={styles.centeredText}>
          {title}
        </Text>
        <Text color="inkMuted" style={styles.centeredText}>
          {text}
        </Text>
      </View>
      <View style={styles.actions}>{action}</View>
    </Centered>
  );
}

function Centered({ children }: { children?: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        styles.centered,
        {
          backgroundColor: theme.surface,
          paddingTop: insets.top + Spacing.s6,
          paddingBottom: TabBarOverhang + Spacing.s6,
        },
      ]}>
      <View style={styles.centeredContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  centeredContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.s6,
  },
  centeredText: {
    textAlign: 'center',
  },
  texts: {
    gap: Spacing.s2,
  },
  actions: {
    gap: Spacing.s2,
  },
  noticeIcon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInput: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    height: 72,
    borderWidth: 1,
    borderRadius: Radius.md,
    textAlign: 'center',
    letterSpacing: 8,
  },
  marked: {
    gap: Spacing.s6,
  },
  markedIcon: {
    alignSelf: 'center',
  },
  markedLesson: {
    padding: Spacing.s4,
    gap: 2,
  },
  markedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  scannerTop: {
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
  },
  hint: {
    backgroundColor: SCRIM,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.s3,
    paddingVertical: 6,
  },
  frameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: overlay.ink,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: Radius.lg,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: Radius.lg,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: Radius.lg,
  },
  cornerBottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: Radius.lg,
  },
  scannerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    height: 48,
    paddingHorizontal: Spacing.s4,
    borderRadius: Radius.pill,
    backgroundColor: SCRIM,
  },
  torch: {
    width: 48,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
});
