import codecs
import glob
import re
import os
import json
import base64

def bundle_all():
    print("Starting bundle...")

    # 1. Read all data files and combine into one inline script
    data_files = sorted(glob.glob('e:/a-a-pharmacy/data/part*.js'))
    all_data_js = ""
    all_drugs_parts = []
    
    for f in data_files:
        part_name = os.path.basename(f).replace('.js', '').replace('part', 'PART').upper() + '_DATA'
        with codecs.open(f, 'r', 'utf-8') as fp:
            content = fp.read()
        all_data_js += content + "\n"
        all_drugs_parts.append(f"...(window.{part_name} || [])")
    
    # 2. Read app.js
    with codecs.open('e:/a-a-pharmacy/app.js', 'r', 'utf-8') as f:
        app_js = f.read()
    
    # 3. Read index.html
    with codecs.open('e:/a-a-pharmacy/index.html', 'r', 'utf-8') as f:
        html = f.read()
    
    # 4. Build a self-contained icon as a base64 green pill emoji SVG
    icon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#020617"/>
  <text x="50" y="75" text-anchor="middle" font-size="65">💊</text>
  <text x="50" y="95" text-anchor="middle" font-size="9" fill="#10b981" font-family="Arial" font-weight="bold">Rx</text>
</svg>'''
    icon_b64 = base64.b64encode(icon_svg.encode()).decode()
    icon_data_uri = f"data:image/svg+xml;base64,{icon_b64}"
    
    # 5. Inline manifest as data URI
    manifest = {
        "name": "PharmaPocket EG",
        "short_name": "PharmaPocket",
        "start_url": ".",
        "display": "standalone",
        "background_color": "#020617",
        "theme_color": "#059669",
        "description": "دليل صيدلاني مصري للأصناف والجرعات",
        "icons": [
            {"src": icon_data_uri, "sizes": "192x192", "type": "image/svg+xml"},
            {"src": icon_data_uri, "sizes": "512x512", "type": "image/svg+xml"}
        ]
    }
    manifest_json = json.dumps(manifest, ensure_ascii=False)
    manifest_b64 = base64.b64encode(manifest_json.encode()).decode()
    manifest_data_uri = f"data:application/json;base64,{manifest_b64}"
    
    # 6. Strip the <script src="data/..."> and <script src="app.js"> tags from HTML
    # Replace manifest.json link
    html = html.replace('href="manifest.json"', f'href="{manifest_data_uri}"')
    html = html.replace('href="icon.png"', f'href="{icon_data_uri}"')
    
    # Remove all external script tags for data/partX.js and app.js
    html = re.sub(r'\s*<script src="data/part\d+\.js"></script>', '', html)
    html = re.sub(r'\s*<script src="app\.js"></script>', '', html)
    
    # 7. Inject all inline scripts before </body>
    inline_scripts = f"""
    <!-- Bundled Data -->
    <script>
{all_data_js}
    </script>
    
    <!-- Bundled App Logic -->
    <script>
{app_js}
    </script>
"""
    html = html.replace('</body>', inline_scripts + '\n</body>')
    
    # 8. Write to output
    out_path = 'e:/a-a-pharmacy/PharmaPocket_Bundle.html'
    with codecs.open(out_path, 'w', 'utf-8') as f:
        f.write(html)
    
    size_kb = os.path.getsize(out_path) // 1024
    print(f"Bundle complete: {out_path}")
    print(f"File size: {size_kb} KB ({size_kb/1024:.1f} MB)")
    print(f"Ready to share!")

bundle_all()
