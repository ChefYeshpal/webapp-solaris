from js import document
from pyodide import create_proxy

canvas = document.getElementById("gameCanvas")
ctx = canvas.getContext("2d")

player_img = document.createElement("img")
player_img.src = "assets/player.png"
enemy_img = document.createElement("img")
enemy_img.src = "assets/enemy1.png"

# Game variables
player_x = 100
player_y = 300
bullets = []
enemies = [{"x": 100, "y": 50}]

def draw_player():
    if player_img.complete:
        ctx.drawImage(player_img, player_x, player_y, 40, 20)

def draw_enemies():
    if enemy_img.complete:
        for enemy in enemies:
            ctx.drawImage(enemy_img, enemy["x"], enemy["y"], 30, 20)

def draw_bullets():
    ctx.fillStyle = "yellow"
    for bullet in bullets:
        ctx.fillRect(bullet["x"], bullet["y"], 5, 10)

def game_loop():
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_player()
    draw_enemies()git status
    draw_bullets()

def key_down(event):
    global player_x
    if event.key == "ArrowLeft":
        player_x = max(0, player_x - 10)
    elif event.key == "ArrowRight":
        player_x = min(canvas.width - 40, player_x + 10)
    elif event.key == " ":
        bullets.append({"x": player_x + 20, "y": player_y})

document.addEventListener("keydown", create_proxy(key_down))

# Start game loop
from js import setInterval
setInterval(game_loop, 100)
