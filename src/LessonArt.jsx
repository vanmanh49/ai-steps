// One decorative illustration per lesson, drawn on a 320x160 canvas.
// Shape classes (styles.css): t = level colour, s = soft tint, w = surface,
// ws = surface with outline, l = line, l2 = thin line, d = dashed.

const spark = (cx, cy, r, cls = 'w') => (
  <path
    className={cls}
    d={`M${cx} ${cy - r}l${r / 3} ${(r * 2) / 3} ${(r * 2) / 3} ${r / 3}-${(r * 2) / 3} ${r / 3}-${r / 3} ${(r * 2) / 3}-${r / 3}-${(r * 2) / 3}-${(r * 2) / 3}-${r / 3} ${(r * 2) / 3}-${r / 3}z`}
  />
)

const magnifier = (cx, cy) => (
  <>
    <circle className="l2" cx={cx - 2} cy={cy - 2} r="5" />
    <path className="l2" d={`M${cx + 2} ${cy + 2}l5 5`} />
  </>
)

const envelope = (cx, cy) => (
  <>
    <rect className="l2" x={cx - 8} y={cy - 6} width="16" height="12" rx="2" />
    <path className="l2" d={`M${cx - 8} ${cy - 5}l8 6 8-6`} />
  </>
)

const code = (cx, cy) => (
  <path className="l2" d={`M${cx - 4} ${cy - 6}l-5 6 5 6M${cx + 4} ${cy - 6}l5 6-5 6`} />
)

const ART = {
  'what-is-ai': (
    <>
      <path className="l" d="M160 80L64 44M160 80L256 44M160 80L64 116M160 80L256 116" />
      <circle className="ws" cx="64" cy="44" r="16" />
      <circle className="ws" cx="256" cy="44" r="16" />
      <circle className="ws" cx="64" cy="116" r="16" />
      <circle className="ws" cx="256" cy="116" r="16" />
      <circle className="t" cx="64" cy="44" r="5" />
      <rect className="t" x="251" y="39" width="10" height="10" rx="2" />
      <path className="t" d="M64 110l6 11h-12z" />
      <circle className="s" cx="256" cy="116" r="7" />
      <path className="l" d="M144 48v-10M160 48v-10M176 48v-10M144 112v10M160 112v10M176 112v10" />
      <rect className="t" x="128" y="48" width="64" height="64" rx="12" />
      <rect className="w" x="141" y="61" width="38" height="38" rx="6" />
      {spark(160, 80, 13, 't')}
    </>
  ),
  'machine-learning': (
    <>
      {[[70, 108], [96, 94], [86, 128], [118, 116], [112, 138], [58, 132]].map(([x, y]) => (
        <circle key={`${x}-${y}`} className="t" cx={x} cy={y} r="8" />
      ))}
      {[[200, 46], [226, 62], [242, 34], [214, 82], [258, 72], [272, 44]].map(([x, y]) => (
        <circle key={`${x}-${y}`} className="ws" cx={x} cy={y} r="8" />
      ))}
      <path className="l d" d="M52 34C120 56 190 110 284 128" />
    </>
  ),
  'chatbots-llms': (
    <>
      <rect className="ws" x="40" y="26" width="140" height="48" rx="16" />
      <path className="l" d="M60 43h100M60 58h62" />
      <rect className="t" x="140" y="88" width="140" height="48" rx="16" />
      <circle className="w" cx="186" cy="112" r="6" />
      <circle className="w" cx="210" cy="112" r="6" />
      <circle className="w" cx="234" cy="112" r="6" />
    </>
  ),
  'can-and-cannot': (
    <>
      <path className="l" d="M160 46v78M128 126h64M92 54h136" />
      <path className="l2" d="M92 54l-26 42M92 54l26 42M228 54l-26 42M228 54l26 42" />
      <path className="t" d="M62 96a30 16 0 0 0 60 0z" />
      <path className="s" d="M198 96a30 16 0 0 0 60 0z" />
      <path className="l2" d="M198 96h60" />
      <circle className="t" cx="160" cy="46" r="8" />
      <path className="l" d="M30 40l8 8 14-16M270 30l14 14M284 30l-14 14" />
    </>
  ),
  'how-llms-work': (
    <>
      <path className="l2" d="M40 56v-12h184v12" />
      <rect className="t" x="40" y="68" width="46" height="34" rx="8" />
      <rect className="s" x="92" y="68" width="30" height="34" rx="8" />
      <rect className="t" x="128" y="68" width="56" height="34" rx="8" />
      <rect className="s" x="190" y="68" width="34" height="34" rx="8" />
      <rect className="l d" x="232" y="68" width="50" height="34" rx="8" />
      <path className="l" d="M257 130v-16M250 121l7-7 7 7" />
    </>
  ),
  prompting: (
    <>
      <rect className="ws" x="40" y="32" width="100" height="96" rx="12" />
      <path className="l" d="M58 56h64M58 76h64M58 96h38" />
      <path className="l" d="M154 80h30M174 70l10 10-10 10" />
      <rect className="t" x="196" y="32" width="84" height="96" rx="12" />
      {spark(238, 80, 24)}
    </>
  ),
  hallucinations: (
    <>
      <rect className="ws" x="56" y="26" width="116" height="108" rx="12" />
      <path className="l" d="M76 52h76M76 72h76" />
      <path className="l d" d="M76 92h76M76 112h44" />
      <path className="t" d="M230 44l42 72h-84z" />
      <rect className="w" x="227" y="70" width="6" height="24" rx="3" />
      <circle className="w" cx="230" cy="104" r="4" />
    </>
  ),
  'what-is-an-agent': (
    <>
      <circle className="l d" cx="160" cy="84" r="56" />
      <circle className="t" cx="160" cy="84" r="24" />
      {spark(160, 84, 13)}
      <circle className="ws" cx="160" cy="28" r="17" />
      <circle className="ws" cx="208" cy="112" r="17" />
      <circle className="ws" cx="112" cy="112" r="17" />
      {magnifier(160, 28)}
      {envelope(208, 112)}
      {code(112, 112)}
    </>
  ),
  'agent-loop': (
    <>
      <path className="l" markerEnd="url(#arrow)" d="M182 52L210 94" />
      <path className="l" markerEnd="url(#arrow)" d="M198 120L126 120" />
      <path className="l" markerEnd="url(#arrow)" d="M108 96L138 54" />
      <circle className="t" cx="160" cy="36" r="22" />
      {spark(160, 36, 12)}
      <circle className="ws" cx="224" cy="120" r="22" />
      <path className="t" d="M218 110l16 10-16 10z" />
      <circle className="ws" cx="96" cy="120" r="22" />
      <path className="l2" d="M82 120q14-14 28 0q-14 14-28 0z" />
      <circle className="t" cx="96" cy="120" r="4" />
    </>
  ),
  tools: (
    <>
      <path className="l" d="M104 80C150 80 150 36 198 36M104 80H198M104 80C150 80 150 124 198 124" />
      <circle className="t" cx="80" cy="80" r="26" />
      {spark(80, 80, 14)}
      <rect className="ws" x="200" y="18" width="60" height="36" rx="10" />
      <rect className="ws" x="200" y="62" width="60" height="36" rx="10" />
      <rect className="ws" x="200" y="106" width="60" height="36" rx="10" />
      {magnifier(230, 36)}
      {envelope(230, 80)}
      {code(230, 124)}
    </>
  ),
  'memory-rag': (
    <>
      <rect className="s" x="36" y="44" width="60" height="78" rx="8" />
      <rect className="ws" x="50" y="32" width="60" height="78" rx="8" />
      <path className="l2" d="M62 48h36M62 80h36M62 94h22" />
      <rect className="t" x="60" y="57" width="40" height="12" rx="4" />
      <path className="l" markerEnd="url(#arrow)" d="M126 78H166" />
      <rect className="ws" x="184" y="30" width="100" height="100" rx="12" />
      <path className="l2" d="M184 50h100" />
      <rect className="t" x="198" y="64" width="72" height="16" rx="5" />
      <path className="l2" d="M198 96h72M198 112h44" />
    </>
  ),
  'multi-agent-safety': (
    <>
      <path className="l" d="M150 54L100 100M160 58V96M170 54L220 100" />
      <circle className="t" cx="160" cy="36" r="22" />
      {spark(160, 36, 12)}
      <circle className="ws" cx="90" cy="118" r="18" />
      <circle className="ws" cx="160" cy="118" r="18" />
      <circle className="ws" cx="230" cy="118" r="18" />
      <circle className="t" cx="90" cy="118" r="6" />
      <circle className="t" cx="160" cy="118" r="6" />
      <circle className="t" cx="230" cy="118" r="6" />
      <path className="s" d="M264 20l22 8v16c0 14-10 23-22 28-12-5-22-14-22-28V28z" />
      <path className="l2" d="M264 20l22 8v16c0 14-10 23-22 28-12-5-22-14-22-28V28z" />
      <path className="l2" d="M255 45l7 7 11-13" />
    </>
  ),
}

export default function LessonArt({ id, className = '' }) {
  if (!ART[id]) return null
  return (
    <svg className={`art ${className}`} viewBox="0 0 320 160" aria-hidden="true">
      <defs>
        <marker id="arrow" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
          <path className="t" d="M0 0L12 6L0 12z" />
        </marker>
      </defs>
      <rect className="art-bg" width="320" height="160" rx="14" />
      {ART[id]}
    </svg>
  )
}
