import { languagesList } from "./languages";

export const questionsList = [
    {
      id: 1,
      question: 'Your drinking habits?',
      shortForm: 'Drinking',
      answers: [
        'Don’t drink',
        'Drink socially',
        'Occasionally',
        'Regularly',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/drink.png"
    },  
    {
      id: 2,
      question: 'Early bird or night owl?',
      shortForm: 'Sleep Cycle',
      answers: [
        'Early bird',
        'Night owl',
        'Both',
        'Neither',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/sleep.png"
    },
    {
      id: 3,
      question: 'Your preferred season?',
      shortForm: 'Season',
      answers: [
        'Spring',
        'Summer',
        'Fall',
        'Winter',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/season.png"
    },
    {
      id: 4,
      question: 'At a party, you are?',
      shortForm: 'Party Behavior',
      answers: [
        'Dancing',
        'Chatting',
        'Eating',
        'At home',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/party.png"
    },
    {
      id: 5,
      question: 'Your star sign?',
      shortForm: 'Zodiac',
      answers: [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/zodiac.png"
    },
    {
      id: 6,
      question: 'Smoking habits?',
      shortForm: 'Smoking',
      answers: [
        'Regular smoker',
        'Social smoker',
        'Quitting',
        'Occasional',
        'Non-smoker',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/smoking.png"
    },  
    {
      id: 7,
      question: 'Describe your fashion.',
      shortForm: 'Fashion',
      answers: [
        'Casual',
        'Trendy',
        'Classic',
        'Sporty',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/fashion.png"
    },
    {
      id: 8,
      question: 'Visit the gym?',
      shortForm: 'Gym',
      answers: [
        'Regularly',
        'Sometimes',
        'Other exercise',
        'No exercise',
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/gym.png"
    },
    {
      id: 9,
      question: 'Highest education level?',
      shortForm: 'Education',
      answers: [
        'Bachelor',
        'University',
        'High School',
        'PhD',
        'Graduate',
        'Master',
        'Trade school'
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/education.png"
    },
    {
      id: 10,
      question: 'Open to dating?',
      shortForm: 'Dating',
      answers: ['Male', 'Female', 'Non-Binary'],
    },
    {
      id: 11,
      question: 'Relationship goal?',
      shortForm: 'Goal',
      answers: ['Relationship', 'Friendship', 'Exploring'],
    },
    {
      id: 12,
      question: 'Gender identity?',
      shortForm: 'Gender',
      answers: [
        {
          id: 1,
          gender: "Male",
          extra: [
            'Intersex man',
            'Trans man',
            'Transmasculine',
            'Man and Nonbinary',
            'Cis man',
          ],
        },
        {
          id: 2,
          gender: "Female",
          extra: [
            'Intersex woman',
            'Trans woman',
            'Transfeminine',
            'Woman and Nonbinary',
            'Cis woman',
          ]
        },
        {
          id: 3,
          gender: "Non-Binary",
          extra: [
            'Agender',
            'Bigender',
            'Genderfluid',
            'Genderqueer',
            'Gender nonconforming',
            'Gender questioning',
            'Gendervariant',
            'Intersex',
            'Neutrois',
            'Nonbinary man',
            'Nonbinary woman',
            'Pangender',
            'Polygender',
            'Transgender',
            'Two-spirit',
          ]
        }
      ]
    },
    {
      id: 13,
      question: 'Sexual orientation?',
      shortForm: 'Orientation',
      answers: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual', 'Demisexual', 'Pansexual', 'Queer', 'Questioning', 'Aromantic', 'Omnisexual']
    },
    {
      id: 14,
      question: 'Languages spoken?',
      shortForm: 'Languages',
      answers: languagesList.map(language => {
        let names = language.name.split(';');
        return {
          ...language,
          name: names[0].trim(),
        };
      }),
    },
    {
      id: 15,
      question: 'Want children?',
      shortForm: 'Children',
      answers: [
        'Yes',
        'Maybe',
        'No',
        'Have children'
      ],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/babies.png"
    },
    {
      id: 16,
      question: 'Your ethnicity?',
      shortForm: 'Ethnicity',
      answers: ['Asian', 'Black', 'Mixed', 'White', 'Other'],
      icon: "ethnicity"
    },
    {
      id: 17,
      question: 'COVID vaccination?',
      shortForm: 'Vaccine',
      answers: ['Fully', 'Partially', 'Not'],
      icon: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/vaccine.png"
    }
  ];
  