import { useLocalSearchParams, useRouter } from 'expo-router';

import { Compass } from '@/components/icons';
import { MomentScreen } from '@/components/moment/MomentScreen';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { isCategoryId } from '@/data/categories';
import { isNeedId } from '@/data/needs';
import { useI18n } from '@/hooks/useI18n';

/** A collection, optionally reached from a feeling and/or a need. */
export default function CategoryScreen() {
  const { id, mood, need } = useLocalSearchParams<{ id: string; mood?: string; need?: string }>();
  const router = useRouter();
  const { t } = useI18n();

  if (!id || !isCategoryId(id)) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackHeader />
        <EmptyState
          icon={Compass}
          title={t.category.notFoundTitle}
          body={t.category.notFoundBody}
          action={<Button label={t.category.backToExplore} variant="secondary" onPress={() => router.replace('/explore')} />}
        />
      </Screen>
    );
  }

  // Keyed so a new collection or need starts a fresh moment.
  return <MomentScreen key={`${id}:${need ?? ''}`} categoryId={id} moodId={mood} initialNeed={isNeedId(need) ? need : undefined} />;
}
