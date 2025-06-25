import pandas as pd
import psycopg2
import numpy as np
import csv
from main.parsers.countries_genres_styles import style_list, country_list

conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")

style_matrix = np.zeros((len(country_list), (len(style_list) + 1)), dtype=int)
cur = conn.cursor()

def style_parser():
    for curr_country in range(len(country_list)):
        print(f"Now fetching styles for {country_list[curr_country]}...")
        # Get all ids for current country
        cur.execute(f"SELECT id FROM release WHERE country='{country_list[curr_country]}';")
        ids = cur.fetchall()
        for i in ids:
            # Find corresponding styles for each id
            cur.execute(f'SELECT style FROM release_style WHERE release_id={i[0]};')
            for j in cur.fetchall():
                for k in range(len(style_list)):
                    if j[0] == style_list[k]:
                        style_matrix[curr_country, k+1] += 1
    cur.close()
    conn.close()
    np.savetxt('country_styles.csv', style_matrix, fmt='%d', delimiter=',')

# After manually adding header row and column, labeling country column from country list
def country_labeler():
    df = pd.read_csv('/Users/colin/Documents/Projects/genreToScale/empty_country.csv')
    df['COUNTRY'] = country_list
    df.to_csv('labeled_styles.csv', index=False)

# Labeling header row with respective style
style_header = ["COUNTRY_NAME"]
for style in style_list:
    label = style.upper()
    # Handle spaces and hyphens in labels
    if " " in label or "-" in label:
        new_label = ""
        for c in label:
            if c == " " or c == "-":
                new_label += "_"
            else:
                new_label += c
        style_header.append(new_label)
    else:
        style_header.append(label)

# Read the original CSV
with open('/Users/colin/Documents/Projects/genreToScale/main/public/country_styles.csv', 'r', newline='') as infile:
    reader = list(csv.reader(infile))
    data = reader[1:]  # skip empty header

# Write the CSV with the new header
with open('/Users/colin/Documents/Projects/genreToScale/main/public/country_styles_labeled.csv', 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(style_header) # Header
    writer.writerows(data) # Data