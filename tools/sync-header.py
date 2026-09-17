# -*- coding: utf-8 -*-
"""
Copia el menú oficial (shared/partials/header.html) a todas las páginas del sitio.

Uso (desde la raíz del proyecto):
  python tools/sync-header.py

No toca pages/legal/aviso-privacidad.html (usa otro encabezado).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTIAL = ROOT / "shared" / "partials" / "header.html"
HEADER_RE = re.compile(
    r"<header\s+class=\"header\"\s+id=\"header\">.*?</header>",
    re.DOTALL | re.IGNORECASE,
)

# Página → marca activa para aria-current (None = ninguna)
PAGES = [
    ("index.html", None),
    ("pages/adobe/home-adobe.html", "adobe"),
    ("pages/adobe/acrobat-studio.html", "adobe"),
    ("pages/adobe/creative-cloud.html", "adobe"),
    ("pages/autodesk/home-autodesk.html", "autodesk"),
    ("pages/autodesk/aec-collection.html", "autodesk"),
    ("pages/chaos/home-chaos.html", "chaos"),
    ("pages/dell/home-dell.html", "dell"),
    ("pages/hp/home-hp.html", "hp"),
]

ACTIVE = ' aria-current="page"'


def render(template: str, page_rel: str, active: str | None) -> str:
    is_root = page_rel == "index.html"
    root = "" if is_root else "../../"
    values = {
        "{{ROOT}}": root,
        "{{LOGO_HREF}}": "#" if is_root else f"{root}index.html",
        "{{INDEX_MARCAS}}": "#marcas" if is_root else f"{root}index.html#marcas",
        "{{INDEX_SERVICIOS}}": "#servicios" if is_root else f"{root}index.html#servicios",
        "{{INDEX_CASOS}}": "#casos" if is_root else f"{root}index.html#casos",
        "{{CONTACT_CLASSES}}": "textbutton-trigger",
        "{{ACTIVE_ADOBE}}": ACTIVE if active == "adobe" else "",
        "{{ACTIVE_AUTODESK}}": ACTIVE if active == "autodesk" else "",
        "{{ACTIVE_CHAOS}}": ACTIVE if active == "chaos" else "",
        "{{ACTIVE_HP}}": ACTIVE if active == "hp" else "",
        "{{ACTIVE_DELL}}": ACTIVE if active == "dell" else "",
    }
    out = template
    # Quitar el comentario del partial: solo el <header>...</header>
    m = HEADER_RE.search(out)
    if not m:
        raise SystemExit("No se encontró <header class=\"header\" id=\"header\"> en el partial.")
    out = m.group(0)
    for key, val in values.items():
        out = out.replace(key, val)
    if "{{" in out:
        leftover = sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", out)))
        raise SystemExit(f"Placeholders sin resolver en {page_rel}: {leftover}")
    return out


def main() -> None:
    template = PARTIAL.read_text(encoding="utf-8")
    updated = 0
    for rel, active in PAGES:
        path = ROOT / rel
        if not path.exists():
            print(f"SKIP missing {rel}")
            continue
        text = path.read_text(encoding="utf-8")
        if not HEADER_RE.search(text):
            print(f"SKIP no header block {rel}")
            continue
        new_header = render(template, rel, active)
        new_text, n = HEADER_RE.subn(new_header, text, count=1)
        if n != 1:
            print(f"SKIP replace failed {rel}")
            continue
        if new_text != text:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            print(f"OK  updated {rel}")
            updated += 1
        else:
            print(f"--  already synced {rel}")
    print(f"done ({updated} file(s) changed)")


if __name__ == "__main__":
    main()
