import requests
from bs4 import BeautifulSoup

URL = "https://web.archive.org/web/20220810095106/https://blog.discogs.com/en/genres-and-styles/"
page = requests.get(URL)

soup = BeautifulSoup(page.content, "html.parser")

matched = []

# Find all genre names
genre_names = soup.find_all("h3", class_="arrow-down")
genres = []
for genre in genre_names:
    genres.append(genre.text.strip())
    matched.append([])
g_count = 0
# Find all styles and input them into a matrix
style_containers = soup.find_all("ul", class_="gsl-list")
for g in style_containers:
    styles = g.find_all("span", class_="gsl-artist")
    for style in styles:
        matched[g_count].append(style.text.strip())
        # print(f"{genres[g_count]}: {style.text.strip()}")
    g_count += 1

print(matched)