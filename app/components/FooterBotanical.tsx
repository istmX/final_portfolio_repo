function Leaf({ d, fill, className = '' }: { d: string; fill: string; className?: string }) {
  return <g className={`botanical-leaf ${className}`}><path d={d} fill={fill} stroke="#6f8b61" strokeWidth=".8"/></g>
}

function Lily({ x, y, scale = 1, rotate = 0, tone = '#ded0ed' }: { x: number; y: number; scale?: number; rotate?: number; tone?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}><g className="botanical-blossom">
    <path d="M0 2 C-18-5-22-25-9-29 C-3-26 0-15 0 2 M0 2 C-4-17 3-34 10-30 C17-24 11-7 0 2 M0 2 C11-14 27-18 28-9 C28-1 12 5 0 2 M0 2 C16 5 22 18 15 22 C8 25 1 14 0 2 M0 2 C-10 17-25 19-26 10 C-27 3-13-2 0 2" fill={tone} stroke="#b9a9ca" strokeWidth="1.2"/>
    <path d="M0 2 C-3-8-1-14 1-20 M1 2 C7-5 11-7 17-8" fill="none" stroke="#f4e8ce" strokeWidth="1"/>
    <circle cy="2" r="3.3" fill="#e5b86d"/><path d="M2 2 13-4 M2 3 15 2 M1 3 10 10" stroke="#e9cf91" strokeWidth="1"/>
  </g></g>
}

function Rose({ x, y, scale = 1, rotate = 0, tone = '#c96f65' }: { x: number; y: number; scale?: number; rotate?: number; tone?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}><g className="botanical-blossom">
    <path d="M0 0 C-13-2-17-14-8-20 C-2-24 7-19 8-13 C18-12 18-1 10 3 C8 13-3 16-10 9 C-17 4-13-5-7-7 C-2-10 4-7 3-2 C2 2-3 3-4 0 C-5-3 0-5 2-2" fill={tone} stroke="#9c554d" strokeWidth="1.2"/>
    <path d="M-7-14C-2-17 3-14 4-10 M10-8C14-4 11 0 8 1 M-9 5C-5 12 1 11 4 8" fill="none" stroke="#f0b3a0" strokeOpacity=".75" strokeWidth="1"/>
    <path d="M-10 10 0 14 10 9 7 17 0 20-7 16Z" fill="#66845d" stroke="#8fa274" strokeWidth="1"/>
  </g></g>
}

function Wildflower({ x, y, scale = 1, tone = '#f0e7d4', petals = 6 }: { x: number; y: number; scale?: number; tone?: string; petals?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><g className="botanical-blossom">
    {Array.from({ length: petals }, (_, i) => <ellipse key={i} cx="0" cy="-5.5" rx="2.6" ry="5" fill={tone} stroke="#d8c9ba" strokeWidth=".55" transform={`rotate(${i * (360 / petals)})`} />)}
    <circle r="2.7" fill="#dcb46d"/><circle r="1" fill="#f3ddaa"/>
  </g></g>
}

function Lavender({ x, y, scale = 1, rotate = 0 }: { x: number; y: number; scale?: number; rotate?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}><g className="botanical-bud" fill="#ad91c7">
    <path d="M0 24 Q-2 10 1-2" fill="none" stroke="#80966a" strokeWidth="1.4"/>
    <ellipse cx="-3" cy="1" rx="2.4" ry="4"/><ellipse cx="3" cy="-4" rx="2.4" ry="4"/><ellipse cx="-3" cy="-8" rx="2.4" ry="4"/><ellipse cx="3" cy="-13" rx="2.4" ry="4"/><ellipse cx="-1" cy="-18" rx="2.5" ry="4" fill="#c3a9d5"/>
  </g></g>
}

export default function FooterBotanical() {
  return <svg className="h-full w-full" viewBox="0 0 900 390" preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="stem" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9baa70"/><stop offset="1" stopColor="#4c6b52"/></linearGradient>
    </defs>
    {/* Curving stems form uneven garden edges, leaving a quiet center for the signature. */}
    <g stroke="url(#stem)" strokeWidth="2" strokeLinecap="round" opacity=".9">
      <path className="botanical-stem" d="M8 388C39 329 53 278 43 211 38 169 63 128 99 91"/><path className="botanical-stem botanical-delay-one" d="M28 388C83 336 105 286 100 236 96 192 124 148 173 123"/>
      <path className="botanical-stem botanical-delay-two" d="M78 388C112 337 149 310 161 258 174 206 192 162 233 143"/><path className="botanical-stem botanical-delay-three" d="M171 389C196 346 207 309 198 275 189 239 211 213 245 193"/>
      <path className="botanical-stem botanical-delay-two" d="M892 389C852 333 845 282 860 228 873 184 844 143 802 112"/><path className="botanical-stem botanical-delay-three" d="M864 389C822 348 793 302 798 252 802 207 766 167 719 151"/>
      <path className="botanical-stem botanical-delay-one" d="M811 389C773 340 750 302 753 263 758 215 728 180 686 164"/><path className="botanical-stem" d="M740 389C716 349 700 316 709 282 719 246 695 219 664 201"/>
      <path className="botanical-stem botanical-delay-one" d="M58 387C73 350 68 322 47 294"/><path className="botanical-stem botanical-delay-two" d="M837 388C820 352 827 320 850 294"/>
    </g>
    {/* Layered foliage; hand-varied shapes and angles keep the clusters irregular. */}
    <g>
      <Leaf d="M45 315 Q12 284 15 263 Q46 269 54 301Z" fill="#66875f"/><Leaf d="M54 302 Q71 265 99 258 Q95 289 61 314Z" fill="#829766"/>
      <Leaf d="M46 251 Q13 238 9 213 Q37 217 55 240Z" fill="#819765"/><Leaf d="M49 238 Q55 203 82 188 Q82 219 57 247Z" fill="#547658"/>
      <Leaf d="M91 351 Q50 342 39 319 Q72 317 100 341Z" fill="#8ba06e"/><Leaf d="M101 338 Q114 303 146 293 Q137 325 107 349Z" fill="#5f8059"/>
      <Leaf d="M103 274 Q72 254 75 232 Q101 238 115 262Z" fill="#a0a777"/><Leaf d="M110 259 Q127 223 153 218 Q146 246 115 271Z" fill="#6d895e"/>
      <Leaf d="M157 335 Q125 317 126 296 Q153 301 168 325Z" fill="#a0aa72"/><Leaf d="M167 321 Q177 285 207 272 Q201 307 173 332Z" fill="#64825a"/>
      <Leaf d="M200 293 Q171 276 173 253 Q198 261 211 282Z" fill="#819565"/><Leaf d="M205 277 Q223 245 246 240 Q241 265 211 288Z" fill="#557451"/>
      <Leaf d="M30 373 Q5 361 1 342 Q27 343 42 364Z" fill="#6d8b5e"/><Leaf d="M80 386 Q48 376 42 356 Q69 354 91 377Z" fill="#99a775"/>
      <Leaf d="M137 384 Q106 371 103 350 Q131 352 149 374Z" fill="#66845b"/><Leaf d="M221 386 Q191 367 193 346 Q219 352 232 374Z" fill="#91a06e"/>
      <Leaf d="M854 309 Q884 279 887 256 Q857 266 845 295Z" fill="#64845c"/><Leaf d="M847 294 Q825 261 799 253 Q806 283 840 306Z" fill="#91a06d"/>
      <Leaf d="M848 244 Q879 222 874 199 Q850 207 837 234Z" fill="#a0aa72"/><Leaf d="M838 232 Q826 198 801 184 Q802 215 832 244Z" fill="#66865d"/>
      <Leaf d="M798 349 Q835 335 844 310 Q815 310 790 339Z" fill="#819765"/><Leaf d="M788 337 Q770 303 740 292 Q749 326 781 350Z" fill="#5c7c56"/>
      <Leaf d="M753 314 Q784 289 777 266 Q751 275 740 303Z" fill="#9aa673"/><Leaf d="M742 301 Q726 270 699 260 Q705 291 735 317Z" fill="#66855c"/>
      <Leaf d="M869 371 Q895 357 899 338 Q873 342 857 363Z" fill="#93a16d"/><Leaf d="M814 384 Q847 373 851 352 Q824 354 804 376Z" fill="#65845c"/>
      <Leaf d="M762 386 Q791 369 790 348 Q764 356 751 376Z" fill="#a0aa72"/><Leaf d="M681 385 Q711 366 707 345 Q683 354 670 375Z" fill="#5d7c56"/>
      <Leaf d="M72 190 Q48 170 54 151 Q76 160 84 181Z" fill="#6e8b5d"/><Leaf d="M122 221 Q94 204 98 184 Q121 192 133 213Z" fill="#9aa875"/>
      <Leaf d="M826 184 Q849 162 840 143 Q819 155 814 176Z" fill="#829866"/><Leaf d="M773 219 Q801 198 795 179 Q772 190 762 211Z" fill="#a2aa78"/>
    </g>
    {/* Fine side branches and tiny buds add a softer background layer. */}
    <g stroke="#81956c" strokeWidth="1.25" strokeLinecap="round" fill="none">
      <path d="M42 221Q19 201 23 184M44 208Q68 186 72 165M98 244Q75 225 72 207M160 286Q184 267 190 244M861 244Q886 224 888 203M801 224Q778 202 773 184M750 276Q727 256 726 238M840 270Q861 250 872 231"/>
    </g>
    <g className="botanical-bud" fill="#dba27e"><circle cx="22" cy="182" r="3.2"/><circle cx="72" cy="162" r="2.7"/><circle cx="70" cy="204" r="3"/><circle cx="188" cy="241" r="2.7"/><circle cx="887" cy="200" r="3"/><circle cx="772" cy="181" r="2.8"/><circle cx="724" cy="235" r="3"/><circle cx="873" cy="228" r="2.5"/></g>
    {/* Tall, differently scaled blooms sit above dense lower foliage. */}
    <Lily x={97} y={93} scale={1.12} rotate={-12}/><Lily x={169} y={123} scale={.79} rotate={15} tone="#ead4e7"/>
    <Lily x={802} y={111} scale={.92} rotate={14} tone="#e9d9ed"/><Lily x={722} y={151} scale={.72} rotate={-18} tone="#d9c7e5"/>
    <Rose x={48} y={292} scale={1.04} rotate={-12} tone="#ce765f"/><Rose x={104} y={337} scale={.84} rotate={11} tone="#b9554d"/><Rose x={168} y={322} scale={.7} rotate={-8} tone="#d8926f"/>
    <Rose x={851} y={293} scale={.92} rotate={9} tone="#cb755b"/><Rose x={790} y={340} scale={1.04} rotate={-8} tone="#ba5e53"/><Rose x={738} y={310} scale={.69} rotate={15} tone="#d98a68"/>
    <Wildflower x={39} y={235} scale={1.1} tone="#f0e8d9" petals={7}/><Wildflower x={142} y={276} scale={.78} tone="#e8d9ef" petals={5}/><Wildflower x={207} y={265} scale={.7} tone="#f1e8d6" petals={6}/>
    <Wildflower x={868} y={220} scale={.86} tone="#f3e7d2" petals={7}/><Wildflower x={781} y={255} scale={1.05} tone="#e6d7ee" petals={6}/><Wildflower x={690} y={255} scale={.67} tone="#f3e9dc" petals={5}/>
    <Lavender x={24} y={187} scale={.9} rotate={-8}/><Lavender x={190} y={244} scale={.73} rotate={11}/><Lavender x={885} y={207} scale={.9} rotate={10}/><Lavender x={729} y={236} scale={.78} rotate={-10}/>
    {/* Smaller side blooms and foreground leaves enrich the garden without crossing the copy. */}
    <Wildflower x={62} y={329} scale={.48} tone="#e4d4e8" petals={5}/><Wildflower x={126} y={302} scale={.52} tone="#f0e7dc" petals={6}/><Wildflower x={831} y={326} scale={.5} tone="#e9d9ee" petals={6}/><Wildflower x={768} y={290} scale={.48} tone="#f0e5d5" petals={5}/>
    <g className="botanical-falling-petal petal-one"><path d="M270 339 Q276 333 281 341 Q276 350 270 339Z" fill="#d7a2a7"/></g>
    <g className="botanical-falling-petal petal-two"><path d="M652 345 Q657 338 662 345 Q658 354 652 345Z" fill="#d8c2e5"/></g>
  </svg>
}
