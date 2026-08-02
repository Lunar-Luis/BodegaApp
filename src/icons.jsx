// Íconos SVG propios (estilo lineal), sin dependencias externas.
const S = ({ children, size = 24, fill = 'none', ...p }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {children}
  </svg>
)

export const Store = (p) => (
  <S {...p}><path d="M3 9l1.5-5h15L21 9M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M3 9h18M9 20v-5h6v5" /></S>
)
export const Search = (p) => (
  <S {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></S>
)
export const Home = (p) => (
  <S {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></S>
)
export const Inventory = (p) => (
  <S {...p}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M9 13h6" /></S>
)
export const Sell = (p) => (
  <S {...p}><path d="M3 3h2l2.4 12.3a1 1 0 001 .7h9.7a1 1 0 001-.8L21 7H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></S>
)
export const Payments = (p) => (
  <S {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></S>
)
export const History = (p) => (
  <S {...p}><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></S>
)
export const Plus = (p) => (<S {...p}><path d="M12 5v14M5 12h14" /></S>)
export const Minus = (p) => (<S {...p}><path d="M5 12h14" /></S>)
export const Close = (p) => (<S {...p}><path d="M6 6l12 12M18 6L6 18" /></S>)
export const Check = (p) => (<S {...p}><path d="M20 6L9 17l-5-5" /></S>)
export const Up = (p) => (<S {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></S>)
export const Down = (p) => (<S {...p}><path d="M3 7l6 6 4-4 8 8" /><path d="M17 17h4v-4" /></S>)
export const Warning = (p) => (
  <S {...p}><path d="M10.3 3.8L1.8 18a1.5 1.5 0 001.3 2.3h17.8a1.5 1.5 0 001.3-2.3L13.7 3.8a1.5 1.5 0 00-2.6 0z" /><path d="M12 9v4M12 17h.01" /></S>
)
export const Edit = (p) => (<S {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2 2 0 013 3L7 19l-4 1 1-4z" /></S>)
export const Scan = (p) => (
  <S {...p}><path d="M4 7V5a1 1 0 011-1h2M17 4h2a1 1 0 011 1v2M20 17v2a1 1 0 01-1 1h-2M7 20H5a1 1 0 01-1-1v-2" /><path d="M7 8v8M10 8v8M13 8v8M16 8v8" /></S>
)
export const Calendar = (p) => (
  <S {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></S>
)
export const Note = (p) => (<S {...p}><path d="M4 5h16M4 10h16M4 15h10" /></S>)
export const Box = (p) => (
  <S {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></S>
)
export const Invest = (p) => (
  <S {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></S>
)
export const Cash = (p) => (
  <S {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></S>
)
export const Share = (p) => (
  <S {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></S>
)
export const Phone = (p) => (
  <S {...p}><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></S>
)
export const Sun = (p) => (
  <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></S>
)
export const Moon = (p) => (
  <S {...p}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></S>
)
export const Refresh = (p) => (
  <S {...p}><path d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6" /></S>
)
export const ChevronLeft = (p) => (<S {...p}><path d="M15 18l-6-6 6-6" /></S>)
export const ChevronRight = (p) => (<S {...p}><path d="M9 18l6-6-6-6" /></S>)
export const ArrowLeft = (p) => (<S {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></S>)
export const LogOut = (p) => (<S {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></S>)
export const Eye = (p) => (<S {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></S>)
export const Camera = (p) => (
  <S {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></S>
)
export const FilePdf = (p) => (
  <S {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 13v5M9 13h1.5a1.5 1.5 0 010 3H9M13.5 13v5M13.5 13H16M13.5 16h2" /></S>
)
export const EyeOff = (p) => (<S {...p}><path d="M9.9 4.2A11 11 0 0112 4c7 0 11 8 11 8a18 18 0 01-3 3.8M6.6 6.6A18 18 0 001 12s4 8 11 8a11 11 0 004.1-.8" /><path d="M9.9 9.9a3 3 0 004.2 4.2M1 1l22 22" /></S>)
export const DollarBill = (p) => (
  <S {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 9v6M13.5 10.5a1.6 1.6 0 00-1.5-1c-1 0-1.6.6-1.6 1.3 0 1.7 3.2 1 3.2 2.7 0 .8-.7 1.4-1.6 1.4a1.7 1.7 0 01-1.6-1" /></S>
)
export const Trash = (p) => (
  <S {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></S>
)

/* ---- Íconos de productos (por tipo) ---- */
export const Bag = (p) => (
  <S {...p}><path d="M6 8h12l-1 11a2 2 0 01-2 2H9a2 2 0 01-2-2L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></S>
)
export const Bottle = (p) => (
  <S {...p}><path d="M10 2h4" /><path d="M10 2v3.2a2 2 0 01-.4 1.2l-.9 1.2A3 3 0 008 9.5V20a2 2 0 002 2h4a2 2 0 002-2V9.5a3 3 0 00-.7-1.9l-.9-1.2A2 2 0 0114 5.2V2" /><path d="M8 12h8" /></S>
)
export const Cheese = (p) => (
  <S {...p}><path d="M3 19v-4L18 8a2 2 0 013 1.8V19a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><circle cx="9" cy="16" r="1" /><circle cx="14" cy="15" r="1" /></S>
)
export const Coffee = (p) => (
  <S {...p}><path d="M5 8h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4V8z" /><path d="M16 9h2.5a2.5 2.5 0 010 5H16" /><path d="M8.5 3v2M11.5 3v2" /></S>
)
export const Bread = (p) => (
  <S {...p}><path d="M4 13a5 5 0 015-5h4a5 5 0 015 5v4a1 1 0 01-1 1H5a1 1 0 01-1-1z" /><path d="M8 12v3M12 12v3" /></S>
)
export const Soap = (p) => (
  <S {...p}><rect x="4" y="9" width="15" height="11" rx="4" /><path d="M8 9a3 3 0 016 0" /><circle cx="18" cy="5" r="1.3" /><circle cx="15" cy="7" r="0.8" /></S>
)

const PRODUCT_ICONS = { bag: Bag, bottle: Bottle, cheese: Cheese, coffee: Coffee, bread: Bread, soap: Soap, box: Box }
export function ProductIcon({ name, ...p }) {
  const C = PRODUCT_ICONS[name] || Box
  return <C {...p} />
}
