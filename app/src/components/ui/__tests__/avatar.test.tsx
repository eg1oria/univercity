import { render, screen } from '@testing-library/react-native';

import { Avatar } from '@/components/ui/avatar';

describe('Avatar', () => {
  it.each([
    ['Иванова А. С.', 'ИА'],
    ['Айгерим Сейткали', 'АС'],
    ['Деканат', 'ДЕ'],
    // Digits are not initials: the group «ИС-23-1» is a single word.
    ['ИС-23-1', 'ИС'],
  ])('shows the initials of «%s»', async (name, initials) => {
    await render(<Avatar name={name} />);
    expect(screen.getByText(initials)).toBeTruthy();
  });
});
