import { createServerSupabaseClient } from '../../../lib/supabase-server';
import { redirect } from 'next/navigation';
import { getUserSettings } from '../../../lib/actions';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const settings = await getUserSettings(user.id);

  return (
    <SettingsClient
      user={user}
      settings={settings}
    />
  );
}
