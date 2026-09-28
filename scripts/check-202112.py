import pypdf

reader = pypdf.PdfReader('tmp/original-question-pdfs/n3-2021-12-question.pdf')
print('2021-12 total pages:', len(reader.pages))
for i in range(len(reader.pages)):
    t = reader.pages[i].extract_text() or ''
    if len(t) > 0:
        clean = t[:50].replace('\n', ' ')
        print(f'Page {i+1}: {len(t)} chars: {clean}')
    else:
        print(f'Page {i+1}: EMPTY text (scanned image)')
