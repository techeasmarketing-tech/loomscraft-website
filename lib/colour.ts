export const COLOUR_FAMILIES = ["White/Cream", "Beige/Brown", "Grey/Black", "Blue", "Green", "Pink/Red", "Purple", "Yellow/Orange/Gold", "Prints"] as const;
export type ColourFamily = (typeof COLOUR_FAMILIES)[number];
export function hexToFamily(hex = "") : ColourFamily {
  const m = hex.match(/^#?([\da-f]{6})$/i); if (!m) return "Grey/Black";
  const n = parseInt(m[1], 16), r=n>>16, g=(n>>8)&255, b=n&255;
  const max=Math.max(r,g,b)/255, min=Math.min(r,g,b)/255, d=max-min, l=(max+min)/2;
  let h=0; if(d){ if(max===r/255) h=((g-b)/255/d)%6; else if(max===g/255) h=(b-r)/255/d+2; else h=(r-g)/255/d+4; h=(h*60+360)%360; }
  if(l>.91 && d<.16) return "White/Cream";
  if(l<.2 && h>200 && h<260) return "Blue";
  if(d<.16) return l<.42 ? "Grey/Black" : (r>g*1.04 && g>b*1.05 ? "Beige/Brown" : "White/Cream");
  if(h<15||h>=345) return l>.78 ? "Beige/Brown" : "Pink/Red";
  if(h<45) return l<.48 ? "Beige/Brown" : "Yellow/Orange/Gold";
  if(h<70) return "Yellow/Orange/Gold"; if(h<165)return "Green"; if(h<255)return "Blue"; if(h<290)return "Purple"; if(h<345)return "Pink/Red"; return "Grey/Black";
}
export const isPrinted = (s: string) => /floral|paisley|paisly|botanical|print|geometric|marble|mosaic|patchwork|bloom|sprig|watercolou?r/i.test(s);

export function familyForColour(name: string, hex: string, productName = ""): ColourFamily {
 const label=name.toLowerCase();
 if (isPrinted(label+" "+productName)) return "Prints";
 if (/taupe|champagne|stone|sand|beige|camel/.test(label)) return "Beige/Brown";
 if (/charcoal|light grey|light gray|slate|silver|grey|gray/.test(label)) return "Grey/Black";
 if (/midnight navy|navy|ice blue|sky|blue/.test(label)) return "Blue";
 if (/sage/.test(label)) return "Green";
 return hexToFamily(hex);
}
