from pathlib import Path
p=Path(__file__).resolve().parent.parent / 'app' / 'globals.css'
s=p.read_text(encoding='utf-8')
start = s.find('\n.hero-video-layer::after {')
end_marker = '\n\n.dark .hero-video-layer::before {'
end = s.find(end_marker)
if start==-1 or end==-1:
    print('start or end marker not found', start, end)
else:
    replacement = '''\n.hero-video-layer::after {\n  content: "";\n  position: absolute;\n  inset: auto -15% 0 -15%;\n  height: 45%;\n  background:\n    repeating-linear-gradient(0deg, rgba(37, 99, 235, 0.12) 0 1px, transparent 1px 24px),\n    linear-gradient(180deg, transparent, rgba(37, 99, 235, 0.1));\n  transform: perspective(700px) rotateX(58deg) translateY(18%);\n  transform-origin: bottom;\n  animation: gridDrift 14s linear infinite;\n}\n\n.hero-background-glow {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  background: radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.22), transparent 22%),\n    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.18), transparent 18%),\n    radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.14), transparent 30%);\n  opacity: 0.95;\n  pointer-events: none;\n  filter: blur(30px);\n}\n\n.typewriter-text {\n  position: relative;\n}\n.typewriter-text::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 0.15em;\n  height: 1.1em;\n  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.2));\n  animation: typewriter-cursor 0.8s steps(1) infinite;\n}\n\n@keyframes typewriter-cursor {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0; }\n}\n\n.hero-console-panel {\n  pointer-events: none;\n}\n\n'''
    new = s[:start] + replacement + s[end+2:]
    p.write_text(new, encoding='utf-8')
    print('Cleaned globals.css between markers')
