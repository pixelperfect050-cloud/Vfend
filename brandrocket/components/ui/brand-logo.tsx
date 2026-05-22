import * as React from "react"

export function BrandLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6 4C6 2.89543 6.89543 2 8 2H14.5C17.5376 2 20 4.46243 20 7.5C20 10.5376 17.5376 13 14.5 13H6V4Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M6 11C6 9.89543 6.89543 9 8 9H15.5C18.5376 9 21 11.4624 21 14.5C21 17.5376 18.5376 20 15.5 20H8C6.89543 20 6 19.1046 6 18V11Z"
        fill="currentColor"
      />
      <rect x="2" y="2" width="3" height="18" rx="1.5" fill="currentColor" />
    </svg>
  )
}
