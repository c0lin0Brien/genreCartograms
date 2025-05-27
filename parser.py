import psycopg2
conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")
cur = conn.cursor()
cur.execute("SELECT id FROM release WHERE country='Sweden' LIMIT 10000;")
ids = cur.fetchall()
# Genre list
genre_list = ['Blues', 'Brass & Military', "Children's", 'Classical', 'Electronic',
              'Folk, World, & Country', 'Funk / Soul', 'Hip Hop', 'Jazz', 'Latin',
              'Non-Music', 'Pop', 'Reggae', 'Rock', 'Stage & Screen']
genre_counts = [0] * len(genre_list)
for i in ids:
    cur.execute(f'SELECT genre FROM release_genre WHERE release_id={i[0]};')
    for j in cur.fetchall():
        for k in range(len(genre_list)):
            # print(f"j[0]: {j[0]}, genre_list[k]: {genre_list[k]}")
            if j[0] == genre_list[k]:
                genre_counts[k] += 1
cur.close()
conn.close()
print(genre_counts)

