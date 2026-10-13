import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import {
  allGrades,
  earnedCredits,
  gpa,
  letterGrade,
  semesters,
  totalScore,
  type Grade,
} from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';
import { plural } from '@/lib/plural';

const credits = (count: number) => `${count} ${plural(count, ['кредит', 'кредита', 'кредитов'])}`;

export default function GradesScreen() {
  const theme = useTheme();
  const [semesterId, setSemesterId] = useState(semesters[0].id);
  const semester = semesters.find((item) => item.id === semesterId) ?? semesters[0];
  const overallGpa = gpa(allGrades);
  const semesterGpa = gpa(semester.grades);

  return (
    <Screen insideTabs={false} header={<Header title="Журнал" />}>
      <Card style={styles.summary}>
        <Text variant="caption" color="inkMuted">
          Средний балл за всё время
        </Text>
        <Text variant="display">{overallGpa?.toFixed(2) ?? '—'}</Text>
        <Text color="inkMuted">GPA из 4.0 · {credits(earnedCredits())}</Text>
      </Card>

      <View style={styles.chips} accessibilityRole="tablist">
        {semesters.map((item) => {
          const selected = item.id === semester.id;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setSemesterId(item.id)}
              style={[
                styles.chip,
                selected
                  ? { backgroundColor: theme.brandTint, borderColor: theme.brandTint }
                  : { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
              ]}>
              <Text variant="bodyStrong" color={selected ? 'brandTintInk' : 'ink'}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Section
        title={semester.title}
        action={
          <Text variant="caption" color="inkMuted">
            {semester.current || semesterGpa === null
              ? 'Семестр идёт'
              : `GPA ${semesterGpa.toFixed(2)}`}
          </Text>
        }>
        <View style={styles.subjects}>
          {semester.grades.map((grade) => (
            <SubjectCard key={grade.subject} grade={grade} />
          ))}
        </View>
      </Section>
    </Screen>
  );
}

function SubjectCard({ grade }: { grade: Grade }) {
  const total = totalScore(grade);
  const known = [grade.rk1, grade.rk2, grade.exam].filter((score) => score !== undefined);
  // Until the final score exists the bar shows the average of what is already graded.
  const progress =
    total ?? (known.length > 0 ? known.reduce((sum, score) => sum + score, 0) / known.length : 0);

  return (
    <Card style={styles.subject}>
      <View style={styles.subjectHeader}>
        <View style={styles.subjectTitle}>
          <Text variant="heading">{grade.subject}</Text>
          <Text variant="caption" color="inkMuted">
            {credits(grade.credits)} · {grade.teacher}
          </Text>
        </View>
        {total !== null ? <Badge>{letterGrade(total).letter}</Badge> : null}
      </View>
      <ProgressBar value={progress / 100} />
      <View style={styles.scores}>
        <Score label="РК1" value={grade.rk1} />
        <Score label="РК2" value={grade.rk2} />
        <Score label="Экзамен" value={grade.exam} />
        <Score label="Итог" value={total ?? undefined} />
      </View>
    </Card>
  );
}

function Score({ label, value }: { label: string; value?: number }) {
  return (
    <View style={styles.score}>
      <Text variant="caption" color="inkMuted">
        {label}
      </Text>
      <Text variant="bodyStrong" color={value === undefined ? 'inkMuted' : 'ink'}>
        {value ?? '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: Spacing.s1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  chip: {
    height: 40,
    paddingHorizontal: Spacing.s4,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  subjects: {
    gap: Spacing.s3,
  },
  subject: {
    gap: Spacing.s3,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s3,
  },
  subjectTitle: {
    flex: 1,
    gap: 2,
  },
  scores: {
    flexDirection: 'row',
  },
  score: {
    flex: 1,
    gap: 2,
  },
});
