import { useRouter } from 'expo-router';
import { Compass } from '@/components/icons';

import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/hooks/useI18n';

export default function NotFound() {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <Screen edges={['top', 'bottom']}>
      <BackHeader />
      <EmptyState
        icon={Compass}
        title={t.notFound.title}
        body={t.notFound.body}
        action={<Button label={t.notFound.goHome} variant="secondary" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
