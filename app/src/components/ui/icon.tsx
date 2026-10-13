import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

type PlatformSymbol = Exclude<SymbolViewProps['name'], string>;

/** SF Symbols on iOS, Material Symbols on Android and web. */
const ICONS = {
  home: { ios: 'house', android: 'home' },
  calendar: { ios: 'calendar', android: 'calendar_month' },
  document: { ios: 'doc.text', android: 'description' },
  transcript: { ios: 'graduationcap', android: 'school' },
  journal: { ios: 'book', android: 'menu_book' },
  calculator: { ios: 'plus.forwardslash.minus', android: 'calculate' },
  plus: { ios: 'plus', android: 'add' },
  minus: { ios: 'minus', android: 'remove' },
  qr: { ios: 'qrcode.viewfinder', android: 'qr_code_scanner' },
  chat: { ios: 'bubble.left.and.bubble.right', android: 'forum' },
  settings: { ios: 'gearshape', android: 'settings' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right' },
  back: { ios: 'chevron.left', android: 'arrow_back' },
  check: { ios: 'checkmark.circle.fill', android: 'check_circle' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning' },
  error: { ios: 'exclamationmark.circle.fill', android: 'error' },
  clock: { ios: 'clock', android: 'schedule' },
  search: { ios: 'magnifyingglass', android: 'search' },
  torchOn: { ios: 'flashlight.on.fill', android: 'flashlight_on' },
  torchOff: { ios: 'flashlight.off.fill', android: 'flashlight_off' },
  keyboard: { ios: 'keyboard', android: 'keyboard' },
  camera: { ios: 'camera', android: 'photo_camera' },
  send: { ios: 'arrow.up', android: 'arrow_upward' },
  close: { ios: 'xmark', android: 'close' },
  bell: { ios: 'bell', android: 'notifications' },
  globe: { ios: 'globe', android: 'language' },
  lock: { ios: 'lock', android: 'lock' },
  info: { ios: 'info.circle', android: 'info' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout' },
} as const satisfies Record<string, PlatformSymbol>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, color, size = 24, style }: IconProps) {
  const symbol = ICONS[name];

  return (
    <SymbolView
      name={{ ios: symbol.ios, android: symbol.android, web: symbol.android }}
      size={size}
      tintColor={color}
      style={style}
    />
  );
}
