# -*- coding: utf-8 -*-
"""
Utilidad histórica / de mantenimiento de nombres de archivos.

La estructura actual de assets es por marca (espejo de pages/):

  assets/images/brand/
  assets/images/index/
  assets/images/{marca}/home/   (y subcarpetas de producto)
  assets/video/index/
  assets/video/{marca}/...

Usa este script solo para renombrar archivos sueltos (espacios, acentos).
No recrea la estructura antigua images-home-* / videos-*.
"""
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

for base in (root / "assets/images", root / "assets/video"):
    if not base.exists():
        continue
    for p in base.rglob("*"):
        if not p.is_file() or p.name == ".gitkeep":
            continue
        name = p.name
        new = name.replace("éxito", "exito").replace("Éxito", "exito")
        new = re.sub(r"caso_exito_(\d+)", r"caso-exito-\1", new)
        new = re.sub(r"caso_exito(\.)", r"caso-exito\1", new)
        new = new.replace(" ", "-")
        if new != name:
            dest = p.with_name(new)
            if dest.exists():
                print("SKIP exists", dest.relative_to(root))
            else:
                p.rename(dest)
                print("file", p.relative_to(root), "->", new)

print("done")
