# HerSpace x HU Khidmat — React Version

This is a React (Vite) conversion of the original single-file `Index.html` / `style.css` / `script.js`
website. The design, content, layout, and responsiveness are unchanged — only the implementation
was split into `.jsx` components, one per page section, plus one per modal.

## Structure

```
src/
  App.jsx                  # Assembles all sections + holds shared state (drawer, modals, lang, etc.)
  main.jsx                 # React entry point
  style.css                # Original stylesheet, untouched
  data/
    blogsData.js           # Blog content used by Blogs.jsx and BlogModal.jsx
  components/
    Header.jsx              # Nav bar + mobile drawer
    Hero.jsx                 # Hero section (#home)
    AboutStrip.jsx           # About strip (#about)
    AboutUs.jsx              # About Us overview (#about-us)
    Thematic.jsx             # Thematic areas (#thematic)
    Mission.jsx              # Mission / Belief cards
    Supporters.jsx           # Supporters strip
    Approach.jsx              # Our Approach (#approach)
    Join.jsx                  # Join the Movement CTA
    Internships.jsx           # Internship opportunities (#internships)
    Blogs.jsx                 # Blogs section (#blogs)
    Newsletter.jsx             # Newsletter signup
    Footer.jsx                 # Footer (#contact)
    DonateModal.jsx            # Donate modal
    VolunteerModal.jsx         # Volunteer application modal
    ApplyModal.jsx              # Internship application modal
    BlogModal.jsx                # Blog "read more" modal
public/
  assets/                    # All original images, copied as-is
```

## Behavior parity with the original `script.js`

Every function from `script.js` was translated into React state + handlers in `App.jsx`,
then passed down as props:

| Original function        | React equivalent                                  |
|---------------------------|-----------------------------------------------------|
| `scrollToId(id)`          | `scrollToId(id)` helper (same `getElementById` + `scrollIntoView`) |
| `openDrawer` / `closeDrawer` | `drawerOpen` state on `App`                     |
| `openDonate` / `closeDonate` | `donateOpen` state, `DonateModal`               |
| `openVolunteer` / `closeVolunteer` | `volunteerOpen` state, `VolunteerModal`   |
| `openApply(role)` / `closeApply` | `applyOpen` + `applyRole` state, `ApplyModal` |
| `selectAmount(btn)`       | local `activeAmount` state inside `DonateModal`     |
| `toggleLang()`            | `langLabel` state on `App`                          |
| `openAdmin()`              | inline `alert(...)`                                |
| `blogsData` / `openBlog(idx)` / `closeBlog` | `data/blogsData.js` + `blogOpen`/`blogIndex` state, `BlogModal` |
| `body.classList.add('no-scroll')` | `useEffect` toggling `document.body.classList` whenever the drawer or any modal is open |

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build into dist/
```

No other dependencies (routing, state libraries, CSS frameworks) were introduced —
this mirrors the original vanilla HTML/CSS/JS site as closely as possible, just
componentized into JSX.
