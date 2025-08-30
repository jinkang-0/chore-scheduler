"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPeoplePoolOptions } from "@/data/dropdown";

type PeoplePoolOptions = Awaited<ReturnType<typeof getPeoplePoolOptions>>;

export const usePeoplePoolOptions = () => {
  const [peoplePoolOptions, setPeoplePoolOptions] =
    useState<PeoplePoolOptions | null>(null);
  const peoplePoolLoading = useRef<boolean>(false);
  const peoplePoolResolvers = useRef<((data: PeoplePoolOptions) => void)[]>([]);

  useEffect(() => {
    if (peoplePoolLoading.current) return;

    peoplePoolLoading.current = true;

    const loadPeoplePoolOptions = async () => {
      const result = await getPeoplePoolOptions();
      peoplePoolResolvers.current.forEach((resolve) => {
        resolve(result);
      });
      setPeoplePoolOptions(result);
    };

    loadPeoplePoolOptions();
  }, []);

  const peoplePoolMap = useMemo(() => {
    const parseMap = <
      V extends string,
      L extends string,
      T extends { value: V; label: L }
    >(
      options: T[]
    ) => {
      return options.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {} as Record<V, L>);
    };

    return peoplePoolOptions ? parseMap(peoplePoolOptions) : {};
  }, [peoplePoolOptions]);

  const loadOptions = useCallback(async () => {
    if (peoplePoolOptions) return peoplePoolOptions;

    return new Promise((resolve: (data: PeoplePoolOptions) => void) => {
      peoplePoolResolvers.current.push(resolve);
    });
  }, [peoplePoolOptions]);

  return { loadOptions, peoplePoolMap, peoplePoolOptions };
};
