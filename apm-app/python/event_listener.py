import requests
from pynput import mouse, keyboard
import threading

SERVER_URL = 'http://localhost:5000/update_data'
IS_TRAINING = False

def send_action(action):
    global IS_TRAINING
    if IS_TRAINING:
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

def start_training():
    global IS_TRAINING
    try:
        response = requests.post('http://localhost:5000/start_training')
        if response.status_code == 200:
            IS_TRAINING = True
            print("Entraînement démarré.")
        else:
            print("Erreur lors du démarrage de l'entraînement.")
    except Exception as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    thread = threading.Thread(target=start_listening)
    thread.start()
    
    start_training()
