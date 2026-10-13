import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/app/_layout';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
};

describe('ErrorBoundary', () => {
  it('explains the crash and retries on demand', async () => {
    const retry = jest.fn(() => Promise.resolve());
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <ErrorBoundary error={new Error('Сбой экрана')} retry={retry} />
      </SafeAreaProvider>
    );

    expect(screen.getByText('Что-то пошло не так')).toBeTruthy();
    // Development builds show the error itself instead of the generic advice.
    expect(screen.getByText('Сбой экрана')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Повторить' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
