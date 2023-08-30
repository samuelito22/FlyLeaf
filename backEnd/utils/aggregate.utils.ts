export const COLLECT_PICTURES = [{
    $lookup: {
      from: "pictures",
      let: { picturesId: "$pictures" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$picturesId"],
            },
          },
        },
        {
          $project: {
            _id: 1,
            url: 1,
            blurLevel: 1,
          },
        },
      ],
      as: "pictures",
    },
  }]
  
export  const COLLECT_INTERESTS = [{
    $lookup: {
      from: "interests",
      let: { interestsId: "$interests" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$interestsId"],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            icon: 1,
          },
        },
      ],
      as: "interests",
    },
  }]
  
export  const COLLECT_SEEKING = [{
    $lookup: {
      from: "genders",
      let: { seekingId: "$seeking" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$seekingId"],
            },
          },
        },
       
      ],
      as: "seeking",
    },
  },
  {
    $addFields: {
      seeking: {
        $map: {
          input: "$seeking",
          as: "item",
          in: "$$item.primary",
        },
      },
    },
  }]
  
 export const COLLECT_ADDITIONAL_INFORMATION = [
    {
      $lookup: {
        from: "userresponses",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userId"]
              }
            },
          },
          {
            $unwind: "$responses"
          },
          {
            $lookup: {
              from: "questions",
              localField: "responses.questionId",
              foreignField: "_id",
              as: "questionInfo"
            }
          },
          {
            $lookup: {
              from: "answers",
              localField: "responses.answerId",
              foreignField: "_id",
              as: "answerInfo"
            }
          },
          {
            $project: {
              _id: 0,
              question: { $arrayElemAt: ["$questionInfo.question", 0] },
              questionShortForm: { $arrayElemAt: ["$questionInfo.shortForm", 0] },
              questionIcon: { $arrayElemAt: ["$questionInfo.icon", 0] },
              answer: { $arrayElemAt: ["$answerInfo.text", 0] },
            }
          }
        ],
        as: "additionalInformation"
      }
    }
  ];
  
 export const COLLECT_LANGUAGES = [{
    $lookup: {
      from: "languages",
      let: { languagesId: "$languages" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$languagesId"],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      as: "languages",
    },
  }]
  
  
 export const COLLECT_GENDER = [
    {
      $lookup: {
        from: "genders",
        let: { primaryId: "$gender.primary", secondaryId: "$gender.secondary" },
        pipeline: [
          {
            $match: {
              $expr: {
                 $eq: ["$_id", "$$primaryId"] ,
  
              }
            }
          },
          {
            $project: {
              text: 1,
              _id: 0,
              primary: 1,
              secondary: {
                $filter: {
                  input: "$secondary",
                  as: "item",
                  cond: { $eq: ["$$item._id", "$$secondaryId"] }
                }
              }
            }
          }
        ],
        as: "gender"
      }
    },
    {
      $unwind: "$gender",
    },
    {
      $unwind: "$gender.secondary"
    },
    {
      $addFields: {
        "gender.primary": "$gender.primary",
        "gender.secondary": "$gender.secondary.text"
      }
    }
  ];
  
 export const COLLECT_SETTINGS =[
    {
      $lookup: {
        from: "settings",
        let: {userId: "$_id"},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$userId']
              }
            }
          },
          {
            $project: {
              _id: 0,
              __v: 0
            }
          }
        ],
        as: "settings"
      }
    }
  ]

export const COLLECT_INSTAGRAM = [
    {
        $lookup: {
            from: "instagrams",
            localField: "instagram",
            foreignField: "_id",
            as: "instagram"
        }
    }
]

export const COLLECT_SPOTIFY = [
    {
        $lookup: {
            from: "spotifies",
            localField: "spotify",
            foreignField: "_id",
            as: "spotify"
        }
    }
]

export const COLLECT_PREMIUM_FEATURES =[
    {
      $lookup: {
        from: "premiums",
        let: {userId: "$_id"},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$userId']
              }
            }
          },
          {
            $project: {
                _id: 0,
              features: 1
              
            }
          }
        ],
        as: "premium"
      }
    }
  ]