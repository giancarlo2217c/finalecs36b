import csv
import nltk
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import requests
import operator

def clean_tweet(tweet, stemmer=PorterStemmer(), stop_words=set(stopwords.words('english'))):

    words = word_tokenize(tweet.lower())

    filtered_words = []

    for word in words:
        if word not in stop_words and word.isalpha():
            filtered_words.append(stemmer.stem(word))

    return filtered_words

def word_count(words):
    counts = dict()
    
    for word in words:
        if(word != "http"):
            if word in counts:
                counts[word] += 1
            else:
                counts[word] = 1
        
    return counts

listOfTweets = []

with open('tweets.csv', newline='') as csvfile:
    tokens = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for row in tokens:
        tweet = ' '.join(row)
        clnTweet = clean_tweet(tweet)
        listOfTweets.append(clnTweet)
    
# print(listOfTweets)

flatList = []

for item in listOfTweets:
    for initem in item:
        flatList.append(initem)

wordCounts = word_count(flatList)
max_word = max(wordCounts.items(), key=operator.itemgetter(1))[0]
print(max_word);

json = { 'word': max_word}

url = 'http://localhost:5000/search'
x = requests.post(url, data = json)




