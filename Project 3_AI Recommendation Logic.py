from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Dataset (items with descriptions)
items = {
    "Interstellar": "space sci-fi time travel drama",
    "Inception": "dream sci-fi mind thriller",
    "Titanic": "romance drama historical love story",
    "Avengers": "action superhero marvel fight",
    "The Notebook": "romance emotional drama love",
    "Gravity": "space survival drama astronaut",
    "The Dark Knight": "action superhero crime batman",
    "Her": "romance ai emotional future technology"
}

# Convert data into list format
titles = list(items.keys())
descriptions = list(items.values())

# Combine TF-IDF model
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(descriptions)

def recommend(user_input):
    # Transform user input into vector
    user_vec = vectorizer.transform([user_input])

    # Calculate similarity
    similarity = cosine_similarity(user_vec, tfidf_matrix)

    # Sort results
    scores = list(enumerate(similarity[0]))
    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)

    print("\nTop Recommendations:\n")

    found = False
    for idx, score in sorted_scores:
        if score > 0:
            print(f"{titles[idx]} (match: {round(score, 2)})")
            found = True

    if not found:
        print("No good recommendations found.")

# Main program
print("=== AI-Based Recommendation System ===")
user_input = input("Enter your interests (e.g. space, romance, AI): ").lower()

recommend(user_input)