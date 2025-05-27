import psycopg2
import numpy as np
from countries_genres_styles import genre_list, country_list
conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")

master_matrix = np.zeros((len(genre_list), len(country_list)), dtype=int)
cur = conn.cursor()

for curr_country in range(len(country_list)):
    cur.execute(f"SELECT id FROM release WHERE country='{country_list[curr_country]}';")
    ids = cur.fetchall()
    for i in ids:
        cur.execute(f'SELECT genre FROM release_genre WHERE release_id={i[0]};')
        for j in cur.fetchall():
            for k in range(len(genre_list)):
                if j[0] == genre_list[k]:
                    master_matrix[k, curr_country] += 1
cur.close()
conn.close()
np.savetxt('test_master.csv', master_matrix, fmt='%d', delimiter=',')

