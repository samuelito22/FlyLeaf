import json

# Your questions and answe

# Convert JSON to Python objects
questions = [
  {
    "question": "Your drinking habits?",
    "shortForm": "Drinking",
    "answers": [
      { "text": "Don’t drink" },
      { "text": "Drink socially" },
      { "text": "Occasionally" },
      { "text": "Regularly" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/drink.png",
    "type": "Advanced"
  },
  {
    "question": "Early bird or night owl?",
    "shortForm": "Sleep Cycle",
    "answers": [
      { "text": "Early bird" },
      { "text": "Night owl" },
      { "text": "Both" },
      { "text": "Neither" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/sleep.png",
    "type": "Advanced"
  },
  {
    "question": "Your preferred season?",
    "shortForm": "Season",
    "answers": [
      { "text": "Spring" },
      { "text": "Summer" },
      { "text": "Fall" },
      { "text": "Winter" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/season.png",
    "type": "Advanced"
  },
  {
    "question": "At a party, you are?",
    "shortForm": "Party Behavior",
    "answers": [
      { "text": "Dancing" },
      { "text": "Chatting" },
      { "text": "Eating" },
      { "text": "At home" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/party.png",
    "type": "Advanced"
  },
  {
    "question": "Your star sign?",
    "shortForm": "Zodiac",
    "answers": [
      { "text": "Aries" },
      { "text": "Taurus" },
      { "text": "Gemini" },
      { "text": "Cancer" },
      { "text": "Leo" },
      { "text": "Virgo" },
      { "text": "Libra" },
      { "text": "Scorpio" },
      { "text": "Sagittarius" },
      { "text": "Capricorn" },
      { "text": "Aquarius" },
      { "text": "Pisces" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/zodiac.png",
    "type": "Advanced"
  },
  {
    "question": "Smoking habits?",
    "shortForm": "Smoking",
    "answers": [
      { "text": "Regular smoker" },
      { "text": "Social smoker" },
      { "text": "Quitting" },
      { "text": "Occasional" },
      { "text": "Non-smoker" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/smoking.png",
    "type": "Advanced"
  },
  {
    "question": "Describe your fashion.",
    "shortForm": "Fashion",
    "answers": [
      { "text": "Casual" },
      { "text": "Trendy" },
      { "text": "Classic" },
      { "text": "Sporty" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/fashion.png",
    "type": "Advanced"
  },
  {
    "question": "Visit the gym?",
    "shortForm": "Gym",
    "answers": [
      { "text": "Regularly" },
      { "text": "Sometimes" },
      { "text": "Other exercise" },
      { "text": "No exercise" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/gym.png",
    "type": "Advanced"
  },
  {
    "question": "Highest education level?",
    "shortForm": "Education",
    "answers": [
      { "text": "Bachelor" },
      { "text": "University" },
      { "text": "High School" },
      { "text": "PhD" },
      { "text": "Graduate" },
      { "text": "Master" },
      { "text": "Trade school" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/education.png",
    "type": "Advanced"
  },
  {
    "question": "Relationship goal?",
    "shortForm": "Goal",
    "answers": [
      { "text": "Relationship" },
      { "text": "Friendship" },
      { "text": "Exploring" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/objective.png",
    "type": "Basic"
  },
  {
    "question": "Sexual orientation?",
    "shortForm": "Orientation",
    "answers": [
      { "text": "Straight" },
      { "text": "Gay" },
      { "text": "Lesbian" },
      { "text": "Bisexual" },
      { "text": "Asexual" },
      { "text": "Demisexual" },
      { "text": "Pansexual" },
      { "text": "Queer" },
      { "text": "Questioning" },
      { "text": "Aromantic" },
      { "text": "Omnisexual" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/sexual-orientation.png",
    "type": "Basic"
  },
  {
    "question": "Want children?",
    "shortForm": "Children",
    "answers": [
      { "text": "Yes" },
      { "text": "Maybe" },
      { "text": "No" },
      { "text": "Have children" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/babies.png",
    "type": "Advanced"
  },
  {
    "question": "Your ethnicity?",
    "shortForm": "Ethnicity",
    "answers": [
      { "text": "Asian" },
      { "text": "Black" },
      { "text": "Mixed" },
      { "text": "White" },
      { "text": "Other" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/ethnicity.png",
    "type": "Basic"
  },
  {
    "question": "COVID vaccination?",
    "shortForm": "Vaccine",
    "answers": [
      { "text": "Fully" },
      { "text": "Partially" },
      { "text": "Not" }
    ],
    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/vaccine.png",
    "type": "Basic"
  }
]

text_to_id = [{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd116"
  },
  "text": "Don’t drink"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd117"
  },
  "text": "Drink socially"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd118"
  },
  "text": "Occasionally"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd119"
  },
  "text": "Regularly"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11a"
  },
  "text": "Early bird"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11b"
  },
  "text": "Night owl"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11c"
  },
  "text": "Both"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11d"
  },
  "text": "Neither"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11e"
  },
  "text": "Spring"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd11f"
  },
  "text": "Summer"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd120"
  },
  "text": "Fall"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd121"
  },
  "text": "Winter"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd122"
  },
  "text": "Dancing"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd123"
  },
  "text": "Chatting"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd124"
  },
  "text": "Eating"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd125"
  },
  "text": "At home"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd126"
  },
  "text": "Aries"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd127"
  },
  "text": "Taurus"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd128"
  },
  "text": "Gemini"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd129"
  },
  "text": "Cancer"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12a"
  },
  "text": "Leo"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12b"
  },
  "text": "Virgo"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12c"
  },
  "text": "Libra"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12d"
  },
  "text": "Scorpio"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12e"
  },
  "text": "Sagittarius"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd12f"
  },
  "text": "Capricorn"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd130"
  },
  "text": "Aquarius"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd131"
  },
  "text": "Pisces"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd132"
  },
  "text": "Regular smoker"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd133"
  },
  "text": "Social smoker"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd134"
  },
  "text": "Quitting"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd135"
  },
  "text": "Occasional"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd136"
  },
  "text": "Non-smoker"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd137"
  },
  "text": "Casual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd138"
  },
  "text": "Trendy"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd139"
  },
  "text": "Classic"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13a"
  },
  "text": "Sporty"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13b"
  },
  "text": "Regularly"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13c"
  },
  "text": "Sometimes"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13d"
  },
  "text": "Other exercise"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13e"
  },
  "text": "No exercise"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd13f"
  },
  "text": "Bachelor"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd140"
  },
  "text": "University"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd141"
  },
  "text": "High School"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd142"
  },
  "text": "PhD"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd143"
  },
  "text": "Graduate"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd144"
  },
  "text": "Master"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd145"
  },
  "text": "Trade school"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd146"
  },
  "text": "Relationship"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd147"
  },
  "text": "Friendship"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd148"
  },
  "text": "Exploring"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd149"
  },
  "text": "Straight"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14a"
  },
  "text": "Gay"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14b"
  },
  "text": "Lesbian"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14c"
  },
  "text": "Bisexual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14d"
  },
  "text": "Asexual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14e"
  },
  "text": "Demisexual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd14f"
  },
  "text": "Pansexual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd150"
  },
  "text": "Queer"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd151"
  },
  "text": "Questioning"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd152"
  },
  "text": "Aromantic"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd153"
  },
  "text": "Omnisexual"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd154"
  },
  "text": "Yes"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd155"
  },
  "text": "Maybe"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd156"
  },
  "text": "No"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd157"
  },
  "text": "Have children"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd158"
  },
  "text": "Asian"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd159"
  },
  "text": "Black"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15a"
  },
  "text": "Mixed"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15b"
  },
  "text": "White"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15c"
  },
  "text": "Other"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15d"
  },
  "text": "Fully"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15e"
  },
  "text": "Partially"
},
{
  "_id": {
    "$oid": "64ef57ee75df8c73408bd15f"
  },
  "text": "Not"
}]

# Create a dictionary for easy lookup of text to ID
text_to_id_dict = {item['text']: item['_id']['$oid'] for item in text_to_id}

# Loop through questions and replace answers with their corresponding IDs
for question in questions:
    object_ids = []
    for answer in question['answers']:
        answer_text = answer['text']
        if answer_text in text_to_id_dict:
            object_ids.append(text_to_id_dict[answer_text])
        else:
            print(f"Warning: '{answer_text}' not found in mapping")
    
    question['answers'] = object_ids  # Replacing 'answers' with an array of objectIds

# Convert back to JSON
questions_with_ids_json = json.dumps(questions, indent=2)
print(questions_with_ids_json)