/* ===================================================================
   FooterBotanical – dense, lush botanical garden SVG
   Inspired by the reference image: thick lilies, layered roses,
   packed foliage, organic asymmetry, rich depth.
   =================================================================== */

/* ---------- tiny sub-components for each botanical element ---------- */

function Leaf({
  d,
  fill,
  stroke = '#4a6e42',
  className = '',
}: {
  d: string
  fill: string
  stroke?: string
  className?: string
}) {
  return (
    <g className={`botanical-leaf ${className}`}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth=".9" />
    </g>
  )
}

function RoundLeaf({
  x,
  y,
  scale = 1,
  rotate = 0,
  fill = '#5a7d4e',
  className = '',
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  fill?: string
  className?: string
}) {
  return (
    <g
      className={`botanical-leaf ${className}`}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    >
      <path
        d="M0 0C-8-3-14-12-12-22C-10-30-2-34 4-30C10-26 14-16 10-6C7 1 2 2 0 0Z"
        fill={fill}
        stroke="#3d5e36"
        strokeWidth=".8"
      />
      <path d="M0 0C-2-8-4-18-3-28" fill="none" stroke="#6b9460" strokeWidth=".6" opacity=".6" />
    </g>
  )
}

function Lily({
  x,
  y,
  scale = 1,
  rotate = 0,
  tone = '#c9aede',
  inner = '#e5d4f0',
  className = '',
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  tone?: string
  inner?: string
  className?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className={`botanical-blossom ${className}`}>
        {/* Six thick, curved petals like the reference lilies */}
        <path
          d="M0-2C-6-8-18-20-22-30C-24-38-16-42-8-36C-2-32 0-20 0-2Z"
          fill={tone}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        <path
          d="M0-2C6-10 14-24 12-36C10-44 2-44-4-38C-8-32-4-18 0-2Z"
          fill={inner}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        <path
          d="M0-2C-10-4-24-8-32-4C-38 0-34 8-26 10C-18 12-8 6 0-2Z"
          fill={tone}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        <path
          d="M0-2C10-6 26-12 34-6C40 0 34 10 24 12C16 13 6 6 0-2Z"
          fill={inner}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        <path
          d="M0-2C-8 6-16 18-12 28C-8 36 0 38 6 32C10 26 6 12 0-2Z"
          fill={tone}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        <path
          d="M0-2C8 4 20 14 22 26C24 34 16 38 10 32C4 26 2 10 0-2Z"
          fill={inner}
          stroke="#a88ec0"
          strokeWidth="1"
        />
        {/* Petal veins */}
        <path
          d="M0-2C-4-12-10-24-14-32M0-2C4-14 8-26 8-34M0-2C-12-2-22-4-28 0M0-2C14-4 24-6 30 0M0-2C-6 8-10 18-8 26M0-2C6 6 14 16 16 24"
          fill="none"
          stroke="#d4c0e8"
          strokeWidth=".5"
          opacity=".5"
        />
        {/* Center with stamens */}
        <circle r="5" fill="#e8c84d" />
        <circle r="2.5" fill="#f0d86a" />
        <path
          d="M0 0L-3-7M0 0L3-6M0 0L-6 2M0 0L6 1M0 0L-2 6M0 0L3 5"
          stroke="#d4a830"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="-3" cy="-7" r="1.3" fill="#c47a20" />
        <circle cx="3" cy="-6" r="1.2" fill="#c47a20" />
        <circle cx="-6" cy="2" r="1.1" fill="#c47a20" />
        <circle cx="6" cy="1" r="1.3" fill="#c47a20" />
        <circle cx="-2" cy="6" r="1.0" fill="#c47a20" />
        <circle cx="3" cy="5" r="1.2" fill="#c47a20" />
      </g>
    </g>
  )
}

function Rose({
  x,
  y,
  scale = 1,
  rotate = 0,
  tone = '#d4734e',
  highlight = '#e8a070',
  className = '',
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  tone?: string
  highlight?: string
  className?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className={`botanical-blossom ${className}`}>
        {/* Outer petals – thick, rounded like reference roses */}
        <path
          d="M0 4C-10 10-22 8-26 0C-28-6-22-14-14-16C-6-17 0-10 0 4Z"
          fill={tone}
          stroke="#a05838"
          strokeWidth="1"
        />
        <path
          d="M0 4C10 12 24 10 28 2C30-4 24-14 14-16C6-18-2-8 0 4Z"
          fill={tone}
          stroke="#a05838"
          strokeWidth="1"
        />
        <path
          d="M0 4C-4 14-2 24 6 28C12 30 20 24 20 16C18 8 8 2 0 4Z"
          fill={highlight}
          stroke="#a05838"
          strokeWidth="1"
        />
        <path
          d="M0 4C4 16 0 26-8 28C-14 30-22 22-20 14C-18 6-6 2 0 4Z"
          fill={highlight}
          stroke="#a05838"
          strokeWidth="1"
        />
        {/* Middle petals */}
        <path
          d="M0 2C-6 0-14-4-14-10C-14-16-8-18-2-14C4-10 4-2 0 2Z"
          fill={highlight}
          stroke="#b5624a"
          strokeWidth=".8"
        />
        <path
          d="M0 2C6 0 14-2 16-8C18-14 10-18 4-14C-2-10-2-2 0 2Z"
          fill={tone}
          stroke="#b5624a"
          strokeWidth=".8"
        />
        <path
          d="M0 2C-2 8-8 12-4 16C0 20 6 16 6 10C6 6 2 2 0 2Z"
          fill={highlight}
          stroke="#b5624a"
          strokeWidth=".8"
        />
        {/* Center spiral */}
        <path
          d="M0 0C-2-2-4-1-4 1C-4 3-2 4 0 4C3 4 5 2 5 0C5-3 2-5 0-5"
          fill="none"
          stroke={tone}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle r="2.5" fill={tone} />
        {/* Sepals peeking from bottom */}
        <path
          d="M-8 18C-10 24-6 28-2 24M8 18C10 24 6 28 2 24M0 20C0 26-2 28 0 30"
          fill="none"
          stroke="#5a7e4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

function Rosebud({
  x,
  y,
  scale = 1,
  rotate = 0,
  tone = '#d4734e',
  className = '',
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  tone?: string
  className?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className={`botanical-bud ${className}`}>
        <path
          d="M0 0C-4-4-6-12-4-18C-2-22 2-22 4-18C6-12 4-4 0 0Z"
          fill={tone}
          stroke="#a05838"
          strokeWidth=".8"
        />
        <path
          d="M-2-8C-6-10-8-16-4-20M2-8C6-10 8-16 4-20"
          fill="none"
          stroke="#5a7e4a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M0 0Q-1 8-2 20" fill="none" stroke="#5a7e4a" strokeWidth="1.4" />
      </g>
    </g>
  )
}

function SmallFlower({
  x,
  y,
  scale = 1,
  tone = '#f0e6d6',
  petals = 5,
  className = '',
}: {
  x: number
  y: number
  scale?: number
  tone?: string
  petals?: number
  className?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={`botanical-blossom ${className}`}>
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-6"
            rx="3.5"
            ry="6.5"
            fill={tone}
            stroke="#c8b8a0"
            strokeWidth=".5"
            transform={`rotate(${i * (360 / petals)})`}
          />
        ))}
        <circle r="3" fill="#e0c060" />
        <circle r="1.5" fill="#ecd880" />
      </g>
    </g>
  )
}

function Lavender({
  x,
  y,
  scale = 1,
  rotate = 0,
  className = '',
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  className?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className={`botanical-bud ${className}`}>
        <path
          d="M0 30Q-1 14 1-6"
          fill="none"
          stroke="#6b8a56"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <ellipse cx="-3" cy="2" rx="3" ry="4.5" fill="#b89dd4" />
        <ellipse cx="3" cy="-4" rx="3" ry="4.5" fill="#c4a8d8" />
        <ellipse cx="-2" cy="-10" rx="3" ry="4.5" fill="#b89dd4" />
        <ellipse cx="3" cy="-16" rx="2.8" ry="4" fill="#c4a8d8" />
        <ellipse cx="-1" cy="-22" rx="2.5" ry="3.5" fill="#d0bce0" />
        <ellipse cx="1" cy="-27" rx="2" ry="3" fill="#d8c8e8" />
      </g>
    </g>
  )
}

function FallingPetal({
  d,
  fill,
  className,
}: {
  d: string
  fill: string
  className: string
}) {
  return (
    <g className={`botanical-falling-petal ${className}`}>
      <path d={d} fill={fill} opacity=".7" />
    </g>
  )
}

/* ===================================================================
   MAIN BOTANICAL SVG
   =================================================================== */

export default function FooterBotanical() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1000 520"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stem-g" x1="0" y1="0" x2=".4" y2="1">
          <stop stopColor="#8aa06a" />
          <stop offset="1" stopColor="#3e5c38" />
        </linearGradient>
      </defs>

      {/* ============================================================
          LAYER 0 – background: thin stems, tiny leaves, subtle depth
          ============================================================ */}
      <g opacity=".55">
        {/* Fine background stems */}
        <g stroke="#6b8a56" strokeWidth="1.2" strokeLinecap="round" fill="none">
          <path className="botanical-stem" d="M60 518C50 460 30 400 45 340C55 290 40 250 20 200" />
          <path className="botanical-stem botanical-delay-one" d="M120 518C100 450 85 390 95 330C105 280 85 230 60 180" />
          <path className="botanical-stem botanical-delay-two" d="M200 518C180 460 170 400 190 340C200 290 175 240 140 190" />
          <path className="botanical-stem botanical-delay-three" d="M280 518C265 470 250 420 260 370C270 320 245 280 210 240" />
          <path className="botanical-stem botanical-delay-two" d="M350 518C340 470 320 420 335 370C345 330 325 290 290 260" />

          <path className="botanical-stem botanical-delay-one" d="M940 518C950 460 970 400 955 340C945 290 960 250 980 200" />
          <path className="botanical-stem botanical-delay-three" d="M880 518C900 450 910 390 900 330C890 280 910 230 940 180" />
          <path className="botanical-stem botanical-delay-two" d="M800 518C820 460 830 400 810 340C800 290 825 240 860 190" />
          <path className="botanical-stem" d="M720 518C735 470 750 420 740 370C730 320 755 280 790 240" />
          <path className="botanical-stem botanical-delay-one" d="M650 518C660 470 680 420 665 370C655 330 675 290 710 260" />

          {/* Central background stems */}
          <path className="botanical-stem botanical-delay-two" d="M420 518C410 475 400 430 415 385C425 350 405 310 380 280" />
          <path className="botanical-stem botanical-delay-three" d="M500 518C500 470 495 420 505 375C510 340 500 300 485 270" />
          <path className="botanical-stem botanical-delay-one" d="M580 518C590 475 600 430 585 385C575 350 595 310 620 280" />
        </g>

        {/* Tiny background leaves */}
        <RoundLeaf x={30} y={240} scale={0.5} rotate={-15} fill="#4a6840" className="botanical-delay-one" />
        <RoundLeaf x={75} y={210} scale={0.45} rotate={20} fill="#506a44" className="botanical-delay-two" />
        <RoundLeaf x={150} y={220} scale={0.5} rotate={-25} fill="#4a6840" className="botanical-delay-three" />
        <RoundLeaf x={220} y={270} scale={0.4} rotate={15} fill="#5a7850" className="botanical-delay-one" />
        <RoundLeaf x={960} y={230} scale={0.5} rotate={15} fill="#4a6840" className="botanical-delay-two" />
        <RoundLeaf x={920} y={210} scale={0.45} rotate={-20} fill="#506a44" className="botanical-delay-one" />
        <RoundLeaf x={840} y={225} scale={0.5} rotate={25} fill="#4a6840" className="botanical-delay-three" />
        <RoundLeaf x={770} y={268} scale={0.4} rotate={-15} fill="#5a7850" className="botanical-delay-two" />

        {/* Tiny background flowers */}
        <SmallFlower x={55} y={235} scale={0.35} tone="#e8dce8" petals={5} className="botanical-delay-two" />
        <SmallFlower x={160} y={215} scale={0.3} tone="#f0e8d4" petals={5} className="botanical-delay-one" />
        <SmallFlower x={270} y={290} scale={0.3} tone="#ddd0e8" petals={6} className="botanical-delay-three" />
        <SmallFlower x={935} y={228} scale={0.35} tone="#e8dce8" petals={5} className="botanical-delay-one" />
        <SmallFlower x={830} y={218} scale={0.3} tone="#f0e8d4" petals={5} className="botanical-delay-two" />
        <SmallFlower x={730} y={285} scale={0.3} tone="#ddd0e8" petals={6} className="botanical-delay-three" />
      </g>

      {/* ============================================================
          LAYER 1 – main stems (thicker, structural)
          ============================================================ */}
      <g stroke="url(#stem-g)" strokeWidth="2.4" strokeLinecap="round" fill="none">
        {/* Left cluster stems */}
        <path className="botanical-stem" d="M20 518C30 440 15 370 40 300C55 260 35 210 10 160" />
        <path className="botanical-stem botanical-delay-one" d="M80 518C60 430 55 360 75 290C90 240 65 190 40 140" />
        <path className="botanical-stem botanical-delay-two" d="M160 518C140 440 125 370 145 300C160 250 135 200 100 155" />
        <path className="botanical-stem botanical-delay-three" d="M240 518C225 450 210 390 225 330C240 280 215 230 180 190" />
        <path className="botanical-stem botanical-delay-one" d="M320 518C305 460 290 400 305 350C320 310 295 270 260 240" />
        <path className="botanical-stem botanical-delay-two" d="M380 518C370 470 355 420 370 375C380 340 360 305 335 275" />

        {/* Right cluster stems */}
        <path className="botanical-stem botanical-delay-one" d="M980 518C970 440 985 370 960 300C945 260 965 210 990 160" />
        <path className="botanical-stem botanical-delay-two" d="M920 518C940 430 945 360 925 290C910 240 935 190 960 140" />
        <path className="botanical-stem botanical-delay-three" d="M840 518C860 440 875 370 855 300C840 250 865 200 900 155" />
        <path className="botanical-stem" d="M760 518C775 450 790 390 775 330C760 280 785 230 820 190" />
        <path className="botanical-stem botanical-delay-two" d="M680 518C695 460 710 400 695 350C680 310 705 270 740 240" />
        <path className="botanical-stem botanical-delay-one" d="M620 518C630 470 645 420 630 375C620 340 640 305 665 275" />

        {/* Crossing center stems */}
        <path className="botanical-stem botanical-delay-three" d="M440 518C430 465 425 415 440 370C450 340 435 305 410 278" />
        <path className="botanical-stem botanical-delay-two" d="M500 518C500 460 495 410 510 365C518 335 505 300 490 270" />
        <path className="botanical-stem botanical-delay-one" d="M560 518C570 465 575 415 560 370C550 340 565 305 590 278" />
      </g>

      {/* ============================================================
          LAYER 2 – dense foliage (middle layer)
          ============================================================ */}
      <g>
        {/* == LEFT FOLIAGE == */}
        <Leaf d="M15 350Q-15 320-10 290Q20 295 28 330Z" fill="#5a7d4e" className="botanical-delay-one" />
        <Leaf d="M30 330Q50 290 80 280Q75 315 38 340Z" fill="#6b8a5a" className="botanical-delay-two" />
        <Leaf d="M45 290Q15 260 20 235Q48 245 58 275Z" fill="#4e6e42" className="botanical-delay-three" />
        <Leaf d="M55 275Q72 240 100 230Q95 265 62 285Z" fill="#7a9468" className="botanical-delay-one" />
        <Leaf d="M80 320Q48 300 50 275Q78 280 92 310Z" fill="#5c7e4e" />
        <Leaf d="M95 305Q110 270 140 260Q132 295 100 318Z" fill="#6a8858" className="botanical-delay-two" />
        <Leaf d="M130 340Q98 318 102 293Q130 300 142 330Z" fill="#4a6e3e" className="botanical-delay-three" />
        <Leaf d="M145 328Q158 292 188 278Q180 315 150 340Z" fill="#7c9668" className="botanical-delay-one" />
        <Leaf d="M170 295Q140 275 145 250Q170 258 182 285Z" fill="#5a7c4c" className="botanical-delay-two" />
        <Leaf d="M185 278Q200 244 228 235Q220 268 190 290Z" fill="#688a56" className="botanical-delay-three" />
        <Leaf d="M220 310Q190 292 195 268Q220 275 232 300Z" fill="#4c704a" className="botanical-delay-one" />
        <Leaf d="M235 295Q248 260 278 252Q270 285 240 308Z" fill="#7a9660" className="botanical-delay-two" />
        <Leaf d="M270 335Q240 315 245 290Q270 298 282 325Z" fill="#5e8050" />
        <Leaf d="M285 320Q298 288 328 278Q320 310 290 332Z" fill="#648856" className="botanical-delay-three" />
        <Leaf d="M310 290Q280 272 285 248Q310 256 322 280Z" fill="#4e7244" className="botanical-delay-one" />
        <Leaf d="M340 340Q310 320 318 298Q342 305 352 332Z" fill="#6c8c5a" className="botanical-delay-two" />
        <Leaf d="M365 310Q338 295 342 272Q365 278 378 302Z" fill="#5a7e4c" className="botanical-delay-three" />
        <Leaf d="M395 340Q368 322 375 300Q396 308 408 332Z" fill="#728e62" className="botanical-delay-one" />

        {/* Bottom-left fill leaves */}
        <Leaf d="M10 400Q-18 380-12 355Q15 360 24 390Z" fill="#5c7e50" className="botanical-delay-two" />
        <Leaf d="M28 385Q45 352 72 345Q66 378 34 398Z" fill="#6d8c5e" className="botanical-delay-three" />
        <Leaf d="M60 410Q32 395 36 370Q62 376 74 400Z" fill="#4c6e42" className="botanical-delay-one" />
        <Leaf d="M75 395Q90 365 118 355Q112 388 80 408Z" fill="#7e9868" className="botanical-delay-two" />
        <Leaf d="M110 420Q82 400 88 378Q112 384 124 410Z" fill="#5a7c4e" className="botanical-delay-three" />
        <Leaf d="M140 400Q155 368 185 358Q178 392 146 412Z" fill="#688a58" className="botanical-delay-one" />
        <Leaf d="M180 415Q152 398 158 375Q182 380 194 408Z" fill="#4e7044" />
        <Leaf d="M210 395Q225 365 255 358Q248 390 215 408Z" fill="#789464" className="botanical-delay-two" />
        <Leaf d="M250 420Q222 402 228 380Q252 385 264 412Z" fill="#5c7e4e" className="botanical-delay-three" />
        <Leaf d="M290 405Q305 375 335 368Q328 398 295 416Z" fill="#6a8a5a" className="botanical-delay-one" />
        <Leaf d="M340 420Q315 405 320 382Q342 388 354 412Z" fill="#4c6e40" className="botanical-delay-two" />
        <Leaf d="M380 410Q395 380 425 375Q418 405 385 422Z" fill="#7c9664" className="botanical-delay-three" />

        {/* == RIGHT FOLIAGE == */}
        <Leaf d="M985 350Q1015 320 1010 290Q980 295 972 330Z" fill="#5a7d4e" className="botanical-delay-two" />
        <Leaf d="M970 330Q950 290 920 280Q925 315 962 340Z" fill="#6b8a5a" className="botanical-delay-one" />
        <Leaf d="M955 290Q985 260 980 235Q952 245 942 275Z" fill="#4e6e42" className="botanical-delay-three" />
        <Leaf d="M945 275Q928 240 900 230Q905 265 938 285Z" fill="#7a9468" className="botanical-delay-two" />
        <Leaf d="M920 320Q952 300 950 275Q922 280 908 310Z" fill="#5c7e4e" className="botanical-delay-one" />
        <Leaf d="M905 305Q890 270 860 260Q868 295 900 318Z" fill="#6a8858" />
        <Leaf d="M870 340Q902 318 898 293Q870 300 858 330Z" fill="#4a6e3e" className="botanical-delay-three" />
        <Leaf d="M855 328Q842 292 812 278Q820 315 850 340Z" fill="#7c9668" className="botanical-delay-one" />
        <Leaf d="M830 295Q860 275 855 250Q830 258 818 285Z" fill="#5a7c4c" className="botanical-delay-two" />
        <Leaf d="M815 278Q800 244 772 235Q780 268 810 290Z" fill="#688a56" className="botanical-delay-one" />
        <Leaf d="M780 310Q810 292 805 268Q780 275 768 300Z" fill="#4c704a" className="botanical-delay-three" />
        <Leaf d="M765 295Q752 260 722 252Q730 285 760 308Z" fill="#7a9660" />
        <Leaf d="M730 335Q760 315 755 290Q730 298 718 325Z" fill="#5e8050" className="botanical-delay-two" />
        <Leaf d="M715 320Q702 288 672 278Q680 310 710 332Z" fill="#648856" className="botanical-delay-one" />
        <Leaf d="M690 290Q720 272 715 248Q690 256 678 280Z" fill="#4e7244" className="botanical-delay-three" />
        <Leaf d="M660 340Q690 320 682 298Q658 305 648 332Z" fill="#6c8c5a" />
        <Leaf d="M635 310Q662 295 658 272Q635 278 622 302Z" fill="#5a7e4c" className="botanical-delay-one" />
        <Leaf d="M605 340Q632 322 625 300Q604 308 592 332Z" fill="#728e62" className="botanical-delay-two" />

        {/* Bottom-right fill leaves */}
        <Leaf d="M990 400Q1018 380 1012 355Q985 360 976 390Z" fill="#5c7e50" className="botanical-delay-one" />
        <Leaf d="M972 385Q955 352 928 345Q934 378 966 398Z" fill="#6d8c5e" className="botanical-delay-two" />
        <Leaf d="M940 410Q968 395 964 370Q938 376 926 400Z" fill="#4c6e42" className="botanical-delay-three" />
        <Leaf d="M925 395Q910 365 882 355Q888 388 920 408Z" fill="#7e9868" className="botanical-delay-one" />
        <Leaf d="M890 420Q918 400 912 378Q888 384 876 410Z" fill="#5a7c4e" />
        <Leaf d="M860 400Q845 368 815 358Q822 392 854 412Z" fill="#688a58" className="botanical-delay-two" />
        <Leaf d="M820 415Q848 398 842 375Q818 380 806 408Z" fill="#4e7044" className="botanical-delay-three" />
        <Leaf d="M790 395Q775 365 745 358Q752 390 785 408Z" fill="#789464" className="botanical-delay-one" />
        <Leaf d="M750 420Q778 402 772 380Q748 385 736 412Z" fill="#5c7e4e" />
        <Leaf d="M710 405Q695 375 665 368Q672 398 705 416Z" fill="#6a8a5a" className="botanical-delay-two" />
        <Leaf d="M660 420Q685 405 680 382Q658 388 646 412Z" fill="#4c6e40" className="botanical-delay-three" />
        <Leaf d="M620 410Q605 380 575 375Q582 405 615 422Z" fill="#7c9664" className="botanical-delay-one" />

        {/* Center bottom leaves that creep behind signature area */}
        <Leaf d="M430 395Q410 372 418 350Q438 358 445 385Z" fill="#5a7c4e" className="botanical-delay-two" />
        <Leaf d="M465 405Q480 375 508 370Q500 400 470 418Z" fill="#6c8c5a" className="botanical-delay-one" />
        <Leaf d="M535 405Q520 375 492 370Q500 400 530 418Z" fill="#5e8050" className="botanical-delay-three" />
        <Leaf d="M570 395Q590 372 582 350Q562 358 555 385Z" fill="#728e62" className="botanical-delay-two" />

        {/* Round leaves scattered throughout */}
        <RoundLeaf x={35} y={300} scale={0.75} rotate={-20} fill="#5a7d4e" className="botanical-delay-one" />
        <RoundLeaf x={100} y={270} scale={0.7} rotate={15} fill="#6b8a5a" className="botanical-delay-two" />
        <RoundLeaf x={175} y={245} scale={0.65} rotate={-10} fill="#4e6e42" className="botanical-delay-three" />
        <RoundLeaf x={250} y={260} scale={0.7} rotate={25} fill="#7a9468" className="botanical-delay-one" />
        <RoundLeaf x={310} y={275} scale={0.6} rotate={-30} fill="#5c7e4e" className="botanical-delay-two" />
        <RoundLeaf x={355} y={300} scale={0.65} rotate={18} fill="#688a58" className="botanical-delay-three" />
        <RoundLeaf x={965} y={300} scale={0.75} rotate={20} fill="#5a7d4e" className="botanical-delay-two" />
        <RoundLeaf x={900} y={270} scale={0.7} rotate={-15} fill="#6b8a5a" className="botanical-delay-one" />
        <RoundLeaf x={825} y={245} scale={0.65} rotate={10} fill="#4e6e42" className="botanical-delay-three" />
        <RoundLeaf x={750} y={260} scale={0.7} rotate={-25} fill="#7a9468" className="botanical-delay-two" />
        <RoundLeaf x={690} y={275} scale={0.6} rotate={30} fill="#5c7e4e" className="botanical-delay-one" />
        <RoundLeaf x={645} y={300} scale={0.65} rotate={-18} fill="#688a58" className="botanical-delay-three" />
      </g>

      {/* ============================================================
          LAYER 3 – LILIES (major flowers, thick petals)
          ============================================================ */}
      <g>
        {/* Left lilies */}
        <Lily x={35} y={195} scale={1.15} rotate={-8} tone="#c4a0d8" inner="#dcc4e8" className="botanical-delay-one" />
        <Lily x={110} y={165} scale={1.3} rotate={12} tone="#b890cc" inner="#d4b8e0" className="botanical-delay-three" />
        <Lily x={185} y={200} scale={1.0} rotate={-18} tone="#d0b4e0" inner="#e4d0f0" className="botanical-delay-two" />
        <Lily x={275} y={250} scale={0.85} rotate={22} tone="#c8a8d8" inner="#dcc0e8" className="botanical-delay-one" />

        {/* Right lilies */}
        <Lily x={965} y={195} scale={1.15} rotate={8} tone="#c4a0d8" inner="#dcc4e8" className="botanical-delay-two" />
        <Lily x={890} y={165} scale={1.3} rotate={-12} tone="#b890cc" inner="#d4b8e0" className="botanical-delay-one" />
        <Lily x={815} y={200} scale={1.0} rotate={18} tone="#d0b4e0" inner="#e4d0f0" className="botanical-delay-three" />
        <Lily x={725} y={250} scale={0.85} rotate={-22} tone="#c8a8d8" inner="#dcc0e8" className="botanical-delay-two" />

        {/* Center-left and center-right lilies (closer to signature) */}
        <Lily x={355} y={275} scale={0.75} rotate={15} tone="#d4b8e4" inner="#e8d4f0" className="botanical-delay-three" />
        <Lily x={645} y={275} scale={0.75} rotate={-15} tone="#d4b8e4" inner="#e8d4f0" className="botanical-delay-one" />

        {/* Top accent lilies */}
        <Lily x={70} y={145} scale={0.7} rotate={-25} tone="#d8c0e8" inner="#ecdcf4" className="botanical-delay-two" />
        <Lily x={930} y={145} scale={0.7} rotate={25} tone="#d8c0e8" inner="#ecdcf4" className="botanical-delay-three" />
      </g>

      {/* ============================================================
          LAYER 4 – ROSES (warm orange/coral, thick petals)
          ============================================================ */}
      <g>
        {/* Left roses */}
        <Rose x={60} y={290} scale={1.15} rotate={-10} tone="#d47848" highlight="#e8a070" className="botanical-delay-two" />
        <Rose x={140} y={325} scale={1.0} rotate={8} tone="#c86840" highlight="#e09060" className="botanical-delay-one" />
        <Rose x={210} y={280} scale={0.9} rotate={-15} tone="#d88050" highlight="#eca878" className="botanical-delay-three" />
        <Rose x={290} y={318} scale={0.8} rotate={12} tone="#cc7048" highlight="#e49868" className="botanical-delay-two" />
        <Rose x={360} y={305} scale={0.7} rotate={-6} tone="#d47848" highlight="#e8a070" className="botanical-delay-one" />

        {/* Right roses */}
        <Rose x={940} y={290} scale={1.15} rotate={10} tone="#d47848" highlight="#e8a070" className="botanical-delay-one" />
        <Rose x={860} y={325} scale={1.0} rotate={-8} tone="#c86840" highlight="#e09060" className="botanical-delay-three" />
        <Rose x={790} y={280} scale={0.9} rotate={15} tone="#d88050" highlight="#eca878" className="botanical-delay-two" />
        <Rose x={710} y={318} scale={0.8} rotate={-12} tone="#cc7048" highlight="#e49868" className="botanical-delay-one" />
        <Rose x={640} y={305} scale={0.7} rotate={6} tone="#d47848" highlight="#e8a070" className="botanical-delay-three" />

        {/* A few roses near center-bottom */}
        <Rose x={420} y={370} scale={0.6} rotate={-10} tone="#d07850" highlight="#e8a070" className="botanical-delay-two" />
        <Rose x={580} y={370} scale={0.6} rotate={10} tone="#d07850" highlight="#e8a070" className="botanical-delay-one" />
      </g>

      {/* ============================================================
          LAYER 5 – small flowers & wildflowers
          ============================================================ */}
      <g>
        {/* White/cream small flowers scattered throughout */}
        <SmallFlower x={25} y={260} scale={0.65} tone="#f0ead8" petals={5} className="botanical-delay-one" />
        <SmallFlower x={90} y={230} scale={0.55} tone="#f4efe0" petals={6} className="botanical-delay-two" />
        <SmallFlower x={155} y={255} scale={0.6} tone="#eee6d4" petals={5} className="botanical-delay-three" />
        <SmallFlower x={230} y={240} scale={0.5} tone="#f2ece0" petals={7} className="botanical-delay-one" />
        <SmallFlower x={300} y={270} scale={0.55} tone="#efe8d8" petals={5} className="botanical-delay-two" />
        <SmallFlower x={340} y={290} scale={0.45} tone="#f4efe0" petals={6} className="botanical-delay-three" />

        <SmallFlower x={975} y={260} scale={0.65} tone="#f0ead8" petals={5} className="botanical-delay-two" />
        <SmallFlower x={910} y={230} scale={0.55} tone="#f4efe0" petals={6} className="botanical-delay-one" />
        <SmallFlower x={845} y={255} scale={0.6} tone="#eee6d4" petals={5} className="botanical-delay-three" />
        <SmallFlower x={770} y={240} scale={0.5} tone="#f2ece0" petals={7} className="botanical-delay-two" />
        <SmallFlower x={700} y={270} scale={0.55} tone="#efe8d8" petals={5} className="botanical-delay-one" />
        <SmallFlower x={660} y={290} scale={0.45} tone="#f4efe0" petals={6} className="botanical-delay-three" />

        {/* Pale pink small flowers */}
        <SmallFlower x={50} y={345} scale={0.5} tone="#f0d4d4" petals={5} className="botanical-delay-one" />
        <SmallFlower x={175} y={345} scale={0.45} tone="#ecd0d0" petals={6} className="botanical-delay-two" />
        <SmallFlower x={260} y={340} scale={0.5} tone="#f0d8d8" petals={5} className="botanical-delay-three" />
        <SmallFlower x={950} y={345} scale={0.5} tone="#f0d4d4" petals={5} className="botanical-delay-two" />
        <SmallFlower x={825} y={345} scale={0.45} tone="#ecd0d0" petals={6} className="botanical-delay-one" />
        <SmallFlower x={740} y={340} scale={0.5} tone="#f0d8d8" petals={5} className="botanical-delay-three" />

        {/* Lavender sprigs */}
        <Lavender x={20} y={200} scale={0.85} rotate={-12} className="botanical-delay-one" />
        <Lavender x={130} y={190} scale={0.7} rotate={15} className="botanical-delay-two" />
        <Lavender x={240} y={230} scale={0.6} rotate={-8} className="botanical-delay-three" />
        <Lavender x={330} y={265} scale={0.55} rotate={20} className="botanical-delay-one" />
        <Lavender x={980} y={200} scale={0.85} rotate={12} className="botanical-delay-two" />
        <Lavender x={870} y={190} scale={0.7} rotate={-15} className="botanical-delay-one" />
        <Lavender x={760} y={230} scale={0.6} rotate={8} className="botanical-delay-three" />
        <Lavender x={670} y={265} scale={0.55} rotate={-20} className="botanical-delay-two" />
      </g>

      {/* ============================================================
          LAYER 6 – Rosebuds & buds scattered
          ============================================================ */}
      <g>
        <Rosebud x={45} y={230} scale={0.8} rotate={-15} tone="#d47848" className="botanical-delay-one" />
        <Rosebud x={120} y={285} scale={0.7} rotate={20} tone="#cc6040" className="botanical-delay-two" />
        <Rosebud x={200} y={310} scale={0.65} rotate={-10} tone="#d88050" className="botanical-delay-three" />
        <Rosebud x={310} y={295} scale={0.6} rotate={25} tone="#d07048" className="botanical-delay-one" />
        <Rosebud x={380} y={340} scale={0.55} rotate={-18} tone="#cc6840" className="botanical-delay-two" />
        <Rosebud x={955} y={230} scale={0.8} rotate={15} tone="#d47848" className="botanical-delay-three" />
        <Rosebud x={880} y={285} scale={0.7} rotate={-20} tone="#cc6040" className="botanical-delay-one" />
        <Rosebud x={800} y={310} scale={0.65} rotate={10} tone="#d88050" className="botanical-delay-two" />
        <Rosebud x={690} y={295} scale={0.6} rotate={-25} tone="#d07048" className="botanical-delay-three" />
        <Rosebud x={620} y={340} scale={0.55} rotate={18} tone="#cc6840" className="botanical-delay-one" />

        {/* Small round buds */}
        <g className="botanical-bud" fill="#d4a07e">
          <circle cx="15" cy="175" r="3.5" />
          <circle cx="95" cy="155" r="3" />
          <circle cx="165" cy="185" r="2.8" />
          <circle cx="250" cy="225" r="3.2" />
          <circle cx="330" cy="255" r="2.5" />
          <circle cx="400" cy="290" r="2.8" />
          <circle cx="985" cy="175" r="3.5" />
          <circle cx="905" cy="155" r="3" />
          <circle cx="835" cy="185" r="2.8" />
          <circle cx="750" cy="225" r="3.2" />
          <circle cx="670" cy="255" r="2.5" />
          <circle cx="600" cy="290" r="2.8" />
        </g>
      </g>

      {/* ============================================================
          LAYER 7 – foreground leaves that overlap everything
          ============================================================ */}
      <g>
        <Leaf d="M5 430Q-22 410-18 385Q10 388 18 420Z" fill="#4c6e42" className="botanical-delay-one" />
        <Leaf d="M22 418Q38 385 68 378Q60 410 28 428Z" fill="#6a8a58" className="botanical-delay-two" />
        <Leaf d="M55 445Q28 428 34 405Q58 410 68 438Z" fill="#5a7c4e" className="botanical-delay-three" />
        <Leaf d="M90 430Q105 398 135 390Q128 422 94 440Z" fill="#7c9668" className="botanical-delay-one" />
        <Leaf d="M135 450Q108 435 114 412Q136 418 148 442Z" fill="#4e7044" className="botanical-delay-two" />
        <Leaf d="M170 438Q185 408 212 400Q206 432 174 448Z" fill="#688a56" className="botanical-delay-three" />
        <Leaf d="M220 455Q195 440 200 418Q222 424 234 448Z" fill="#5c7e50" className="botanical-delay-one" />
        <Leaf d="M260 440Q275 410 302 405Q296 436 264 452Z" fill="#7a9464" className="botanical-delay-two" />
        <Leaf d="M310 460Q285 445 290 422Q312 428 324 454Z" fill="#4c6e40" className="botanical-delay-three" />
        <Leaf d="M350 448Q365 418 392 412Q386 442 354 458Z" fill="#6c8c5a" className="botanical-delay-one" />
        <Leaf d="M400 465Q375 450 382 428Q402 434 414 458Z" fill="#5a7c4c" className="botanical-delay-two" />

        <Leaf d="M995 430Q1022 410 1018 385Q990 388 982 420Z" fill="#4c6e42" className="botanical-delay-two" />
        <Leaf d="M978 418Q962 385 932 378Q940 410 972 428Z" fill="#6a8a58" className="botanical-delay-one" />
        <Leaf d="M945 445Q972 428 966 405Q942 410 932 438Z" fill="#5a7c4e" className="botanical-delay-three" />
        <Leaf d="M910 430Q895 398 865 390Q872 422 906 440Z" fill="#7c9668" className="botanical-delay-two" />
        <Leaf d="M865 450Q892 435 886 412Q864 418 852 442Z" fill="#4e7044" className="botanical-delay-one" />
        <Leaf d="M830 438Q815 408 788 400Q794 432 826 448Z" fill="#688a56" className="botanical-delay-three" />
        <Leaf d="M780 455Q805 440 800 418Q778 424 766 448Z" fill="#5c7e50" className="botanical-delay-two" />
        <Leaf d="M740 440Q725 410 698 405Q704 436 736 452Z" fill="#7a9464" className="botanical-delay-one" />
        <Leaf d="M690 460Q715 445 710 422Q688 428 676 454Z" fill="#4c6e40" className="botanical-delay-three" />
        <Leaf d="M650 448Q635 418 608 412Q614 442 646 458Z" fill="#6c8c5a" className="botanical-delay-two" />
        <Leaf d="M600 465Q625 450 618 428Q598 434 586 458Z" fill="#5a7c4c" className="botanical-delay-one" />

        {/* Bottom-most leaves */}
        <Leaf d="M30 480Q8 468 12 448Q34 452 42 474Z" fill="#5a7c4c" className="botanical-delay-one" />
        <Leaf d="M80 490Q58 478 62 458Q84 462 92 484Z" fill="#6c8c5a" className="botanical-delay-two" />
        <Leaf d="M140 495Q118 482 122 462Q144 466 152 488Z" fill="#4c6e40" className="botanical-delay-three" />
        <Leaf d="M200 485Q178 472 182 452Q204 456 212 478Z" fill="#7a9464" className="botanical-delay-one" />
        <Leaf d="M260 492Q238 480 242 460Q264 464 272 486Z" fill="#5c7e50" className="botanical-delay-two" />
        <Leaf d="M320 488Q298 476 302 456Q324 460 332 482Z" fill="#688a56" className="botanical-delay-three" />
        <Leaf d="M390 495Q368 482 372 462Q394 466 402 488Z" fill="#4e7044" className="botanical-delay-one" />
        <Leaf d="M450 490Q428 478 435 458Q454 462 462 484Z" fill="#6a8a58" className="botanical-delay-two" />
        <Leaf d="M550 490Q572 478 565 458Q546 462 538 484Z" fill="#6a8a58" className="botanical-delay-one" />
        <Leaf d="M610 495Q632 482 628 462Q606 466 598 488Z" fill="#4e7044" className="botanical-delay-three" />
        <Leaf d="M680 488Q702 476 698 456Q676 460 668 482Z" fill="#688a56" className="botanical-delay-two" />
        <Leaf d="M740 492Q762 480 758 460Q736 464 728 486Z" fill="#5c7e50" className="botanical-delay-one" />
        <Leaf d="M800 485Q822 472 818 452Q796 456 788 478Z" fill="#7a9464" className="botanical-delay-three" />
        <Leaf d="M860 495Q882 482 878 462Q856 466 848 488Z" fill="#4c6e40" className="botanical-delay-two" />
        <Leaf d="M920 490Q942 478 938 458Q916 462 908 484Z" fill="#6c8c5a" className="botanical-delay-one" />
        <Leaf d="M970 480Q992 468 988 448Q966 452 958 474Z" fill="#5a7c4c" className="botanical-delay-three" />
      </g>

      {/* ============================================================
          LAYER 8 – foreground flowers (larger, closer to viewer)
          ============================================================ */}
      <g>
        {/* Large foreground lilies */}
        <Lily x={70} y={360} scale={0.9} rotate={-5} tone="#c8a4d8" inner="#e0c8ee" className="botanical-delay-two" />
        <Lily x={200} y={375} scale={0.75} rotate={10} tone="#d0b0e0" inner="#e8d0f0" className="botanical-delay-one" />
        <Lily x={930} y={360} scale={0.9} rotate={5} tone="#c8a4d8" inner="#e0c8ee" className="botanical-delay-three" />
        <Lily x={800} y={375} scale={0.75} rotate={-10} tone="#d0b0e0" inner="#e8d0f0" className="botanical-delay-two" />

        {/* Foreground roses */}
        <Rose x={120} y={400} scale={0.85} rotate={-8} tone="#d07040" highlight="#e89868" className="botanical-delay-one" />
        <Rose x={250} y={410} scale={0.7} rotate={12} tone="#cc6838" highlight="#e49060" className="botanical-delay-three" />
        <Rose x={880} y={400} scale={0.85} rotate={8} tone="#d07040" highlight="#e89868" className="botanical-delay-two" />
        <Rose x={750} y={410} scale={0.7} rotate={-12} tone="#cc6838" highlight="#e49060" className="botanical-delay-one" />

        {/* Small foreground blooms */}
        <SmallFlower x={40} y={380} scale={0.5} tone="#f0e4d0" petals={5} className="botanical-delay-one" />
        <SmallFlower x={170} y={390} scale={0.45} tone="#e8d8e8" petals={6} className="botanical-delay-two" />
        <SmallFlower x={310} y={380} scale={0.4} tone="#f0e8d4" petals={5} className="botanical-delay-three" />
        <SmallFlower x={960} y={380} scale={0.5} tone="#f0e4d0" petals={5} className="botanical-delay-two" />
        <SmallFlower x={830} y={390} scale={0.45} tone="#e8d8e8" petals={6} className="botanical-delay-one" />
        <SmallFlower x={690} y={380} scale={0.4} tone="#f0e8d4" petals={5} className="botanical-delay-three" />

        {/* Foreground rosebuds */}
        <Rosebud x={30} y={410} scale={0.7} rotate={-20} tone="#d47848" className="botanical-delay-two" />
        <Rosebud x={300} y={420} scale={0.6} rotate={15} tone="#cc6040" className="botanical-delay-one" />
        <Rosebud x={970} y={410} scale={0.7} rotate={20} tone="#d47848" className="botanical-delay-three" />
        <Rosebud x={700} y={420} scale={0.6} rotate={-15} tone="#cc6040" className="botanical-delay-two" />
      </g>

      {/* ============================================================
          LAYER 9 – falling petals (very sparse, slow)
          ============================================================ */}
      <g>
        <FallingPetal
          d="M390 320Q396 312 402 322Q396 332 390 320Z"
          fill="#d8a8b0"
          className="petal-one"
        />
        <FallingPetal
          d="M620 315Q626 308 630 318Q624 328 620 315Z"
          fill="#d4c0e4"
          className="petal-two"
        />
        <FallingPetal
          d="M450 335Q455 328 460 336Q456 344 450 335Z"
          fill="#e0b8a0"
          className="petal-three"
        />
        <FallingPetal
          d="M560 340Q565 332 570 341Q566 350 560 340Z"
          fill="#c8a8d0"
          className="petal-four"
        />
        <FallingPetal
          d="M340 360Q346 354 350 362Q344 370 340 360Z"
          fill="#d8b0a0"
          className="petal-five"
        />
        <FallingPetal
          d="M670 355Q674 348 678 357Q674 366 670 355Z"
          fill="#c4b0d8"
          className="petal-six"
        />
      </g>
    </svg>
  )
}
