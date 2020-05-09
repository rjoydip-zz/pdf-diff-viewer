import { useEffect, useRef, DependencyList } from "react";

type ActionCallback = (
  arg: string | number | object[]
) => void | (() => void | undefined);

export default function useAction(
  action: ActionCallback,
  deps: DependencyList = []
) {
  const { current: data } = useRef<{
    deps: DependencyList | undefined;
    action: ReturnType<any> | undefined;
  }>({
    deps: undefined,
    action: undefined
  });

  data.action = action;
  data.deps = deps
    .reduce((acc, curr) => {
      acc.push(typeof curr === "function" ? curr() : curr);
      return acc;
    }, [])
    .filter((n: any) => !!n);

  useEffect(
    () => () => {
      data.action(data.deps);
    },
    [data]
  );
}
