"use client";

import { useEffect, useState } from "react";

export function useMountEffect(callback: () => void) {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    if (!isMount) {
      callback();
      setIsMount(true);
    }
  }, []);
}
