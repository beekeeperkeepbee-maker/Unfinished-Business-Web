# Unfinished-Business-Web

🔗 **Live demo:** https://beekeeperkeepbee-maker.github.io/Unfinished-Business-Web/

A browser-based tracker that reminds you of your unfinished projects—and rewards you for finishing them (or shames you for quitting).

Built with HTML, CSS, and vanilla JavaScript as the web counterpart to my [Unfinished-Business Python project](https://github.com/beekeeperkeepbee-maker/Unfinished-Business).

### Why This Project Exists

After building the Python CLI version, I wanted to learn how to make the same idea work in a browser. Same soul, different language.

### How It Works

- The app shows your current list of unfinished projects.
- You can add new projects.
- Click "Finish" on any project to mark it complete — you'll be congratulated.
- The dashboard at the top shows your proud/encouraging status based on how many projects you've finished.
- **Delete:** Try to abandon a project, and the app forces you to write a 500-character letter of shame first.
- **Reminders:** Click "🔔 Enable Reminders" and allow the browser permission. The app uses a Service Worker to send a desktop notification 1 minute after you add a project. (In a future version, this will become a daily reminder.)
- **Trophy Case:** Finished projects are displayed at the bottom of the page with a checkmark and crossed out, so you can see your accomplishments.
- **Animations:** Projects slide in when added, fade out when finished, and pop into the trophy case.

### Roadmap

- [x] **Version 1.0** — Basic layout and project list display
- [x] **Version 1.1** — Add a new project (with browser storage)
- [x] **Version 1.2** — Mark a project as finished (with celebration message)
- [x] **Version 1.3** — Proud/encouraging dashboard message
- [x] **Version 1.4** — Delete a project (with the Shame Letter)
- [x] **Version 1.5** — Browser notification reminders (using a Service Worker)
- [x] **Version 2.0** — Visual polish (Finished Projects trophy case)
- [x] **Version 2.1** — Animations (slide-in, pop-in, fade-out)
- [x] **Version 2.2** — Slower, classier animations (0.6s+)
- [ ] **Version 3.0** — Connect to the Python backend for shared storage

### Built With

- HTML5
- CSS3 (custom properties, flexbox)
- Vanilla JavaScript (DOM manipulation, `localStorage` API)
