'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function Handler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      router.replace(`/auth/callback?code=${code}`);
    }
  }, [searchParams, router]);

  return null;
}

export default function OAuthCallbackHandler() {
  return (
    <Suspense fallback={null}>
      <Handler />
    </Suspense>
  );
}
