import os
import pypdfium2 as pdfium
from PIL import Image

output_dir = 'public/assets/jlpt/dokkai'
os.makedirs(output_dir, exist_ok=True)

configs = [
    {"id": "toan-n3-202512-full", "session": "2025_12", "pdf": "n3-2025-12-question.pdf", "pages": [22]},
    {"id": "toan-n3-202507-full", "session": "2025_07", "pdf": "n3-2025-07-question.pdf", "pages": [19]},
    {"id": "toan-n3-202412-full", "session": "2024_12", "pdf": "n3-2024-12-question.pdf", "pages": [23]},
    {"id": "toan-n3-202407-full", "session": "2024_07", "pdf": "n3-2024-07-question.pdf", "pages": [21]},
    {"id": "toan-n3-202312-full", "session": "2023_12", "pdf": "n3-2023-12-question.pdf", "pages": [23]},
    {"id": "toan-n3-202307-full", "session": "2023_07", "pdf": "n3-2023-07-question.pdf", "pages": [17]},
    {"id": "toan-n3-202212-full", "session": "2022_12", "pdf": "n3-2022-12-question.pdf", "pages": [14]},
    {"id": "toan-n3-202207-full", "session": "2022_07", "pdf": "n3-2022-07-question.pdf", "pages": [14]},
    {"id": "toan-n3-202112-full", "session": "2021_12", "pdf": "n3-2021-12-question.pdf", "pages": [22, 23]},
    {"id": "toan-n3-202107-full", "session": "2021_07", "pdf": "n3-2021-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-202012-full", "session": "2020_12", "pdf": "n3-2020-12-question.pdf", "pages": [12]},
    {"id": "toan-n3-201912-full", "session": "2019_12", "pdf": "n3-2019-12-question.pdf", "pages": [14]},
    {"id": "toan-n3-201907-full", "session": "2019_07", "pdf": "n3-2019-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201812-full", "session": "2018_12", "pdf": "n3-2018-12-question.pdf", "pages": [13]},
    {"id": "toan-n3-201807-full", "session": "2018_07", "pdf": "n3-2018-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201712-full", "session": "2017_12", "pdf": "n3-2017-12-question.pdf", "pages": [13]},
    {"id": "toan-n3-201707-full", "session": "2017_07", "pdf": "n3-2017-07-question.pdf", "pages": [15]},
    {"id": "toan-n3-201612-full", "session": "2016_12", "pdf": "n3-2016-12-question.pdf", "pages": [13]},
    {"id": "toan-n3-201607-full", "session": "2016_07", "pdf": "n3-2016-07-question.pdf", "pages": [15]},
    {"id": "toan-n3-201512-full", "session": "2015_12", "pdf": "n3-2015-12-question.pdf", "pages": [16]},
    {"id": "toan-n3-201507-full", "session": "2015_07", "pdf": "n3-2015-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201412-full", "session": "2014_12", "pdf": "n3-2014-12-question.pdf", "pages": [14]},
    {"id": "toan-n3-201407-full", "session": "2014_07", "pdf": "n3-2014-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201312-full", "session": "2013_12", "pdf": "n3-2013-12-question.pdf", "pages": [15]},
    {"id": "toan-n3-201307-full", "session": "2013_07", "pdf": "n3-2013-07-question.pdf", "pages": [14]},
    {"id": "toan-n3-201212-full", "session": "2012_12", "pdf": "n3-2012-12-question.pdf", "pages": [16]},
    {"id": "toan-n3-201207-full", "session": "2012_07", "pdf": "n3-2012-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201112-full", "session": "2011_12", "pdf": "n3-2011-12-question.pdf", "pages": [14]},
    {"id": "toan-n3-201107-full", "session": "2011_07", "pdf": "n3-2011-07-question.pdf", "pages": [13]},
    {"id": "toan-n3-201007-full", "session": "2010_07", "pdf": "n3-2010-07-question.pdf", "pages": [19]},
]

def crop_margins(im):
    # Crop outer header (top 5%) and footer (bottom 5%) to remove JLPT header / page number
    top_margin = int(im.height * 0.05)
    bottom_margin = int(im.height * 0.05)
    side_margin = int(im.width * 0.04)
    return im.crop((side_margin, top_margin, im.width - side_margin, im.height - bottom_margin))

print(f"Exporting Mondai 4 notice images for all {len(configs)} exams...")
success_count = 0

for item in configs:
    pdf_path = os.path.join('tmp/original-question-pdfs', item['pdf'])
    if not os.path.exists(pdf_path):
        print(f"ERROR: Missing PDF {pdf_path}")
        continue
    
    pdf = pdfium.PdfDocument(pdf_path)
    rendered_images = []
    
    for p_num in item['pages']:
        if p_num <= len(pdf):
            page = pdf[p_num - 1]
            # Render at 2.0 scale (crisp 150-200 DPI)
            im = page.render(scale=2.0).to_pil()
            im = crop_margins(im)
            rendered_images.append(im)
    
    if not rendered_images:
        print(f"ERROR: Could not render pages for {item['id']}")
        continue
        
    out_filename = f"m4_{item['session']}.png"
    out_path = os.path.join(output_dir, out_filename)
    
    if len(rendered_images) == 1:
        rendered_images[0].save(out_path, optimize=True)
    else:
        # Stitch vertically for multi-page notices (like 2021-12 A and B)
        total_height = sum(img.height for img in rendered_images)
        max_width = max(img.width for img in rendered_images)
        stitched = Image.new('RGB', (max_width, total_height), color=(255, 255, 255))
        y_offset = 0
        for img in rendered_images:
            stitched.paste(img, (0, y_offset))
            y_offset += img.height
        stitched.save(out_path, optimize=True)
        
    file_size = os.path.getsize(out_path)
    print(f"[OK] {item['session']} -> {out_filename} ({file_size // 1024} KB)")
    success_count += 1

print(f"\nCompleted! {success_count}/{len(configs)} notice images generated in {output_dir}")
