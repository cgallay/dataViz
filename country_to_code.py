import pandas as pd
import sys

if len(sys.argv) > 2:
    df = pd.read_csv("ISO_3166-1_alpha-3.csv")
    df['Country or Area'] = df['Country or Area'].apply(lambda s: s.lower())
    #print(df.head())
    df = df.set_index('Country or Area')
    df = df['ISO-alpha3 code']
    df2 = pd.read_csv(sys.argv[1])
    #print(df2.head())
    df2['ISO Code'] = df2[sys.argv[2]].apply(lambda s: s.lower()).replace(df.to_dict())
    df2.to_csv('output.csv') 

