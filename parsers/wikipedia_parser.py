import requests
import json
import time
from main.parsers.countries_genres_styles import genre_list, style_list

genre_descriptions = {}

def get_wikipedia_title(query):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": f"{query} music",
        "format": "json"
    }
    response = requests.get(url, params=params)
    data = response.json()
    if data["query"]["search"]:
        return data["query"]["search"][0]["title"]
    else:
        return None
    
def get_wikipedia_summary(title):
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("extract")
    
def get_genre_blurb(genre_name):
    title = get_wikipedia_title(genre_name)
    if not title:
        return f"No wikipedia article found for {genre_name}"
    blurb = get_wikipedia_summary(title)
    return blurb or f"No summary found for {title}"

with open("main/public/genre_blurbs.json", "r", encoding="utf-8") as f:
    genre_descriptions = json.load(f)

# Parsing
for genre in genre_list:
    print(f"Processing: {genre}")
    title = get_wikipedia_title(genre)
    if title:
        summary = get_wikipedia_summary(title)
        if summary:
            genre_descriptions[genre] = {
                "title": title,
                "description": summary
            }
        else:
            genre_descriptions[genre] = {
                "title": title,
                "description": "No summary found"
            }
    else:
        genre_descriptions[genre] = {
            "title": None,
            "description": "No article found"
        }
    time.sleep(0.5)

# Save results to a file
with open("main/public/total_genre_blurbs.json", "w", encoding="utf-8") as f:
    json.dump(genre_descriptions, f, indent=4, ensure_ascii=False)

print("Done with genre_list")
