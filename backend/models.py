from sqlalchemy import Column,Integer,String,Float
from database import Base


class CityData(Base):

    __tablename__="city_data"


    id=Column(Integer,primary_key=True)


    weather=Column(String)

    temperature=Column(Float)

    aqi=Column(Integer)

    traffic=Column(String)

    prediction=Column(String)