# 🎮 Retro RPG-Themed Portfolio Website

Welcome! This repository contains the source code for my personal **retro/pixel-art/video game–inspired portfolio website**.  
The site is both a professional portfolio and a creative coding project — designed to feel like you’re playing through a classic RPG, while still presenting my skills and experience in a recruiter-friendly way.

---

## 🚀 Live Demo

👉 [Add deployed site link here once hosted]

---

## ✨ Features

- **Landing Screen / Start Menu** → styled like a retro game intro with a “Press Start” button.
- **About Me** → displayed as an NPC dialogue box.
- **Skills Inventory** → grid of RPG-style skill items with pixel icons.
- **Experience Timeline** → designed as a level-up progression map.
- **Projects / Cartridge Shelf** → each project shown inside a cartridge-style card with pixel aesthetics.
- **Embedded YouTube Demo** → displayed in a CRT monitor frame with scanline effects.
- **Resume Download (Treasure Chest)** → standout button to grab my CV.
- **Achievements / Badges** → certifications & honors styled like RPG unlocks.
- **Easter Egg** → Konami code unlocks a secret Pong mini-game.
- **Theme Toggle** → day/night cycle instead of a generic switch.
- **Responsive & Accessible** → works on desktop and mobile with semantic HTML.

---

## 🛠️ Technologies Used

This project was built with a modern frontend stack while keeping the retro feel:

- **React (Vite)** → component-based structure, fast dev environment.
- **Tailwind CSS v4** → utility-first styling, with custom theme tokens for fonts and brand colors.
- **Framer Motion** → smooth transitions, CRT flicker, hover animations.
- **Custom Fonts** → [Pixel Game](https://www.dafont.com/pixel-game.font) for titles and branding, paired with a body font for readability.
- **React Bits** → curated set of reusable React components (to be used in later iterations for form handling, layout helpers, etc.).
- **Konami Code Hook** → small custom hook to detect the Easter egg.
- **Canvas API** → used for the Pong mini-game.

---

## 📂 Project Structure

src/
├── assets/ # images, background, fonts
├── components/ # reusable UI pieces (Section, InventoryItem, etc.)
├── App.jsx # main application
├── index.css # Tailwind + custom styles
└── ...
public/
├── cartridge.png # cartridge art for project shelf
└── ...

---

## 🎨 Design Choices

- **Pixel aesthetic**: heavy use of retro fonts, icons, and pixel art.
- **Green brand color (#1A786D)**: consistent across resume button, badges, and accents.
- **Accessibility**: text is always contrasted, and all sections work in both dark and light modes.
- **Professional + Playful**: While whimsical in theme, the structure follows recruiter expectations (About → Skills → Experience → Projects → Resume → Contact).

---

## 🔮 Future Plans

- Add more **React Bits** components to streamline forms and layouts.
- Expand the **Projects Shelf** with more cartridges and interactive hover states.
- Deploy via **GitHub Pages / Vercel / Netlify** for easy recruiter access.

---
