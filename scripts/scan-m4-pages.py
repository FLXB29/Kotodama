import os
import pypdf
import json

drafts_path = 'reports/n3-quality-audit/source-import-draft.json'
with open(drafts_path, 'r', encoding='utf-8') as f:
    drafts = json.load(f)

results = []
pdf_dir = 'tmp/original-question-pdfs'

for d in drafts:
    exam_id = d['examId']
    session_key = d['exam'].replace('/', '-')
    pdf_name = f"n3-{session_key}-question.pdf"
    pdf_path = os.path.join(pdf_dir, pdf_name)
    
    if not os.path.exists(pdf_path):
        print(f"Missing PDF for {exam_id}: {pdf_path}")
        continue
    
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
    m4_pages = []
    for idx, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ''
        except Exception:
            text = ''
        
        # Look for indicators of Mondai 4 / Mondai 7 / notices
        has_m7 = '問題 7' in text or '問題7' in text or '問題 4' in text or '問題4' in text
        has_notice_lead = any(kw in text for kw in ['の案内である', 'のお知らせである', 'ポスターである', '広告である', 'ホームページに', '席の利用案内'])
        has_table_words = any(kw in text for kw in ['利用案内', '募集', '休館日', '料金', '日程', '申込方法', '日時：', '日時:'])
        
        if has_m7 or (has_notice_lead and idx > total_pages - 10) or (has_table_words and idx > total_pages - 8):
            m4_pages.append((idx + 1, len(text), text[:60].replace('\n', ' ')))
            
    print(f"\n{exam_id} ({total_pages} pages):")
    for p_num, length, snippet in m4_pages[-5:]:
        print(f"  Page {p_num} (len {length}): {snippet}")
    results.append({
        'examId': exam_id,
        'session': session_key,
        'pdf': pdf_name,
        'totalPages': total_pages,
        'candidatePages': [p[0] for p in m4_pages]
    })

with open('tmp/m4_scan_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
