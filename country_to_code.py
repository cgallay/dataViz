import pandas as pd
import sys
from optparse import OptionParser

def main():
    parser = OptionParser()
    parser.add_option("--in", "--input", dest="input",
                    help="read input from FILE", metavar="FILE")
    parser.add_option("--out", "--output", dest="output", default="output.csv",
                    help="write output to FILE", metavar="FILE")
    parser.add_option("--col", "--column", dest="column", type="string",
                    help="column name containing the Country information in file input", metavar="values")
    
    (options, args) = parser.parse_args()

    if options.input and options.column:
        df = pd.read_csv("ISO_3166-1_alpha-3.csv")
        df['Country or Area'] = df['Country or Area'].apply(lambda s: s.lower())
        unique_set = set(df['Country or Area'].unique())
        df = df.set_index('Country or Area')
        df = df['ISO-alpha3 code']
        df2 = pd.read_csv(options.input)
        df2[options.column] = df2[options.column].apply(lambda s: s.lower())
        unique_set2 = set(df2[options.column].unique())    
        print("diff")  
        print(unique_set2 - unique_set)
        df2['ISO Code'] = df2[options.column].replace(df.to_dict())
        df2.to_csv(options.output)
    else:
        parser.print_help()
        sys.exit()

if __name__ == "__main__":
    main()