
export default function SalonLogo({ size = 38 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="17" fill="#402440" />
      <path
        d="M25 20C20 16 12 19 12 25C12 32 26 29 26 37C26 45 16 47 11 41"
        stroke="#DBEDAB"
        strokeWidth="4.3"
        strokeLinecap="round"
      />
      <path
        d="M34 19V45H45C58 45 57 32 45 32H34H44C55 32 55 19 44 19H34Z"
        stroke="#FFFAF1"
        strokeWidth="4.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
