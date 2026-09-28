
export function LoginBackgroundPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Deep dark to warm orange ambient backdrop gradient */}
      <div className="absolute inset-0 bg-[#0E1522]" />

      {/* Top right vibrant orange gradient bloom */}
      <div
        className="absolute -top-1/4 -right-1/4 w-[900px] h-[900px] rounded-full blur-3xl opacity-85"
        style={{
          background: 'radial-gradient(circle at 65% 35%, #FF5B26 0%, #D84315 35%, #872605 60%, transparent 80%)',
        }}
      />

      {/* Secondary warm ambient light glow */}
      <div
        className="absolute top-1/2 -right-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, #FFA07A 0%, #FF5B26 40%, transparent 75%)',
        }}
      />

      {/* Dark road network SVG pattern */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Taxi Silhouette Symbol */}
          <g id="taxi-car">
            {/* Main car body */}
            <rect x="0" y="8" width="110" height="36" rx="8" fill="#8A3714" fillOpacity="0.75" />
            {/* Car cabin / roof */}
            <path
              d="M25 8 L40 0 L75 0 L88 8 Z"
              fill="#5A230C"
              fillOpacity="0.85"
            />
            {/* Windows */}
            <path d="M42 2 L73 2 L80 8 L37 8 Z" fill="#2D1206" fillOpacity="0.9" />
            {/* Taxi Top Roof Light Sign */}
            <rect x="50" y="-4" width="16" height="5" rx="1.5" fill="#FFA500" fillOpacity="0.95" />
            <rect x="52" y="-3" width="12" height="3" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
            {/* Wheels */}
            <rect x="14" y="38" width="22" height="7" rx="3.5" fill="#1C1B1B" />
            <rect x="74" y="38" width="22" height="7" rx="3.5" fill="#1C1B1B" />
            <circle cx="25" cy="41.5" r="2" fill="#6B7280" />
            <circle cx="85" cy="41.5" r="2" fill="#6B7280" />
            {/* Checker Pattern on Door */}
            <g opacity="0.65">
              <rect x="42" y="16" width="5" height="5" fill="#FFA500" />
              <rect x="47" y="16" width="5" height="5" fill="#1C1B1B" />
              <rect x="52" y="16" width="5" height="5" fill="#FFA500" />
              <rect x="57" y="16" width="5" height="5" fill="#1C1B1B" />
              <rect x="62" y="16" width="5" height="5" fill="#FFA500" />
              <rect x="42" y="21" width="5" height="5" fill="#1C1B1B" />
              <rect x="47" y="21" width="5" height="5" fill="#FFA500" />
              <rect x="52" y="21" width="5" height="5" fill="#1C1B1B" />
              <rect x="57" y="21" width="5" height="5" fill="#FFA500" />
              <rect x="62" y="21" width="5" height="5" fill="#1C1B1B" />
            </g>
          </g>
        </defs>

        {/* Diagonal Road Network */}
        {/* Road 1: Top-Left to Bottom-Middle */}
        <polygon points="-50,-50 200,-50 500,850 250,850" fill="#161F2E" fillOpacity="0.8" />
        <line
          x1="75"
          y1="-50"
          x2="375"
          y2="850"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.4"
        />

        {/* Road 2: Horizontal across upper section */}
        <polygon points="-50,80 1250,80 1250,220 -50,220" fill="#182333" fillOpacity="0.75" />
        <line
          x1="-50"
          y1="150"
          x2="1250"
          y2="150"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.4"
        />

        {/* Road 3: Crossing lower section */}
        <polygon points="-50,560 1250,560 1250,710 -50,710" fill="#161F2E" fillOpacity="0.7" />
        <line
          x1="-50"
          y1="635"
          x2="1250"
          y2="635"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.4"
        />

        {/* Road 4: Left-middle angled road */}
        <polygon points="-50,300 450,850 250,850 -50,450" fill="#151D2A" fillOpacity="0.8" />
        <line
          x1="-50"
          y1="375"
          x2="350"
          y2="850"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.4"
        />

        {/* Road 5: Right angled road */}
        <polygon points="700,-50 1250,500 1250,700 600,-50" fill="#1A2434" fillOpacity="0.6" />
        <line
          x1="650"
          y1="-50"
          x2="1250"
          y2="600"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="14 14"
          strokeOpacity="0.35"
        />

        {/* Silhouetted Taxis driving on roads */}
        {/* Taxi 1: Top Left */}
        <use href="#taxi-car" x="40" y="100" transform="scale(0.85)" />

        {/* Taxi 2: Top Center/Right */}
        <use href="#taxi-car" x="420" y="70" transform="scale(0.95)" />

        {/* Taxi 3: Far Left Middle */}
        <use href="#taxi-car" x="20" y="380" transform="scale(0.8)" />

        {/* Taxi 4: Bottom Center */}
        <use href="#taxi-car" x="490" y="600" transform="scale(0.95)" />

        {/* Taxi 5: Bottom Left */}
        <use href="#taxi-car" x="50" y="770" transform="scale(0.9)" />

        {/* Taxi 6: Bottom Right */}
        <use href="#taxi-car" x="480" y="720" transform="scale(0.85)" />
      </svg>

      {/* 4-Point Star Sparkle in Bottom Right */}
      <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 pointer-events-none opacity-80 animate-pulse">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 0C24 13.2548 34.7452 24 48 24C34.7452 24 24 34.7452 24 48C24 34.7452 13.2548 24 0 24C13.2548 24 24 13.2548 24 0Z"
            fill="#FFB088"
            fillOpacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
