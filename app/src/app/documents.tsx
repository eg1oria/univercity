import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Status } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, Divider } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Screen, Section } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { initialDocuments, type StudentDocument } from '@/data/mock';
import { formatDay } from '@/lib/date';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState(initialDocuments);

  const requestCertificate = () => {
    const request: StudentDocument = {
      id: `request-${documents.length + 1}`,
      title: 'Справка с места учёбы',
      note: 'По месту требования',
      // «Пн, 14 окт» → «14 окт»
      date: formatDay(new Date()).split(', ')[1],
      status: 'pending',
    };
    setDocuments((current) => [request, ...current]);
  };

  return (
    <Screen insideTabs={false} header={<Header title="Документы" />}>
      <Card style={styles.request}>
        <View style={styles.requestText}>
          <Text variant="heading">Справка с места учёбы</Text>
          <Text color="inkMuted">
            Готовится один рабочий день. Электронная версия появится в этом списке.
          </Text>
        </View>
        <Button title="Заказать справку" onPress={requestCertificate} />
      </Card>

      <Section title="Мои документы">
        <Card padded={false}>
          {documents.map((document, index) => (
            <View key={document.id}>
              {index > 0 ? <Divider /> : null}
              <View style={styles.row}>
                <View style={styles.rowBody}>
                  <Text variant="bodyStrong">{document.title}</Text>
                  <Text variant="caption" color="inkMuted">
                    {document.note} · {document.date.replace(' ', ' ')}
                  </Text>
                </View>
                {document.status === 'ready' ? (
                  <Status tone="success">Готово</Status>
                ) : (
                  <Status tone="warning">На рассмотрении</Status>
                )}
              </View>
            </View>
          ))}
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  request: {
    gap: Spacing.s4,
  },
  requestText: {
    gap: Spacing.s1,
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
});
