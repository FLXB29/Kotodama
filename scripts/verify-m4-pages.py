import os
import pypdf
import pypdfium2 as pdfium
from PIL import Image

exams_info = [
    {"id": "toan-n3-202512-full", "session": "2025-12", "notice_pages": [22]},
    {"id": "toan-n3-202507-full", "session": "2025-07", "notice_pages": [19]},
    {"id": "toan-n3-202412-full", "session": "2024-12", "notice_pages": [23]},
    {"id": "toan-n3-202407-full", "session": "2024-07", "notice_pages": [21]},
    {"id": "toan-n3-202312-full", "session": "2023-12", "notice_pages": [23]},
    {"id": "toan-n3-202307-full", "session": "2023-07", "notice_pages": [17]},
    {"id": "toan-n3-202212-full", "session": "2022-12", "notice_pages": [14]},
    {"id": "toan-n3-202207-full", "session": "2022-07", "notice_pages": [14]},
    {"id": "toan-n3-202112-full", "session": "2021-12", "notice_pages": [22, 23]},
    {"id": "toan-n3-202107-full", "session": "2021-07", "notice_pages": [13]},
    {"id": "toan-n3-202012-full", "session": "2020-12", "notice_pages": [12]},
    {"id": "toan-n3-201912-full", "session": "2020-12", "notice_pages": [14]},
    {"id": "toan-n3-201907-full", "session": "2019-07", "notice_pages": [13]},
    {"id": "toan-n3-201812-full", "session": "2018-12", "notice_pages": [12]},
    {"id": "toan-n3-201807-full", "session": "2018-07", "notice_pages": [13]},
    {"id": "toan-n3-201712-full", "session": "2017-12", "notice_pages": [13]},
    {"id": "toan-n3-201707-full", "session": "2017-07", "notice_pages": [15]},
    {"id": "toan-n3-201612-full", "session": "2016-12", "notice_pages": [13]},
    {"id": "toan-n3-201607-full", "session": "2016-07", "notice_pages": [15]},
    {"id": "toan-n3-201512-full", "session": "2015-12", "notice_pages": [16]},
    {"id": "toan-n3-201507-full", "session": "2015-07", "notice_pages": [13]},
    {"id": "toan-n3-201412-full", "session": "2014-12", "notice_pages": [14]},
    {"id": "toan-n3-201407-full", "session": "2014-07", "notice_pages": [13]},
    {"id": "toan-n3-201312-full", "session": "2013-12", "notice_pages": [15]},
    {"id": "toan-n3-201307-full", "session": "2013-07", "notice_pages": [14]},
    {"id": "toan-n3-201212-full", "session": "2012-12", "notice_pages": [16]},
    {"id": "toan-n3-201207-full", "session": "2012-07", "notice_pages": [13]},
    {"id": "toan-n3-201112-full", "session": "2011-12", "notice_pages": [14]},
    {"id": "toan-n3-201107-full", "session": "2011-07", "notice_pages": [13]},
    {"id": "toan-n3-201007-full", "session": "2010-07", "notice_pages": [18]},
]

print("Verifying notice pages for all exams...")
for item in exams_info:
    pdf_name = f"n3-{item['id'].replace('toan-n3-', '').replace('-full', '')}-question.pdf"
    # match session
    parts = item['id'].replace('toan-n3-', '').replace('-full', '')
    y = parts[:4]
    m = parts[4:]
    pdf_path = f"tmp/original-question-pdfs/n3-{y}-{m}-question.pdf"
    if not os.path.exists(pdf_path):
        print(f"Missing PDF: {pdf_path}")
        continue
    reader = pypdf.PdfReader(pdf_path)
    print(f"\n--- {item['id']} ({y}-{m}) ---")
    for p in item['notice_pages']:
        if p <= len(reader.pages):
            text = (reader.pages[p - 1].extract_text() or '')[:80].replace('\n', ' ')
            print(f"  Page {p}/{len(reader.pages)}: {text}")
        else:
            print(f"  Page {p} OUT OF BOUNDS ({len(reader.pages)})")
