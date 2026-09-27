# ASSET BRIEF — What to Generate

The build works 100% procedurally with no assets. When you generate assets below and drop them into `public/assets/`, the loader picks them up automatically (must be served over http, e.g. `python3 -m http.server 8000`).

No pirated material — only use assets you have rights to.

---

## Priority 1 — AUDIO (highest impact)

Place in `public/assets/audio/`:

| File | Content | Notes |
|------|---------|-------|
| `DIALOGUE_JEAN_01.mp3` | "Are you Peter Parker or are you Spider-Man?" | |
| `DIALOGUE_PETER_01.mp3` | "I'm both." | |
| `DIALOGUE_PETER_02.mp3` | Peter apologizes about her sister | placeholder beat |
| `DIALOGUE_JEAN_02.mp3` | Jean acknowledges his loss | placeholder beat |
| `DIALOGUE_PETER_03.mp3` | Peter: losing someone ≠ alone | placeholder beat |
| `DIALOGUE_PETER_04.mp3` | "We can't do this alone." | |
| `DIALOGUE_JEAN_03.mp3` | "I have no one." | |
| `DIALOGUE_PETER_YOU_HAVE_ME.mp3` | **"You have me."** | the centerpiece |
| `DIALOGUE_PETER_INJURED.mp3` | "I'm fine." | weak voice |
| `DIALOGUE_PETER_OKAY.mp3` | "I'm okay." | |
| `DIALOGUE_JEAN_REACTION.mp3` | Jean calls his name repeatedly | |
| `DIALOGUE_JEAN_04.mp3` | "No." | |
| `DIALOGUE_PETER_GO.mp3` | "You gotta get outta here. They'll be looking for you." | |
| `DIALOGUE_JEAN_STAY.mp3` | "Stay with me." | |
| `DIALOGUE_PETER_05.mp3` | "You're gonna be okay." | |
| `DIALOGUE_PETER_JUST_GO.mp3` | "Just go." | |
| `DIALOGUE_PETER_06.mp3` | "Look at me." | |
| `DIALOGUE_HOSPITAL_NEWS.mp3` | news report — Spider-Man critical condition | |
| `DIALOGUE_PETER_WAKE.mp3` | "Where's my mask?" | |
| `DIALOGUE_PETER_JEAN.mp3` | "Where's Jean? Is she okay?" | |
| `DIALOGUE_JEAN_OKAY.mp3` | reassurance that she is okay | |
| `rain-loop.mp3` | rain ambience loop | |
| `gunshot.mp3` | single long-range shot | |
| `heartbeat.mp3` | slow heartbeat loop | |
| `music-pad.mp3` | quiet emotional score | optional |

**Style:** intimate, close-mic. "You have me" should land quiet and warm, not shouted. Post-shot lines: Peter breathy/weak, Jean desperate.

---

## Priority 2 — KEY STILLS (transparent PNG, portrait)

Place in `public/assets/peter/` and `public/assets/jean/`:

| File | Shot | Suggested size |
|------|------|----------------|
| `peter/peter-conversation.png` | Peter standing, calm, human — no hero pose | 1024×1536 |
| `peter/peter-lunge.png` | Peter lunging to shield Jean | 1024×1536 |
| `peter/peter-stagger.png` | Peter wounded, looking at chest, unstable | 1024×1536 |
| `peter/peter-kneel.png` | Peter collapsing to knees | 1024×1536 |
| `peter/peter-ground.png` | Peter lying on wet ground, barely moving | 1536×1024 |
| `jean/jean-isolated.png` | Jean alone, arms crossed, head down | 1024×1536 |
| `jean/jean-conversation.png` | Jean facing Peter | 1024×1536 |
| `jean/jean-reach.png` | Jean reaching toward him | 1024×1536 |
| `jean/jean-push.png` | Jean shoved out of bullet path | 1024×1536 |
| `jean/jean-kneel.png` | Jean kneeling beside Peter | 1024×1536 |

**Style guide:**
- Dark rainy rooftop night, characters as clean silhouettes / near-silhouette
- Palette: sky `#04060c→#131f2c`, city sodium `#d9a441`, cool `#7fb0c9`, suit `#0a0d12`
- Rim light from one side (cool blue) + subtle warm edge on the other
- Characters face each other: Jean looks right, Peter looks left (Peter on right third)
- Transparent background, figure's feet at the bottom edge of the frame

---

## Priority 3 — ENVIRONMENT + HOSPITAL

| File | Content |
|------|---------|
| `environment/sky.png` | night sky plate 1920×1080 |
| `environment/skyline-far.png` | far skyline silhouette 1920×1080 |
| `environment/skyline-mid.png` | mid skyline 1920×1080 |
| `environment/rooftop.png` | wet rooftop floor 1920×1080 |
| `hospital/hospital-room.png` | Bellevue room, clinical light 1920×1080 |
| `hospital/hospital-peter.png` | Peter in bed, mask on side table 1920×1080 |

**Hospital palette:** white `#e6ebf0`, gray `#c9d3dd`, soft blue `#b6c2d0` — completely different language from the rooftop.

---

## How to drop in

1. Put files in `public/assets/` (exact filenames above)
2. Serve: `python3 -m http.server 8000` in the project folder
3. Open `http://localhost:8000`
4. Assets replace placeholders automatically — same names, no code changes

## Where things appear (timeline)

- Jean alone → 5–12% · Peter enters → 12–21% · identity/"I'm both" → 21–31%
- Shared loss → 31–40% · "I have no one" → 40–49% · **"You have me" → 49–59.5%**
- Spider-sense → 64.5–66.5% · bullet → 66.5–67.5% · impact/blood → 67.5–71.5%
- Fall/reactions → 71.5–81.5% · ground → 81.5–89% · hospital → 93–97.5% · ending → 97.5–100%

Debug HUD: press `` ` `` to toggle (progress, scene, label, camera, FPS).
