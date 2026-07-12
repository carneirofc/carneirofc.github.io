import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;
type MDXComponent = ComponentType<{ components?: MDXComponents }>;

// Velite compiles MDX to a function-body string; evaluating it with the JSX
// runtime yields the component. This is a server component evaluated at build
// time (static export), and the cache keeps the component identity stable.
const componentCache = new Map<string, MDXComponent>();

function getMDXComponent(code: string): MDXComponent {
  let component = componentCache.get(code);
  if (!component) {
    const fn = new Function(code);
    component = fn({ ...runtime }).default as MDXComponent;
    componentCache.set(code, component);
  }
  return component;
}

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  const Component = getMDXComponent(code);
  // eslint-disable-next-line react-hooks/static-components -- cached above; build-time RSC, never re-renders client-side
  return <Component components={components} />;
}
