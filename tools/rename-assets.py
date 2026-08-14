# -*- coding: utf-8 -*-
import re
from pathlib import Path

root = Path(r"c:\Users\emiliano.gonzalez\Downloads\CADGRAFICS_pag_web")

old_dir = root / "assets/images/images_home_CADGRAFICS"
new_dir = root / "assets/images/images_home-cadgrafics"
if old_dir.exists() and not new_dir.exists():
    old_dir.rename(new_dir)
    print("renamed folder ->", new_dir.name)
elif new_dir.exists():
    print("folder already exists", new_dir.name)

for p in (root / "assets/images").rglob("*"):
    if not p.is_file():
        continue
    name = p.name
    new = name.replace("éxito", "exito").replace("Éxito", "exito")
    new = re.sub(r"caso_exito_(\d+)", r"caso-exito-\1", new)
    new = re.sub(r"caso_exito(\.)", r"caso-exito\1", new)
    if new != name:
        dest = p.with_name(new)
        if dest.exists():
            print("SKIP exists", dest)
        else:
            p.rename(dest)
            print("file", p.name, "->", new)

# Also rename video folders to kebab-case
video_renames = {
    "videos-acrobat_studio": "videos-acrobat-studio",
    "videos-creative_cloud": "videos-creative-cloud",
    "videos-home_adobe": "videos-home-adobe",
    "videos-home_autodesk": "videos-home-autodesk",
}
video_root = root / "assets/video"
for old, new in video_renames.items():
    src = video_root / old
    dst = video_root / new
    if src.exists() and not dst.exists():
        src.rename(dst)
        print("video folder", old, "->", new)
    elif dst.exists():
        print("video folder ok", new)

print("done")
