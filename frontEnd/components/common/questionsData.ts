import { icons } from "../../assets";
import { languagesList } from "./languagesList";

export const questionsList = [
  {
    id: 1,
    question: 'What best describes your drinking habits?',
    answers: [
      'I don’t drink at all',
      'I drink socially',
      'I enjoy a drink now and then',
      'I drink regularly',
    ],
    icon: icons.drink
  },  
  {
    id: 2,
    question: 'Are you more of an early bird or a night owl?',
    answers: [
      'Definitely an early bird',
      'Absolutely a night owl',
      'I can adapt to both',
      'Neither, I love my sleep',
    ],
    icon: icons.sleep
  },
  {
    id: 3,
    question: 'Which season fits your personality best?',
    answers: [
      'The freshness of Spring',
      'The warmth of Summer',
      'The colors of Fall',
      'The chill of Winter',
    ],
    icon: icons.season
  },
  {
    id: 4,
    question: "You're at a party, where can we find you?",
    answers: [
      'Dancing near the music',
      'Chatting with everyone',
      'Sampling all the food',
      'At home, I prefer quiet evenings',
    ],
    icon: icons.party
  },
  {
    id: 5,
    question: 'What is your star sign?',
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
    icon: icons.zodiac
  },
  {
    id: 6,
    question: 'What best describes your smoking habits?',
    answers: [
      'I smoke regularly',
      'I smoke socially',
      'I am trying to quit',
      'I am an occasional smoker',
      'I do not smoke',
    ],
    icon: icons.smoking
  },  
  {
    id: 7,
    question: 'Tell us about your fashion sense',
    answers: [
      'Casual and comfortable',
      'Trendy and stylish',
      'Classic and elegant',
      'Sporty and functional',
    ],
    icon: icons.fashion
  },
  {
    id: 8,
    question: 'Do you go to the gym?',
    answers: [
      'Yes, regularly',
      'Sometimes',
      'No, but I exercise in other ways',
      'No, I do not exercise',
    ],
    icon: icons.gym
  },
  {
    id: 9,
    question: 'What is your highest level of education?',
    answers: [
      'Bachelor degree',
      'At uni',
      'High School',
      'PhD',
      'On a graduate programme',
      'Master degree',
      'Trade school'
    ],
    icon: icons.education
  },
  {
    id: 10,
    question: "Who are you open to dating?",
    answers: ['Male', 'Female', 'Non-Binary'],
  },
  {
    id: 11,
    question: "What's your relationship goal?",
    answers: ['Relationship', 'Friendship', 'Exploring'],
  },
  {
    id: 12,
    question: "What's your gender identity?",
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
    question: "What is your sexual orientation?",
    answers: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual', 'Demisexual', 'Pansexual', 'Queer', 'Questioning', 'Aromantic', 'Omnisexual']
  },
  {
    id: 14,
    question: "What languages do you speak?",
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
    question: 'Do you want babies in the future?',
    answers: [
      'Yes, definitely',
      'Maybe, I am not sure yet',
      'No, I do not want children',
      'I already have children'
    ],
    icon: icons.babies
  }
];

export const interestsList = {
  question: 'What are your interests?',
  answers: [
    // Fitness and Health
    {
      title: 'Fitness and Health',
      interests: [
        'Running',
        'Hiking',
        'Yoga',
        'Weightlifting',
        'Cycling',
        'Dancing',
        'Nutrition',
      ],
    },

    // Arts and Culture
    {
      title: 'Arts and Culture',
      interests: [
        'Painting',
        'Theater',
        'Music',
        'Photography',
        'Literature',
        'Sculpture',
        'Ballet',
      ],
    },

    // Tech and Science
    {
      title: 'Tech and Science',
      interests: [
        'Coding',
        'Astronomy',
        'Robotics',
        'Data Science',
        'AI and Machine Learning',
        'Environmental Science',
        'Electronics',
      ],
    },

    // Travel and Adventure
    {
      title: 'Travel and Adventure',
      interests: [
        'Backpacking',
        'Camping',
        'City tours',
        'Food tourism',
        'Mountain Climbing',
        'Scuba Diving',
        'Wildlife Safari',
      ],
    },

    // Food and Drinks
    {
      title: 'Food and Drinks',
      interests: [
        'Cooking',
        'Baking',
        'Wine tasting',
        'Beer brewing',
        'Vegetarian cuisine',
        'Asian cuisine',
        'Mediterranean cuisine',
      ],
    },

    // Sports
    {
      title: 'Sports',
      interests: [
        'Football',
        'Basketball',
        'Baseball',
        'Tennis',
        'Golf',
        'Swimming',
        'Volleyball',
      ],
    },

    // Hobbies and Crafts
    {
      title: 'Hobbies and Crafts',
      interests: [
        'Knitting',
        'Pottery',
        'Gardening',
        'DIY projects',
        'Model building',
        'Calligraphy',
        'Origami',
      ],
    },

    // Entertainment
    {
      title: 'Entertainment',
      interests: [
        'Movies',
        'Music',
        'Video Games',
        'Board Games',
        'Magic and Illusion',
        'Stand-up comedy',
        'Concerts',
      ],
    },

    // Lifestyle
    {
      title: 'Lifestyle',
      interests: [
        'Meditation',
        'Minimalism',
        'Pet care',
        'Sustainability',
        'Fashion',
        'Home decor',
        'Volunteering',
      ],
    },

    // Education and Personal Development
    {
      title: 'Education and Personal Development',
      interests: [
        'Public speaking',
        'Language learning',
        'Writing',
        'Reading',
        'Professional development',
        'Entrepreneurship',
        'Personal finance',
      ],
    },
  ],
};
