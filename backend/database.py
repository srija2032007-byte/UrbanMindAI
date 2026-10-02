import sqlite3
from datetime import datetime


DATABASE="city_data.db"



def create_table():

    conn=sqlite3.connect(DATABASE)

    cursor=conn.cursor()


    cursor.execute("""

    CREATE TABLE IF NOT EXISTS city_history(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        traffic TEXT,

        weather TEXT,

        aqi INTEGER,

        energy INTEGER,

        waste INTEGER,

        emergency TEXT,

        score INTEGER,

        time TEXT

    )

    """)


    conn.commit()

    conn.close()





def insert_data(
    traffic,
    weather,
    aqi,
    energy,
    waste,
    emergency,
    score
):


    conn=sqlite3.connect(DATABASE)

    cursor=conn.cursor()



    cursor.execute(

    """

    INSERT INTO city_history

    (
    traffic,
    weather,
    aqi,
    energy,
    waste,
    emergency,
    score,
    time
    )

    VALUES (?,?,?,?,?,?,?,?)

    """,

    (

    traffic,
    weather,
    aqi,
    energy,
    waste,
    emergency,
    score,
    datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    )


    )


    conn.commit()

    conn.close()





def get_history():


    conn=sqlite3.connect(DATABASE)


    cursor=conn.cursor()


    cursor.execute(

    """

    SELECT *

    FROM city_history

    ORDER BY id DESC

    LIMIT 20

    """

    )


    data=cursor.fetchall()


    conn.close()


    return data