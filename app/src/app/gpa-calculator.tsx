import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card, Divider } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { allGrades, gpa, letterGrade, semesters, totalScore } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { plural } from '@/lib/plural';

const STEP = 5;
const MIN_SCORE = 50;
const MAX_SCORE = 100;

const current = semesters.find((semester) => semester.current) ?? semesters[0];

/** Credits and grade points already fixed by finished subjects. */
const earned = allGrades.reduce(
  (sum, grade) => {
    const total = totalScore(grade);
    if (total === null) return sum;
    return {
      credits: sum.credits + grade.credits,
      points: sum.points + letterGrade(total).points * grade.credits,
    };
  },
  { credits: 0, points: 0 }
);

/** The forecast starts from the first midterm, rounded to the calculator's step. */
const initialScores = Object.fromEntries(
  current.grades.map((grade) => [
    grade.subject,
    Math.max(MIN_SCORE, Math.round((grade.rk1 ?? 75) / STEP) * STEP),
  ])
);

export default function GpaCalculatorScreen() {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);

  const semester = current.grades.reduce(
    (sum, grade) => ({
      credits: sum.credits + grade.credits,
      points: sum.points + letterGrade(scores[grade.subject]).points * grade.credits,
    }),
    { credits: 0, points: 0 }
  );
  const semesterGpa = semester.points / semester.credits;
  const forecast = (earned.points + semester.points) / (earned.credits + semester.credits);
  const currentGpa = gpa(allGrades);

  const change = (subject: string, delta: number) => {
    setScores((value) => ({
      ...value,
      [subject]: Math.max(MIN_SCORE, Math.min(MAX_SCORE, value[subject] + delta)),
    }));
  };

  return (
    <Screen insideTabs={false} header={<Header title="Калькулятор GPA" />}>
      <Card tone="tint" style={styles.forecast}>
        <Text variant="label" color="brandTintInk" style={styles.uppercase}>
          Прогноз GPA
        </Text>
        <Text variant="display">{forecast.toFixed(2)}</Text>
        <Text>
          Сейчас {currentGpa?.toFixed(2) ?? '—'} · за {current.title} {semesterGpa.toFixed(2)}
        </Text>
      </Card>

      <Section title="Ожидаемые итоговые баллы">
        <Card padded={false}>
          {current.grades.map((grade, index) => {
            const score = scores[grade.subject];
            return (
              <View key={grade.subject}>
                {index > 0 ? <Divider /> : null}
                <View style={styles.row}>
                  <View style={styles.rowBody}>
                    <Text numberOfLines={2}>{grade.subject}</Text>
                    <Text variant="caption" color="inkMuted">
                      {grade.credits} {plural(grade.credits, ['кредит', 'кредита', 'кредитов'])}
                    </Text>
                  </View>
                  <View style={styles.letter}>
                    <Badge>{letterGrade(score).letter}</Badge>
                  </View>
                  <View style={styles.stepper}>
                    <StepButton
                      icon="minus"
                      label={`Уменьшить балл: ${grade.subject}`}
                      disabled={score <= MIN_SCORE}
                      onPress={() => change(grade.subject, -STEP)}
                    />
                    <Text variant="bodyStrong" style={styles.score}>
                      {score}
                    </Text>
                    <StepButton
                      icon="plus"
                      label={`Увеличить балл: ${grade.subject}`}
                      disabled={score >= MAX_SCORE}
                      onPress={() => change(grade.subject, STEP)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      </Section>

      <Text variant="caption" color="inkMuted" style={styles.note}>
        Прогноз считается по кредитам: завершённые семестры плюс ожидаемые баллы текущего.
      </Text>
    </Screen>
  );
}

type StepButtonProps = {
  icon: IconName;
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function StepButton({ icon, label, disabled, onPress }: StepButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepButton,
        { backgroundColor: pressed ? theme.border : theme.surfaceSunken },
        disabled && styles.disabled,
      ]}>
      <Icon name={icon} size={18} color={theme.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  forecast: {
    gap: Spacing.s1,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  rowBody: {
    flex: 1,
  },
  letter: {
    width: 36,
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    width: 40,
    textAlign: 'center',
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  note: {
    textAlign: 'center',
  },
});
