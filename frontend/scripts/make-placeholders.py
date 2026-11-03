#!/usr/bin/env python3
"""Generates the placeholder SVG artwork in public/images.
Replace these with real photography before launch (see docs/IMAGES.md)."""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
GOLD, GOLD2 = "#c9a15a", "#e8cf9b"
ROSE, ROSE2 = "#b4546a", "#e9b8c4"
INK = "#2a2226"

def defs(a, b):
    return f'''<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{GOLD2}"/><stop offset="1" stop-color="{GOLD}"/></linearGradient>
<linearGradient id="rose" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{ROSE2}"/><stop offset="1" stop-color="{ROSE}"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity=".18"/></filter>
</defs>'''

# Each shape is drawn around (0,0) in a ~240x240 box.
SHAPES = {
"lipstick": '<rect x="-34" y="-10" width="68" height="100" rx="8" fill="url(#gold)"/><rect x="-28" y="-44" width="56" height="38" rx="4" fill="#d9c08a"/><path d="M-24 -44 L-24 -92 Q0 -118 24 -92 L24 -44 Z" fill="url(#rose)"/>',
"gloss": '<rect x="-24" y="-30" width="48" height="120" rx="14" fill="url(#rose)" opacity=".92"/><rect x="-20" y="-80" width="40" height="52" rx="8" fill="url(#gold)"/><rect x="-14" y="-40" width="10" height="100" rx="5" fill="#fff" opacity=".28"/>',
"foundation": '<rect x="-38" y="-20" width="76" height="110" rx="16" fill="#f1d9c2"/><rect x="-38" y="30" width="76" height="60" rx="14" fill="#e3c0a0"/><rect x="-16" y="-62" width="32" height="44" rx="6" fill="url(#gold)"/><rect x="-10" y="-80" width="20" height="20" rx="5" fill="url(#gold)"/>',
"compact": '<circle cx="0" cy="10" r="82" fill="url(#gold)"/><circle cx="0" cy="10" r="62" fill="#f4e4e8"/><circle cx="0" cy="10" r="40" fill="#ecc4cf"/><circle cx="-14" cy="-6" r="14" fill="#fff" opacity=".35"/>',
"palette": '<rect x="-96" y="-62" width="192" height="130" rx="14" fill="url(#gold)"/>' + "".join(f'<circle cx="{x}" cy="{y}" r="19" fill="{c}"/>' for x,y,c in [(-60,-26,"#e8b4a0"),(-20,-26,"#c97b6b"),(20,-26,"#8e4a58"),(60,-26,"#f0d29a"),(-60,26,"#4b2f3a"),(-20,26,"#b58b5b"),(20,26,"#e3a6b6"),(60,26,"#6b3c4a")]),
"mascara": '<rect x="-16" y="-30" width="32" height="130" rx="8" fill="#2a2226"/><rect x="-16" y="40" width="32" height="14" fill="url(#gold)"/><rect x="-4" y="-100" width="8" height="74" fill="#444"/><rect x="-12" y="-100" width="24" height="52" rx="10" fill="#171216"/>',
"blush": '<circle cx="-46" cy="10" r="54" fill="url(#gold)"/><circle cx="-46" cy="10" r="38" fill="#eaa0aa"/><circle cx="46" cy="10" r="54" fill="url(#gold)"/><circle cx="46" cy="10" r="38" fill="#f3c2a8"/>',
"brush": '<rect x="-9" y="-10" width="18" height="110" rx="9" fill="url(#gold)"/><path d="M-26 -10 Q-26 -92 0 -108 Q26 -92 26 -10 Z" fill="#f4e4e8" stroke="#d8aab6" stroke-width="3"/><rect x="-26" y="-14" width="52" height="14" fill="#cfae6a"/>',
"earrings": '<g><line x1="-40" y1="-80" x2="-40" y2="-30" stroke="#c9a15a" stroke-width="5"/><circle cx="-40" cy="-84" r="9" fill="url(#gold)"/><circle cx="-40" cy="8" r="38" fill="#fbf7f1"/><circle cx="-52" cy="-6" r="10" fill="#fff" opacity=".7"/></g><g><line x1="40" y1="-80" x2="40" y2="-30" stroke="#c9a15a" stroke-width="5"/><circle cx="40" cy="-84" r="9" fill="url(#gold)"/><circle cx="40" cy="8" r="38" fill="#fbf7f1"/><circle cx="28" cy="-6" r="10" fill="#fff" opacity=".7"/></g>',
"necklace": '<path d="M-100 -70 Q0 120 100 -70" fill="none" stroke="url(#gold)" stroke-width="5"/><path d="M-82 -82 Q0 70 82 -82" fill="none" stroke="url(#gold)" stroke-width="3" opacity=".8"/><circle cx="0" cy="44" r="14" fill="url(#gold)"/><circle cx="0" cy="44" r="6" fill="#fbf7f1"/>',
"rings": '<circle cx="-34" cy="14" r="52" fill="none" stroke="url(#gold)" stroke-width="12"/><circle cx="40" cy="14" r="52" fill="none" stroke="#e5c7d0" stroke-width="12"/><polygon points="-34,-56 -22,-40 -46,-40" fill="#fff" stroke="#c9a15a" stroke-width="3"/>',
"bracelet": '<ellipse cx="0" cy="10" rx="96" ry="64" fill="none" stroke="url(#gold)" stroke-width="10"/>' + "".join(f'<circle cx="{x}" cy="{y}" r="9" fill="#fff" stroke="#c9a15a" stroke-width="3"/>' for x,y in [(-86,-14),(-62,-44),(-24,-58),(24,-58),(62,-44),(86,-14)]),
}

def svg(w, h, a, b, parts):
    body = "".join(f'<g transform="translate({x} {y}) scale({s})" filter="url(#sh)">{SHAPES[k]}</g>' for k,x,y,s in parts)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{defs(a,b)}<rect width="{w}" height="{h}" fill="url(#bg)"/><circle cx="{w*0.78}" cy="{h*0.2}" r="{h*0.28}" fill="#fff" opacity=".35"/>{body}</svg>'

def write(path, content):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w").write(content)

PRODUCTS = {
 "velvet-lipstick": ("lipstick", "#fbe9ec", "#f3c9d2"),
 "satin-gloss": ("gloss", "#fdf0ea", "#f6cfc4"),
 "silk-foundation": ("foundation", "#fbf1e8", "#efd5bf"),
 "rose-compact": ("compact", "#f9e8ee", "#efc3d0"),
 "golden-hour-palette": ("palette", "#fbefdc", "#ecd0a0"),
 "lengthening-mascara": ("mascara", "#f4eaee", "#dcc5d0"),
 "soft-blush-duo": ("blush", "#fdeceb", "#f5c6c4"),
 "brush-set": ("brush", "#f6eef1", "#e5d0d8"),
 "pearl-drop-earrings": ("earrings", "#f7f1e6", "#e9dcc0"),
 "layered-necklace": ("necklace", "#f6efe3", "#e8d6b3"),
 "stacking-rings": ("rings", "#f9eef0", "#ecd2d8"),
 "crystal-bracelet": ("bracelet", "#f3efe8", "#ddd2bd"),
}
for name,(shape,a,b) in PRODUCTS.items():
    write(f"products/{name}.svg", svg(600, 600, a, b, [(shape, 300, 320, 1.75)]))

write("collections/lips.svg", svg(600, 760, "#f9dfe5", "#e9a9b8", [("lipstick",210,430,1.9),("gloss",400,470,1.5)]))
write("collections/eyes-face.svg", svg(600, 760, "#fbefdc", "#e6c28e", [("palette",300,360,1.75),("mascara",170,600,1.2),("brush",450,610,1.2)]))
write("collections/jewelry.svg", svg(600, 760, "#f6efe3", "#dbc698", [("necklace",300,300,2.0),("earrings",300,580,1.4)]))
write("hero/hero.svg", svg(1000, 900, "#fbe9ec", "#efc2cd", [("lipstick",320,470,2.6),("rings",660,330,1.8),("compact",690,690,1.4)]))
write("hero/offer.svg", svg(900, 600, "#f3dfe5", "#c98b9d", [("bracelet",250,320,2.0),("earrings",640,310,1.9)]))
print("placeholders written to", os.path.abspath(OUT))
