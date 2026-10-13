import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card, Divider } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import {
  allGrades,
  earnedCredits,
  gpa,
  letterGrade,
  semesters,
  student,
  totalScore,
} from '@/data/mock';
import { plural } from '@/lib/plural';

const credits = (count: number) => `${count} ${plural(count, ['кредит', 'кредита', 'кредитов'])}`;

export default function TranscriptScreen() {
  const overallGpa = gpa(allGrades);
  // A transcript lists only the semesters that already have final scores.
  const finished = semesters.filter((semester) => gpa(semester.grades) !== null).reverse();

  return (
    <Screen insideTabs={false} header={<Header title="Транскрипт" />}>
      <Card padded={false}>
        <View style={styles.student}>
          <Text variant="heading">{student.fullName}</Text>
          <Text color="inkMuted">
            {student.specialty} · {student.group} · ID {student.id}
          </Text>
        </View>
        <Divider />
        <View style={styles.totals}>
          <View style={styles.total}>
            <Text variant="caption" color="inkMuted">
              GPA
            </Text>
            <Text variant="title">{overallGpa?.toFixed(2) ?? '—'}</Text>
          </View>
          <View style={styles.total}>
            <Text variant="caption" color="inkMuted">
              Освоено
            </Text>
            <Text variant="title">{credits(earnedCredits())}</Text>
          </View>
        </View>
      </Card>

      {finished.map((semester) => (
        <Section
          key={semester.id}
          title={semester.title}
          action={
            <Text variant="caption" color="inkMuted">
              GPA {gpa(semester.grades)?.toFixed(2)}
            </Text>
          }>
          <Card padded={false}>
            {semester.grades.map((grade, index) => {
              const total = totalScore(grade);
              if (total === null) return null;
              return (
                <View key={grade.subject}>
                  {index > 0 ? <Divider /> : null}
                  <View style={styles.row}>
                    <View style={styles.rowBody}>
                      <Text>{grade.subject}</Text>
                      <Text variant="caption" color="inkMuted">
                        {credits(grade.credits)}
                      </Text>
                    </View>
                    <Text variant="bodyStrong">{total}</Text>
                    <View style={styles.letter}>
                      <Badge>{letterGrade(total).letter}</Badge>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        </Section>
      ))}

      <Text variant="caption" color="inkMuted" style={styles.note}>
        Текущий семестр появится в транскрипте после экзаменов.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  student: {
    padding: Spacing.s4,
    gap: 2,
  },
  totals: {
    flexDirection: 'row',
    padding: Spacing.s4,
  },
  total: {
    flex: 1,
    gap: 2,
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
  },
  letter: {
    width: 36,
    alignItems: 'flex-end',
  },
  note: {
    textAlign: 'center',
  },
});
