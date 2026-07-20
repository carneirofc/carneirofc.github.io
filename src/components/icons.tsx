import type { SVGAttributes } from "react";

const BASE_ICON_CLASS = "shrink-0 fill-none stroke-current";

function Icon({ path, className, ...props }: SVGAttributes<SVGSVGElement> & { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${BASE_ICON_CLASS} ${className ?? ""}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={path} />
    </svg>
  );
}

export function ChevronLeftIcon(props: SVGAttributes<SVGSVGElement>) {
  return <Icon path="M15 18l-6-6 6-6" {...props} />;
}

export function ChevronRightIcon(props: SVGAttributes<SVGSVGElement>) {
  return <Icon path="M9 18l6-6-6-6" {...props} />;
}
