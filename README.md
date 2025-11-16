# webapp-solaris
Just the classic space invader game, why so? because the other option was to make a space engine which I *absolutely do not* know how to make within 10 hours. This week's siege theme was "space", and I think this game totally does come into the theme... why so?? it's og game literally HAS the word "space" in it!!!

## Controls
- `A/D` for left/right movement
- `SPACE` for shoothing
- `1/2/3` for selecting projectile/lazer/bomb

## Tech Stack
- **HTML5** - Game structure
- **CSS** - Styling & layout
- **JavaScript** - Game logic & mechanics

## Credits
- Art
    - By yours truly
    
## Here's a list...
- [x] Game window
    - [x] 4:3 aspect ratio
- [x] Player
    - [x] Movable with `wasd`
    - [x] Fire with `space`
- [x] Enemys
    - [x] Smol guys, kill with 1 shot
    - [x] Mid guys, kill with 2 shots
    - [x] High guys, kill with 5 shots
    - [x] Have a random generation pattern for infinite levels
- [x] Projectiles panel
    - [x] Normal projectiles
    - [x] Lazers
    - [x] Bomb
- [ ] Stat panel
    - [x] Lives left (Starts with 5)
    - [x] Info on points
- [x] Game over screen
    - [x] Restart button
    - [x] Funy response heh

## Devlogs
- 11 Nov 2025
    - Created this repository
    - Added the base files
        - Added basic code in `index.html`, `styles.css`, and `main.py`
    - Debated if I wanna use `js` or `py`
        - I'll try python first... lets see how that goes
- 12 Nov 2025
    - Changed the `py` file to `js`, i'm committed to learning js now.
    - Added `game-container` to always be of 4:3 ratio
    - Added player
        - `wasd` movement
        - `space` to shoot
    - Added enemy
        - Just `assets/enemy1.png` for now, will add higher ones later on
        - Enemy moves left-right
- 13 Nov 2025
    - Fixed issue with mis-match on level numbers
        - Game showed current level to be +1 than what the start level screen showed
    - Updated enemy spawning numbers, smol
    - Added enemy 2
        - Shoots 2 projecties a few thingues apart
        - Needs 3 shots to kill
    - Added game over screen
        - Gotta add a funy responses heh
- 14 Nov 2025
    - Added enemy 3
        - Chonky boi
        - Needs 5 shots to kill
        - Shoots 3x2 projectiles
    - Added left panel
        - Has different projectiles
    - Added game over responses
    - Added lazer
        - 20 points/sec
    - Added enemy 4
        - Even more chonki boi
        - Fires a lazer
        - Can only die from a lazer or a bomb pellet
- 15 Nov 2025
    - Updated enemy4 to show cooldown
    - Also it shows when they're gonna shoot next
    - Tried to fix the border of the `game-container`, gave up soon enough
- 16 Nov 2025
    - Updated enemy spawning to be a little more earlier
        - It just felt dragged out for some reason, and couldn't reach enemy4 easily
        - The players need to know pain.
    - 
