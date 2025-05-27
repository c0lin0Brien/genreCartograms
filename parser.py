import psycopg2
conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")
cur = conn.cursor()
cur.execute("SELECT id FROM release WHERE country='Sweden' LIMIT 3;")
ids = cur.fetchall()
genre_list = []
style_list = []
for i in ids:
    cur.execute(f'SELECT genre FROM release_genre WHERE release_id={i[0]};')
    for j in cur.fetchall():
        genre_list.append(j[0])
    cur.execute(f'SELECT style FROM raw_styles WHERE release_id={i[0]}')
    for j in cur.fetchall():
        style_list.append(j[0])
cur.close()
conn.close()
for i in genre_list:
    print(i)
for j in style_list:
    print(j)
