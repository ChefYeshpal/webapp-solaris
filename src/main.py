from js import document
from pyodide import create_proxy

canvas = document.getElementById("gameCanvas")
ctx = canvas.getContext("2d")

# Game variables
player_x = 100
player_y = 300
player_width = 40
player_height = 20
bullets = []
enemiies = [{"x": 100, "y": 50}, {"x": 200, "y": 50}, {"x": 300, "y": 50}]