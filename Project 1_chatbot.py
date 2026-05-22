print("=== Simple Chatbot ===")

while True:

    user = input("\nYou: ")

    # Greetings
    if user == "hi" or user == "hello":
        print("Bot: Hello! How can I help you?")

    # Asking condition
    elif user == "how are you":
        print("Bot: I am fine. Thanks for asking!")

    # Asking name
    elif user == "what is your name":
        print("Bot: My name is ChatBot.")

    # Exit commands
    elif user == "bye" or user == "exit":
        print("Bot: Goodbye!")
        break

    # Unknown input
    else:
        print("Bot: Sorry, I don't understand.")