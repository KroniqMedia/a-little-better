import { Tabs } from 'expo-router';
import { Bookmark, Compass, House } from '@/components/icons';

import { fonts } from '@/constants/theme';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.2 },
        // Height and bottom inset are left to React Navigation, which already
        // accounts for the home indicator / gesture bar on each platform.
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          elevation: 0,
        },
        sceneStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <House size={size - 2} color={color} strokeWidth={1.6} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t.tabs.explore,
          tabBarIcon: ({ color, size }) => <Compass size={size - 2} color={color} strokeWidth={1.6} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t.tabs.saved,
          tabBarIcon: ({ color, size }) => <Bookmark size={size - 2} color={color} strokeWidth={1.6} />,
        }}
      />
    </Tabs>
  );
}
