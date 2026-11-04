import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

/**
 * Custom hand-crafted SVG icon suite inspired by USTC LUG duotone icons.
 * Uses a primary layer + subtle secondary layer (`opacity="0.38"`) so icons
 * adapt seamlessly to both light text (over splash hero) and dark/colored text.
 */

export function SvgLoginIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />
      <path
        d="M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgUserIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M4 20c0-3.6 3.5-6.5 8-6.5s8 2.9 8 6.5"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M4 20c0-3.6 3.5-6.5 8-6.5s8 2.9 8 6.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="currentColor"
        opacity="0.22"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </svg>
  )
}

export function SvgWikiStarIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M2.5 19.5L8.5 14M2.5 14.5L6.5 11M6.5 20.5L10.5 17"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M14.8 3.2l1.65 3.45 3.8.52-2.76 2.66.66 3.78-3.35-1.8-3.35 1.8.66-3.78-2.76-2.66 3.8-.52L14.8 3.2z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgNewsIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="3"
        y="4"
        width="15"
        height="16"
        rx="2"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M18 8h2a1.5 1.5 0 0 1 1.5 1.5v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v12"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="6.5" y="7.5" width="4.5" height="4" rx="0.8" fill="currentColor" />
      <path
        d="M13 8.5h2.5M13 11h2.5M6.5 14.5h9M6.5 17h6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SvgGithubIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.475 2 2 6.588 2 12.253c0 4.53 2.862 8.371 6.838 9.727.5.094.687-.222.687-.493 0-.243-.009-.888-.014-1.744-2.782.618-3.369-1.373-3.369-1.373-.454-1.183-1.11-1.498-1.11-1.498-.907-.636.069-.623.069-.623 1.003.072 1.531 1.056 1.531 1.056.892 1.566 2.341 1.114 2.91.852.091-.663.349-1.114.635-1.37-2.22-.259-4.555-1.138-4.555-5.066 0-1.119.39-2.034 1.029-2.751-.103-.259-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.051A9.38 9.38 0 0 1 12 6.844c.85.004 1.705.118 2.504.345 1.909-1.327 2.747-1.051 2.747-1.051.546 1.412.203 2.455.1 2.714.64.717 1.028 1.632 1.028 2.751 0 3.938-2.339 4.804-4.566 5.058.359.317.678.942.678 1.898 0 1.37-.012 2.475-.012 2.811 0 .274.184.592.692.492C19.14 20.62 22 16.78 22 12.253 22 6.588 17.523 2 12 2z"
      />
    </svg>
  )
}

export function SvgOjServerIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="3"
        y="3.5"
        width="18"
        height="5"
        rx="1.5"
        fill="currentColor"
        opacity="0.28"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="3"
        y="9.5"
        width="18"
        height="5"
        rx="1.5"
        fill="currentColor"
        opacity="0.16"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="3"
        y="15.5"
        width="18"
        height="5"
        rx="1.5"
        fill="currentColor"
        opacity="0.28"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6.5" cy="6" r="1" fill="currentColor" />
      <circle cx="6.5" cy="12" r="1" fill="currentColor" />
      <circle cx="6.5" cy="18" r="1" fill="currentColor" />
      <path
        d="M15 6h2.5M15 12h2.5M15 18h2.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SvgSurveyIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="5"
        y="4.5"
        width="14"
        height="16.5"
        rx="2"
        fill="currentColor"
        opacity="0.22"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4.5v1H9v-1z"
        fill="currentColor"
      />
      <path
        d="M8.5 10.5l1.5 1.5 3-3M8.5 15.5h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgTerminalTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="2.5"
        y="4"
        width="19"
        height="16"
        rx="2.5"
        fill="currentColor"
        opacity="0.22"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.8 9.2L10.3 12l-3.5 2.8M11.8 15h4.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgTagsTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M3.5 11.2V5.5a2 2 0 0 1 2-2h5.7a2 2 0 0 1 1.4.58l7.32 7.32a2 2 0 0 1 0 2.83l-5.7 5.7a2 2 0 0 1-2.82 0l-7.32-7.32a2 2 0 0 1-.58-1.41z"
        fill="currentColor"
        opacity="0.24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <path
        d="M12.5 10.5l3.5 3.5M10 13l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SvgBookTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M12 6.2C10.2 4.9 7.5 4.5 4.5 5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19c3-.5 5.7-.1 7.5 1.2m0-14c1.8-1.3 4.5-1.7 7.5-1.2A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5c-3-.5-5.7-.1-7.5 1.2m0-14v14"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgTrophyTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M7 4h10v5a5 5 0 0 1-10 0V4z"
        fill="currentColor"
        opacity="0.24"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M7 6H4.5A1.5 1.5 0 0 0 3 7.5v1A3.5 3.5 0 0 0 6.5 12H7m10-6h2.5A1.5 1.5 0 0 1 21 7.5v1a3.5 3.5 0 0 1-3.5 3.5H17M12 14v4m-4 2h8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgCalendarTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 9.5h17M8 3.5v3M16 3.5v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="8.5" cy="17" r="1.1" fill="currentColor" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function SvgCommentsTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.2A.5.5 0 0 1 5 18.8V16h-.5A2.5 2.5 0 0 1 2 13.5v-5"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.2A.5.5 0 0 1 5 18.8V16A2.5 2.5 0 0 1 4 14V6.5A2.5 2.5 0 0 1 6.5 4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5h8M8 11.5h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SvgClipboardTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="5"
        y="4.5"
        width="14"
        height="16"
        rx="2"
        fill="currentColor"
        opacity="0.22"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M9 4.5h6v2H9v-2zM8.5 11l1.8 1.8 3.7-3.6M8.5 16h7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgLinksTileIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M10 13a4.5 4.5 0 0 0 6.36 0l2.83-2.83a4.5 4.5 0 0 0-6.36-6.36L11.2 5.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M14 11a4.5 4.5 0 0 0-6.36 0l-2.83 2.83a4.5 4.5 0 0 0 6.36 6.36l1.63-1.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  )
}

export function SvgWeatherSunCloudIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <circle cx="9" cy="9" r="3.5" fill="currentColor" opacity="0.45" />
      <path
        d="M9 3v1.5M3 9h1.5M4.8 4.8l1.1 1.1M13.2 4.8l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M8.5 18.5h8.2a3.8 3.8 0 0 0 .4-7.58A5 5 0 0 0 7.3 9.8a3.8 3.8 0 0 0 1.2 8.7z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgTocDocIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M6 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5z"
        fill="currentColor"
        opacity="0.24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5V8h4M8.5 11.5h7M8.5 15h7M8.5 18h4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SvgFolderPageIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SvgDocItemIcon({ className = '', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <rect
        x="5"
        y="3.5"
        width="14"
        height="17"
        rx="2"
        fill="currentColor"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
