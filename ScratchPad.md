# Scratch Pad

A list of ideas and todos for the game.

## Ideas

The main idea is, that through playing, the weapons are primarily getting stronger instead of the player.

### Gameplay

- Player revives at the church.
- Every weapon and unit can level up on its own depending on achievments.
    - Getting first kill
    - Killing 10 enemies of a kind or in general
    - Killing specific bosses
    - Killing 100 enemies of a kind or in general
- Killing enemies drops resources and gives experience.
    - Specific boss loot (head of, eye of, etc.)
    - Gold, Wood, Iron, Crystals.
    - Lost Souls.
- Experience and level ups can improve the "user" slightly.
- Resources can be used to upgrade the village.
    - Monster Souls can be exchanged in the church for major upgrades to the player (beyond death).
        - (hidden to the player) The priest uses the souls to become stronger and stronger.
    - Wood can be used to add more houses to the village (increase passive gold).
    - Iron and Gold can be used to make small improvements to the sword by combining it with other swords.
- While adventuring the player gets older each tile he moves.
    - The player can die of old age.
    - Every year the player gets extra damage from "experience".
- On every death:
    - The player loses all resources and gets reset to level 1.
    - All tiles respawn minor enemies and resources (bosses do not respawn).


### Story / Progression

- A small village where the player starts, with a church and a few houses.
- Priest gives the player the first introduction and task to venture out.
- In the end Priest turns out to be the final boss and strength depends on the collected souls.

## Required Code-Systems

- Collision Tree (I have a lot of distant objects, so i can optimize the collision detection)
- Separte Building Collision Map with pathable areas (as building will rarely change position)
- AI for the enemy pathing
- Dialogue System
- Mini-Map
- Level Design (tile system)
