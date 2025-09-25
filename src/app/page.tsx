import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PageClient from '@/components/page-client';

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  // You can also get user metadata here if needed
  const user = data.claims.email;

  return <PageClient user={user} />;
}
