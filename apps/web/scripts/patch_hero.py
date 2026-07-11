from pathlib import Path

root = Path(__file__).resolve().parent.parent
hero_path = root / 'components' / 'landing' / 'Hero.tsx'
globals_path = root / 'app' / 'globals.css'

print('Hero path:', hero_path)
print('Globals path:', globals_path)

hero = hero_path.read_text(encoding='utf-8')

# Full-bleed section class
hero = hero.replace(
    'className="relative isolate flex min-h-screen w-full items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8"',
    'className="relative isolate flex min-h-screen w-full items-center overflow-hidden px-0 pb-12 pt-20 sm:pt-28 lg:px-0"'
)

# Add hero-background-glow div after hero-video-layer
hero = hero.replace(
    '<div className="hero-video-layer" aria-hidden="true" />\n      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />',
    '<div className="hero-video-layer" aria-hidden="true" />\n      <div className="hero-background-glow" aria-hidden="true" />\n      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />'
)

# Insert typewriter text after h1
needle = ('          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.03] tracking-tight text-[color:var(--landing-text)] sm:text-6xl lg:text-7xl">\n'
          '            One Platform.\n'
          '            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">\n'
          '              Unlimited Businesses.\n'
          '            </span>\n'
          '          </h1>\n')

if needle in hero:
    hero = hero.replace(needle, needle + "          <div className=\"mt-5 overflow-hidden text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 sm:text-2xl typewriter-text\">\n            Power every restaurant, retail store, hotel, salon, healthcare and warehouse with one cinematic command center.\n          </div>\n")
else:
    print('Heading needle not found; skipping typewriter insertion')

# Make left/right columns equal (6/6)
hero = hero.replace('scroll-reveal lg:col-span-5', 'scroll-reveal lg:col-span-6')
hero = hero.replace('scroll-reveal relative lg:col-span-7', 'scroll-reveal relative lg:col-span-6')

# Remove max-w on right panel
hero = hero.replace('className="relative mx-auto max-w-3xl">', 'className="relative w-full">')

hero_path.write_text(hero, encoding='utf-8')
print('Patched Hero.tsx')

# Patch globals.css
css = globals_path.read_text(encoding='utf-8')
if '.hero-background-glow' not in css:
    insert_point = '  animation: videoLightning 11s ease-in-out infinite;\n}\n\n.hero-video-layer::after {'
    css_insert = '''
.hero-background-glow {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.22), transparent 22%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.18), transparent 18%),
    radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.14), transparent 30%);
  opacity: 0.95;
  pointer-events: none;
  filter: blur(30px);
}

.typewriter-text {
  position: relative;
}

.typewriter-text::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 0.15em;
  height: 1.1em;
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.2));
  animation: typewriter-cursor 0.8s steps(1) infinite;
}

@keyframes typewriter-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-console-panel {
  pointer-events: none;
}
'''
    if insert_point in css:
        css = css.replace(insert_point, insert_point + css_insert)
        globals_path.write_text(css, encoding='utf-8')
        print('Patched globals.css')
    else:
        print('CSS insert point not found; skipping')
else:
    print('globals already contains hero styles')

print('Done')
