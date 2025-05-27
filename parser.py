import psycopg2
conn = psycopg2.connect(database="discogs",
                      user="postgres",
                      password="First Principles",
                      host="localhost",
                      port="5432")
cur = conn.cursor()
cur.execute("SELECT country FROM release LIMIT 10;")
rows = cur.fetchall()
conn.commit()
conn.close()
for row in rows:
    print(row)
