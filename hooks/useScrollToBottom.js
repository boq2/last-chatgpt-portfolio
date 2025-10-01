import { useEffect, useRef } from 'react';

export const useScrollToBottom = (dependencies = []) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, dependencies);

  return ref;
};