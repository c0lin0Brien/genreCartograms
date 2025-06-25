import psycopg2
import numpy as np
import csv
import pandas as pd
from main.parsers.countries_genres_styles import genre_list, country_list
conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")

genre_matrix = np.zeros((len(genre_list), len(country_list)), dtype=int)

# Created matrix of countries and genre counts
def parser_one():
    for curr_country in range(len(country_list)):
        cur.execute(f"SELECT id FROM release WHERE country='{country_list[curr_country]}';")
        ids = cur.fetchall()
        for i in ids:
            cur.execute(f'SELECT genre FROM release_genre WHERE release_id={i[0]};')
            for j in cur.fetchall():
                for k in range(len(genre_list)):
                    if j[0] == genre_list[k]:
                        genre_matrix[k, curr_country] += 1
    cur.close()
    conn.close()
    np.savetxt('test_master.csv', genre_matrix, fmt='%d', delimiter=',')

# Honestly I forget what this one did but I think it added the country value into the new column
def parser_two():
    df = pd.read_csv('../test_master_with_genres_transposed.csv')
    df['COUNTRY'] = country_list
    df.to_csv('../updated_master.csv', index=False)
