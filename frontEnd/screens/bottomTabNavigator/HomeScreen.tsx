import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeContainer, UserProfileCard, HomeHeader, Loading} from '../../components';
import {icons, images} from '../../assets';
import {NavigationProp} from '@react-navigation/native';
import {TYPES} from '../../constants';
import { useSelector } from 'react-redux';

type LocationData = {
  latitude: number;
  longitude: number;
};

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
    const currentUserId =
    useSelector((state: TYPES.AppState) => state.usersReducer.currentUserId) ||
    null;



  return (
    <SafeContainer>
      <HomeHeader />
        {!currentUserId ? <Loading.ActiveIndicator modalBackground={{backgroundColor:"transparent"}}/> : 
      <View style={homeScreenStyles.container}>
      
        <UserProfileCard
        moveable={true}
          userData={{
            "location": {coordinates: {longitude: 5, latitude: 5}, city: "Durham"},
            "_id": "64f878e989281bd215d18bcb",
            "username": "Samuelito",
            "gender": {
                "primary": "Male",
                "secondary": "Cis man"
            },
            "instagram": [
              {
                  "id": "18001475398607220",
                  "url": "https://scontent.cdninstagram.com/v/t51.29350-15/328839568_734245981469883_6855777819993679843_n.webp?stp=dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=ZGntD89JgGAAX9xn0vJ&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfAyBzNwtRXHFvi2CA-JiVd6rbnTaPjOT_K2_3J4oGAh6A&oe=64EB6783"
              },
              {
                  "id": "17856273320448528",
                  "url": "https://scontent.cdninstagram.com/v/t51.29350-15/145268070_134576531844982_4038986848759752931_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=WldWpUSq1JoAX8TAdH-&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfDRhoxqbQPXFesfKhbRQzltQCKqPwEOEl2VE8olZpENuA&oe=64EAF44E"
              }
          ],
            "height":{feets: "6", inches: "1"},
            "interests": [
                {
                    "_id": "64ec96b475df8c73408bd076",
                    "name": "Hiking",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/knot.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd078",
                    "name": "Weightlifting",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/exercise.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd079",
                    "name": "Cycling",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/bicycle.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd07a",
                    "name": "Dancing",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/dance.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd07b",
                    "name": "Nutrition",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/vegan.png"
                }
            ],
            "relationshipGoal": "Relationship",
            "seeking": [
                "Female"
            ],
            "dateOfBirth": "2003-02-04T00:00:00.000Z",
            "verified": false,
            "lastActive": "2023-09-06T13:04:42.490Z",
            "__v": 0,
            "pictures": [
                {
                    "_id": "64f878eb89281bd215d18bdb",
                    "name": "64f878e989281bd215d18bcb/picture-0.jpg",
                    "blurLevel": 0.75,
                    "url": "https://flyleaf-pictures.s3.eu-west-2.amazonaws.com/64f878e989281bd215d18bcb/picture-0.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVVZPRTR3LQD32VEO%2F20230906%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230906T130540Z&X-Amz-Expires=86400&X-Amz-Signature=16f6c7a6cb70fa708088dd7c85f01207c076bd50d88d8d380ec11bf145dd54e1&X-Amz-SignedHeaders=host"
                },
                {
                    "_id": "64f878eb89281bd215d18bdc",
                    "name": "64f878e989281bd215d18bcb/picture-1.jpg",
                    "blurLevel": 0.75,
                    "url": "https://flyleaf-pictures.s3.eu-west-2.amazonaws.com/64f878e989281bd215d18bcb/picture-1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVVZPRTR3LQD32VEO%2F20230906%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230906T130540Z&X-Amz-Expires=86400&X-Amz-Signature=80deb4abfddee64fbf0a8fdcc6e14c9ed722a34412ac7976c44a355d4da81944&X-Amz-SignedHeaders=host"
                }
            ],
            "additionalInformation": [
              {
                  "question": "At a party, you are?",
                  "questionShortForm": "Party Behavior",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/party.png",
                  "questionType": "Advanced",
                  "answer": "Dancing"
              },
              {
                  "question": "Your drinking habits?",
                  "questionShortForm": "Drinking",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/drink.png",
                  "questionType": "Advanced",
                  "answer": "Drink socially"
              },
              {
                  "question": "Smoking habits?",
                  "questionShortForm": "Smoking",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/smoking.png",
                  "questionType": "Advanced",
                  "answer": "Social smoker"
              },
              {
                  "question": "Your preferred season?",
                  "questionShortForm": "Season",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/season.png",
                  "questionType": "Advanced",
                  "answer": "Fall"
              },
              {
                  "question": "Describe your fashion.",
                  "questionShortForm": "Fashion",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/fashion.png",
                  "questionType": "Advanced",
                  "answer": "Trendy"
              },
              {
                  "question": "Visit the gym?",
                  "questionShortForm": "Gym",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/gym.png",
                  "questionType": "Advanced",
                  "answer": "Sometimes"
              },
              {
                  "question": "Highest education level?",
                  "questionShortForm": "Education",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/education.png",
                  "questionType": "Advanced",
                  "answer": "High School"
              },
              {
                  "question": "Want children?",
                  "questionShortForm": "Children",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/babies.png",
                  "questionType": "Advanced",
                  "answer": "Maybe"
              },
              {
                  "question": "Your star sign?",
                  "questionShortForm": "Zodiac",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/zodiac.png",
                  "questionType": "Advanced",
                  "answer": "Gemini"
              },
              {
                  "question": "Early bird or night owl?",
                  "questionShortForm": "Sleep Cycle",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/sleep.png",
                  "questionType": "Advanced",
                  "answer": "Both"
              }
          ],
            languages: [
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'English',
              },
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'Italian',
              },
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'Spanish',
              },
            ],
            bio: "Hey there! I'm Samuelito. 🚴‍♂️ When I'm not cycling through the fall leaves, you can find me showcasing my trendy dance moves at social gatherings (hint: I'm usually the one dancing). 🕺 From the weight room to the salsa floor, I keep things lively! I sip socially, smoke occasionally, and switch between being an early bird to a night owl. 🌞🌚 Fluent in English, Italian, and a sprinkle of Spanish, I'm just a Gemini guy who might want kids and definitely wants a deep convo. High School grad but a lifelong learner, especially in the school of life! 📚 Let's chat!",
            "spotify": [
              {
                  "id": "3Nrfpe0tUJi4K4DXYWgMUX",
                  "name": "BTS",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebd642648235ebf3460d2d1f6a"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174d642648235ebf3460d2d1f6a"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178d642648235ebf3460d2d1f6a"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group",
                      "pop"
                  ]
              },
              {
                  "id": "2dIgFjalVxs4ThymZ67YCE",
                  "name": "Stray Kids",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebada60ffd7a8ce554fd733fb5"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174ada60ffd7a8ce554fd733fb5"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178ada60ffd7a8ce554fd733fb5"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group",
                      "pop"
                  ]
              },
              {
                  "id": "0hCNtLu0JehylgoiP8L4Gh",
                  "name": "Nicki Minaj",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb6a8e5e8752d1dc2dafa63f20"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051746a8e5e8752d1dc2dafa63f20"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1786a8e5e8752d1dc2dafa63f20"
                      }
                  ],
                  "genres": [
                      "hip pop",
                      "pop",
                      "queens hip hop",
                      "rap"
                  ]
              },
              {
                  "id": "1oSPZhvZMIrWW5I41kPkkY",
                  "name": "Jimin",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb59f8cfc8e71dcaf8c6ec4bde"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab6761610000517459f8cfc8e71dcaf8c6ec4bde"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f17859f8cfc8e71dcaf8c6ec4bde"
                      }
                  ],
                  "genres": [
                      "k-pop"
                  ]
              },
              {
                  "id": "3cjEqqelV9zb4BYE3qDQ4O",
                  "name": "EXO",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebaf3c4b988a6fef40843cdc83"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174af3c4b988a6fef40843cdc83"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178af3c4b988a6fef40843cdc83"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group"
                  ]
              },
              {
                  "id": "1kfWoWgCugPkyxQP8lkRlY",
                  "name": "Jackson Wang",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb0405e7cc11aecb995703d398"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051740405e7cc11aecb995703d398"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1780405e7cc11aecb995703d398"
                      }
                  ],
                  "genres": [
                      "k-pop"
                  ]
              },
              {
                  "id": "1Xyo4u8uXC1ZmMpatF05PJ",
                  "name": "The Weeknd",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174214f3cf1cbe7139c1e26ffbb"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178214f3cf1cbe7139c1e26ffbb"
                      }
                  ],
                  "genres": [
                      "canadian contemporary r&b",
                      "canadian pop",
                      "pop"
                  ]
              },
              {
                  "id": "5pKCCKE2ajJHZ9KAiaK11H",
                  "name": "Rihanna",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab6761610000517499e4fca7c0b7cb166d915789"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f17899e4fca7c0b7cb166d915789"
                      }
                  ],
                  "genres": [
                      "barbadian pop",
                      "pop",
                      "urban contemporary"
                  ]
              },
              {
                  "id": "1uNFoZAHBGtllmzznpCI3s",
                  "name": "Justin Bieber",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051748ae7f2aaa9817a704a87ea36"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1788ae7f2aaa9817a704a87ea36"
                      }
                  ],
                  "genres": [
                      "canadian pop",
                      "pop"
                  ]
              },
              {
                  "id": "3a1tBryiczPAZpgoZN9Rzg",
                  "name": "Asake",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebb17a2dfb94026f0b6b09d524"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174b17a2dfb94026f0b6b09d524"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178b17a2dfb94026f0b6b09d524"
                      }
                  ],
                  "genres": [
                      "afrobeats",
                      "nigerian pop"
                  ]
              }
          ],
        }}
        />
        <UserProfileCard
        moveable={true}
          userData={{
            "location": {coordinates: {longitude: 5, latitude: 5}, city: "Durham"},
            "_id": "64f878e989281bd215d18bcb",
            "username": "Samuelito",
            "gender": {
                "primary": "Male",
                "secondary": "Cis man"
            },
            "instagram": [
              {
                  "id": "18001475398607220",
                  "url": "https://scontent.cdninstagram.com/v/t51.29350-15/328839568_734245981469883_6855777819993679843_n.webp?stp=dst-jpg&_nc_cat=107&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=ZGntD89JgGAAX9xn0vJ&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfAyBzNwtRXHFvi2CA-JiVd6rbnTaPjOT_K2_3J4oGAh6A&oe=64EB6783"
              },
              {
                  "id": "17856273320448528",
                  "url": "https://scontent.cdninstagram.com/v/t51.29350-15/145268070_134576531844982_4038986848759752931_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=WldWpUSq1JoAX8TAdH-&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AfDRhoxqbQPXFesfKhbRQzltQCKqPwEOEl2VE8olZpENuA&oe=64EAF44E"
              }
          ],
            "height":{feets: "6", inches: "1"},
            "interests": [
                {
                    "_id": "64ec96b475df8c73408bd076",
                    "name": "Hiking",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/knot.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd078",
                    "name": "Weightlifting",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/exercise.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd079",
                    "name": "Cycling",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/bicycle.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd07a",
                    "name": "Dancing",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/dance.png"
                },
                {
                    "_id": "64ec96b475df8c73408bd07b",
                    "name": "Nutrition",
                    "icon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/interests/vegan.png"
                }
            ],
            "relationshipGoal": "Relationship",
            "seeking": [
                "Female"
            ],
            "dateOfBirth": "2003-02-04T00:00:00.000Z",
            "verified": false,
            "lastActive": "2023-09-06T13:04:42.490Z",
            "__v": 0,
            "pictures": [
                {
                    "_id": "64f878eb89281bd215d18bdb",
                    "name": "64f878e989281bd215d18bcb/picture-0.jpg",
                    "blurLevel": 0.75,
                    "url": "https://flyleaf-pictures.s3.eu-west-2.amazonaws.com/64f878e989281bd215d18bcb/picture-0.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVVZPRTR3LQD32VEO%2F20230906%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230906T130540Z&X-Amz-Expires=86400&X-Amz-Signature=16f6c7a6cb70fa708088dd7c85f01207c076bd50d88d8d380ec11bf145dd54e1&X-Amz-SignedHeaders=host"
                },
                {
                    "_id": "64f878eb89281bd215d18bdc",
                    "name": "64f878e989281bd215d18bcb/picture-1.jpg",
                    "blurLevel": 0.75,
                    "url": "https://flyleaf-pictures.s3.eu-west-2.amazonaws.com/64f878e989281bd215d18bcb/picture-1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVVZPRTR3LQD32VEO%2F20230906%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230906T130540Z&X-Amz-Expires=86400&X-Amz-Signature=80deb4abfddee64fbf0a8fdcc6e14c9ed722a34412ac7976c44a355d4da81944&X-Amz-SignedHeaders=host"
                }
            ],
            "additionalInformation": [
              {
                  "question": "At a party, you are?",
                  "questionShortForm": "Party Behavior",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/party.png",
                  "questionType": "Advanced",
                  "answer": "Dancing"
              },
              {
                  "question": "Your drinking habits?",
                  "questionShortForm": "Drinking",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/drink.png",
                  "questionType": "Advanced",
                  "answer": "Drink socially"
              },
              {
                  "question": "Smoking habits?",
                  "questionShortForm": "Smoking",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/smoking.png",
                  "questionType": "Advanced",
                  "answer": "Social smoker"
              },
              {
                  "question": "Your preferred season?",
                  "questionShortForm": "Season",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/season.png",
                  "questionType": "Advanced",
                  "answer": "Fall"
              },
              {
                  "question": "Describe your fashion.",
                  "questionShortForm": "Fashion",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/fashion.png",
                  "questionType": "Advanced",
                  "answer": "Trendy"
              },
              {
                  "question": "Visit the gym?",
                  "questionShortForm": "Gym",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/gym.png",
                  "questionType": "Advanced",
                  "answer": "Sometimes"
              },
              {
                  "question": "Highest education level?",
                  "questionShortForm": "Education",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/education.png",
                  "questionType": "Advanced",
                  "answer": "High School"
              },
              {
                  "question": "Want children?",
                  "questionShortForm": "Children",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/babies.png",
                  "questionType": "Advanced",
                  "answer": "Maybe"
              },
              {
                  "question": "Your star sign?",
                  "questionShortForm": "Zodiac",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/zodiac.png",
                  "questionType": "Advanced",
                  "answer": "Gemini"
              },
              {
                  "question": "Early bird or night owl?",
                  "questionShortForm": "Sleep Cycle",
                  "questionIcon": "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/sleep.png",
                  "questionType": "Advanced",
                  "answer": "Both"
              }
          ],
            languages: [
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'English',
              },
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'Italian',
              },
              {
                _id: '64e782ed75df8c73408bcf3b',
                name: 'Spanish',
              },
            ],
            bio: "Hey there! I'm Samuelito. 🚴‍♂️ When I'm not cycling through the fall leaves, you can find me showcasing my trendy dance moves at social gatherings (hint: I'm usually the one dancing). 🕺 From the weight room to the salsa floor, I keep things lively! I sip socially, smoke occasionally, and switch between being an early bird to a night owl. 🌞🌚 Fluent in English, Italian, and a sprinkle of Spanish, I'm just a Gemini guy who might want kids and definitely wants a deep convo. High School grad but a lifelong learner, especially in the school of life! 📚 Let's chat!",
            "spotify": [
              {
                  "id": "3Nrfpe0tUJi4K4DXYWgMUX",
                  "name": "BTS",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebd642648235ebf3460d2d1f6a"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174d642648235ebf3460d2d1f6a"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178d642648235ebf3460d2d1f6a"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group",
                      "pop"
                  ]
              },
              {
                  "id": "2dIgFjalVxs4ThymZ67YCE",
                  "name": "Stray Kids",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebada60ffd7a8ce554fd733fb5"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174ada60ffd7a8ce554fd733fb5"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178ada60ffd7a8ce554fd733fb5"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group",
                      "pop"
                  ]
              },
              {
                  "id": "0hCNtLu0JehylgoiP8L4Gh",
                  "name": "Nicki Minaj",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb6a8e5e8752d1dc2dafa63f20"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051746a8e5e8752d1dc2dafa63f20"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1786a8e5e8752d1dc2dafa63f20"
                      }
                  ],
                  "genres": [
                      "hip pop",
                      "pop",
                      "queens hip hop",
                      "rap"
                  ]
              },
              {
                  "id": "1oSPZhvZMIrWW5I41kPkkY",
                  "name": "Jimin",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb59f8cfc8e71dcaf8c6ec4bde"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab6761610000517459f8cfc8e71dcaf8c6ec4bde"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f17859f8cfc8e71dcaf8c6ec4bde"
                      }
                  ],
                  "genres": [
                      "k-pop"
                  ]
              },
              {
                  "id": "3cjEqqelV9zb4BYE3qDQ4O",
                  "name": "EXO",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebaf3c4b988a6fef40843cdc83"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174af3c4b988a6fef40843cdc83"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178af3c4b988a6fef40843cdc83"
                      }
                  ],
                  "genres": [
                      "k-pop",
                      "k-pop boy group"
                  ]
              },
              {
                  "id": "1kfWoWgCugPkyxQP8lkRlY",
                  "name": "Jackson Wang",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb0405e7cc11aecb995703d398"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051740405e7cc11aecb995703d398"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1780405e7cc11aecb995703d398"
                      }
                  ],
                  "genres": [
                      "k-pop"
                  ]
              },
              {
                  "id": "1Xyo4u8uXC1ZmMpatF05PJ",
                  "name": "The Weeknd",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174214f3cf1cbe7139c1e26ffbb"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178214f3cf1cbe7139c1e26ffbb"
                      }
                  ],
                  "genres": [
                      "canadian contemporary r&b",
                      "canadian pop",
                      "pop"
                  ]
              },
              {
                  "id": "5pKCCKE2ajJHZ9KAiaK11H",
                  "name": "Rihanna",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab6761610000517499e4fca7c0b7cb166d915789"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f17899e4fca7c0b7cb166d915789"
                      }
                  ],
                  "genres": [
                      "barbadian pop",
                      "pop",
                      "urban contemporary"
                  ]
              },
              {
                  "id": "1uNFoZAHBGtllmzznpCI3s",
                  "name": "Justin Bieber",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab676161000051748ae7f2aaa9817a704a87ea36"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f1788ae7f2aaa9817a704a87ea36"
                      }
                  ],
                  "genres": [
                      "canadian pop",
                      "pop"
                  ]
              },
              {
                  "id": "3a1tBryiczPAZpgoZN9Rzg",
                  "name": "Asake",
                  "type": "artist",
                  "images": [
                      {
                          "height": 640,
                          "width": 640,
                          "url": "https://i.scdn.co/image/ab6761610000e5ebb17a2dfb94026f0b6b09d524"
                      },
                      {
                          "height": 320,
                          "width": 320,
                          "url": "https://i.scdn.co/image/ab67616100005174b17a2dfb94026f0b6b09d524"
                      },
                      {
                          "height": 160,
                          "width": 160,
                          "url": "https://i.scdn.co/image/ab6761610000f178b17a2dfb94026f0b6b09d524"
                      }
                  ],
                  "genres": [
                      "afrobeats",
                      "nigerian pop"
                  ]
              }
          ],
        }}
        />
      </View>
      }
    </SafeContainer>
  );
};

export default HomeScreen;

const homeScreenStyles = StyleSheet.create({
  container: {
    width:"100%",
    position:"relative"
  },
});
