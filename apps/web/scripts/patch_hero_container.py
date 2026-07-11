from pathlib import Path
p=Path(__file__).resolve().parent.parent / 'components' / 'landing' / 'Hero.tsx'
s=p.read_text(encoding='utf-8')
old='className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10"'
new='className="relative z-10 w-full grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-0"'
if old in s:
    s=s.replace(old,new)
    p.write_text(s,encoding='utf-8')
    print('container updated')
else:
    print('container string not found')
