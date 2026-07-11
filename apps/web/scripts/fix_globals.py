from pathlib import Path
p=Path(__file__).resolve().parent.parent / 'app' / 'globals.css'
s=p.read_text(encoding='utf-8')
start = s.find('\n.hero-background-glow {')
if start==-1:
    print('no hero-background-glow found')
else:
    # find end of that block (first occurrence of '\n}\n\n' after start)
    end = s.find('\n}\n\n', start)
    if end==-1:
        print('could not find end of hero block')
    else:
        block = s[start:end+3]
        # remove block
        s2 = s[:start] + s[end+4:]
        # find insertion point: before '.dark .hero-video-layer::before {'
        insert_point = s2.find('\n.dark .hero-video-layer::before {')
        if insert_point==-1:
            insert_point = s2.find('\n.hero-video-layer::after {')
            if insert_point==-1:
                print('no suitable insertion point found; abort')
            else:
                s2 = s2[:insert_point] + '\n' + block + s2[insert_point:]
                p.write_text(s2, encoding='utf-8')
                print('moved block before hero-video-layer::after')
        else:
            s2 = s2[:insert_point] + '\n' + block + s2[insert_point:]
            p.write_text(s2, encoding='utf-8')
            print('moved block before .dark .hero-video-layer::before')
