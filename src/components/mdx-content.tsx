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
    const mod: unknown = new Function(code)({ ...runtime });
    const exported: unknown =
      typeof mod === "object" && mod !== null && "default" in mod ? mod.default : undefined;
    if (typeof exported !== "function") {
      throw new Error("Velite MDX code did not export a default component");
    }
    // The one permitted boundary cast (AGENTS.md): a compiled component's props
    // can't be checked at runtime, only that it is a function.
    component = exported as MDXComponent;
    componentCache.set(code, component);
  }
  return component;
}

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  const Component = getMDXComponent(code);
  // eslint-disable-next-line react-hooks/static-components -- cached above; build-time RSC, never re-renders client-side
  return <Component components={components} />;
}
