import requests
from pynput import mouse, keyboard
import threading

SERVER_URL = 'http://localhost:5000/update_data'

def send_action(action):
    try:
        requests.post(SERVER_URL, json={'action': action})
    except Exception as e:
        print(f"Erreur d'envoi de l'action : {e}")

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
        if key == keyboard.Key.space:
            send_action('Space')

def on_click(x, y, button, pressed):
    if pressed:
        send_action('Click')

def start_listening():
    mouse_listener = mouse.Listener(on_click=on_click)
    keyboard_listener = keyboard.Listener(on_press=on_press)

    mouse_listener.start()
    keyboard_listener.start()

    mouse_listener.join()
    keyboard_listener.join()

if __name__ == "__main__":
    thread = threading.Thread(target=start_listening)
    thread.start()
