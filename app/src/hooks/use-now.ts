import { useEffect, useState } from 'react';

/** Current time, refreshed twice a minute so «Сейчас» and countdowns stay correct. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return now;
}
