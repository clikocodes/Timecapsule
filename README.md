# Timecapsule
Project
<br>
File

import os
import datetime

# Simulated Murf API Call (since real Murf API requires paid key and access)
def convert_text_to_ai_voice(text, voice_id="en_us_001"):
    print("[INFO] Converting text to AI voice (simulated)...")
    # Simulate voice generation
    file_name = f"output_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.mp3"
    with open(file_name, 'w') as f:
        f.write("[SIMULATED AUDIO FILE]\n" + text)
    return file_name

# Function to save a time capsule message
def save_time_capsule():
    print("\n--- Time Capsule Voice Message ---")
    user_name = input("Enter your name: ")
    message = input("Write your message for the future: ")
    delivery_date = input("Enter the date to open this (YYYY-MM-DD): ")

    try:
        datetime.datetime.strptime(delivery_date, "%Y-%m-%d")
    except ValueError:
        print("[ERROR] Invalid date format. Use YYYY-MM-DD.")
        return

    print("[INFO] Generating voice file using Murf AI...")
    voice_file = convert_text_to_ai_voice(message)

    # Store the message info in a simple text log
    with open("time_capsule_log.txt", "a") as log:
        log.write(f"{user_name},{delivery_date},{voice_file}\n")

    print(f"[SUCCESS] Your time capsule has been created as {voice_file}\n")

# Function to view stored capsules
def view_capsules():
    if not os.path.exists("time_capsule_log.txt"):
        print("[INFO] No time capsules found.")
        return

    print("\n--- Stored Time Capsules ---")
    with open("time_capsule_log.txt", "r") as log:
        for line in log:
            name, date, file = line.strip().split(",")
            print(f"From: {name} | Open on: {date} | File: {file}")

# Main Menu
def main():
    while True:
        print("\n===== Time Capsule Menu =====")
        print("1. Create a new time capsule")
        print("2. View existing capsules")
        print("3. Exit")
        choice = input("Enter your choice (1/2/3): ")

        if choice == '1':
            save_time_capsule()
        elif choice == '2':
            view_capsules()
        elif choice == '3':
            print("Exiting Time Capsule App. Goodbye!")
            break
        else:
            print("Invalid choice. Please select 1, 2, or 3.")

if __name__ == "__main__":
    main()

