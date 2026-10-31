/** Bron van het app-icoon: Wortel als vriendelijk gezichtje op crème. */
export function iconSvg({ maskable }: { maskable: boolean }): string {
  // Bij een maskable icoon moet alles binnen de veilige cirkel (80%) vallen.
  const scale = maskable ? 0.72 : 0.9;
  const t = (1 - scale) * 256;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="${maskable ? 0 : 112}" fill="#FBF7F0"/>
  <g transform="translate(${t} ${t}) scale(${scale})">
    <ellipse cx="256" cy="452" rx="120" ry="18" fill="#E5DAC6"/>
    <g fill="#5E9E5A">
      <path d="M256 150 C 226 100, 214 62, 238 38 C 262 60, 268 104, 256 150 Z"/>
      <path d="M250 152 C 196 126, 164 96, 170 64 C 210 70, 238 108, 250 152 Z"/>
      <path d="M262 152 C 316 126, 348 96, 342 64 C 302 70, 274 108, 262 152 Z"/>
    </g>
    <path d="M150 178 C 150 140, 362 140, 362 178 C 362 270, 300 380, 268 430 C 262 440, 250 440, 244 430 C 212 380, 150 270, 150 178 Z" fill="#F08A3C"/>
    <path d="M330 168 C 352 190, 340 260, 300 330" stroke="#D9712A" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M200 300 L 228 304 M 286 352 L 310 348" stroke="#D9712A" stroke-width="9" stroke-linecap="round"/>
    <circle cx="214" cy="204" r="22" fill="#2B2722"/>
    <circle cx="298" cy="204" r="22" fill="#2B2722"/>
    <circle cx="221" cy="196" r="7" fill="#FFFFFF"/>
    <circle cx="305" cy="196" r="7" fill="#FFFFFF"/>
    <ellipse cx="190" cy="246" rx="18" ry="11" fill="#F4A3A0" opacity="0.8"/>
    <ellipse cx="322" cy="246" rx="18" ry="11" fill="#F4A3A0" opacity="0.8"/>
    <path d="M226 246 Q 256 278 286 246" stroke="#2B2722" stroke-width="10" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;
}
