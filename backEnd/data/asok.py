import psycopg2
import json

# To read a JSON file
data = [
    { "text": "Never", "questionId": 1 },
    { "text": "Rarely", "questionId": 1 },
    { "text": "Socially", "questionId": 1 },
    { "text": "Often", "questionId": 1 },
    { "text": "Dancing", "questionId": 4  },
    { "text": "Chatting","questionId": 4 },
    { "text": "Eating", "questionId": 4 },
    { "text": "At home", "questionId": 4 },
    { "text": "Aries", "questionId": 5 },
    { "text": "Taurus", "questionId": 5 },
    { "text": "Gemini" , "questionId": 5},
    { "text": "Cancer", "questionId": 5 },
    { "text": "Leo", "questionId": 5 },
    { "text": "Virgo", "questionId": 5 },
    { "text": "Libra", "questionId": 5 },
    { "text": "Scorpio", "questionId": 5 },
    { "text": "Sagittarius", "questionId": 5 },
    { "text": "Capricorn", "questionId": 5 },
    { "text": "Aquarius", "questionId": 5 },
    { "text": "Pisces", "questionId": 5 },
    { "text": "Regular Smoker", "questionId": 6 },
    { "text": "Social Smoker", "questionId": 6 },
    { "text": "Trying to Quit", "questionId": 6 },
    { "text": "Occasionally Smoke", "questionId": 6 },
    { "text": "Never Smoke", "questionId": 6 },
    { "text": "Casual", "questionId": 7  },
    { "text": "Trendy", "questionId": 7 },
    { "text": "Classic", "questionId": 7 },
    { "text": "Sporty", "questionId": 7 },
    { "text": "Regularly", "questionId": 8 },
    { "text": "Occasionally", "questionId": 8 },
    { "text": "Other", "questionId": 8 },
    { "text": "Never", "questionId": 8 },
    { "text": "Bachelor", "questionId": 9 },
    { "text": "University", "questionId": 9 },
    { "text": "High School", "questionId": 9 },
    { "text": "PhD", "questionId": 9 },
    { "text": "Graduate", "questionId": 9 },
    { "text": "Master", "questionId": 9 },
    { "text": "Trade school", "questionId": 9 },
    { "text": "Straight", "questionId": 10 },
    { "text": "Gay", "questionId": 10 },
    { "text": "Lesbian", "questionId": 10 },
    { "text": "Bisexual", "questionId": 10 },
    { "text": "Asexual", "questionId": 10 },
    { "text": "Demisexual", "questionId": 10 },
    { "text": "Pansexual", "questionId": 10 },
    { "text": "Queer", "questionId": 10 },
    { "text": "Questioning", "questionId": 10 },
    { "text": "Aromantic", "questionId": 10 },
    { "text": "Omnisexual", "questionId": 10 },
    { "text": "Yes", "questionId": 11 },
    { "text": "Maybe", "questionId": 11 },
    { "text": "No", "questionId": 11 },
    { "text": "Have children", "questionId": 11 },
    { "text": "Asian", "questionId": 12 },
    { "text": "Black", "questionId": 12 },
    { "text": "Mixed", "questionId": 12 },
    { "text": "White", "questionId": 12 },
    { "text": "Other", "questionId": 12 },
    { "text": "Fully", "questionId": 13 },
    { "text": "Partially", "questionId": 13 },
    { "text": "No", "questionId": 13 },
        { "text": "Words of Affirmation", "questionId": 3 },
                { "text": "Acts of Service", "questionId": 3 },
                        { "text": "Receiving Gifts", "questionId": 3 },
                                { "text": "Quality Time", "questionId": 3 },
                                        { "text": "Physical Touch", "questionId": 3 },
                                                { "text": "Workaholic", "questionId": 2 },
                                                { "text": "Balanced", "questionId": 2 },
                                                { "text": "Family-First", "questionId": 2 },
                                                { "text": "Flexible", "questionId": 2 },
                                                { "text": "Free Spirit", "questionId": 2 }
]

# Initialize connection
mydb = psycopg2.connect(
    host="localhost",
    user="flyleafadmin",
    password="Be5zPptVSkXpQl5r",
    database="flyleafdb"
)

mycursor = mydb.cursor()

sql = 'INSERT INTO "Answers" ("questionId", "text") VALUES (%s, %s)'
for answer in data:
    val = (answer['questionId'], answer['text'])
    mycursor.execute(sql, val)

# Commit the changes
mydb.commit()