from pynput import mouse, keyboard
import requests
import threading
import time

SERVER_URL = 'http://localhost:5000/update_data'

def send_action(action):
    try:
        requests.post(SERVER_URL, json={'action': action})
    except Exception as e:
        print(f"Erreur d'envoi de l'action : {e}")

# Gestion des touches clavier
def on_press(key):
    try:
        if key.char == 'z':
            send_action('Z')
        elif key.char == 'q':
            send_action('Q')
        elif key.char == 's':
            send_action('S')
        elif key.char == 'd':
            send_action('D')
    except AttributeError:
        # Pour la touche espace (elle est spéciale)
        if key == keyboard.Key.space:
            send_action('Space')

# Gestion des clics souris
def on_click(x, y, button, pressed):
    if pressed:
        send_action('Click')

def start_listening():
    # Lancement des listeners en parallèle (clavier + souris)
    mouse_listener = mouse.Listener(on_click=on_click)
    keyboard_listener = keyboard.Listener(on_press=on_press)

    mouse_listener.start()
    keyboard_listener.start()

    mouse_listener.join()
    keyboard_listener.join()

if __name__ == "__main__":
    # Lancement dans un thread pour éviter de bloquer le programme principal
    thread = threading.Thread(target=start_listening)
    thread.start()

    # Garder le programme en vie
    while True:
        time.sleep(1)
