import validator from "validator";
import isEmpty from "is-empty";

export function validateRegisterInput({
  uid,
  phoneNumber,
  firstName,
  email,
  dateOfBirth,
  gender,
  genderPreferences,
  relationshipGoal,
  pictures,
  questionAndAnswer,
  interests
}) {
  let errors = {};

  // UID checks
  if (isEmpty(uid)) {
    errors.uid = "UID field is required";
  }

  // Phone checks
  if (phoneNumber && !validator.isMobilePhone(phoneNumber)) {
    errors.phoneNumber = "Phone is invalid";
  }

  // Name checks
  if (isEmpty(firstName)) {
    errors.firstName = "First Name field is required";
  }

  // Email checks
  if (email && !validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  // Date of Birth checks
  if (isEmpty(dateOfBirth)) {
    errors.dateOfBirth = "Date of Birth field is required";
  } else {
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = "Date of Birth is invalid";
    }
  }

  // Gender checks
  if (isEmpty(gender)) {
    errors.gender = "Gender field is required";
  }

  // Gender Preference checks
  if (!genderPreferences || !genderPreferences.length || !Array.isArray(genderPreferences)) {
    errors.genderPreferences = "Gender Preferences field is required";
  }

  // Relationship Goal checks
  if (isEmpty(relationshipGoal)) {
    errors.relationshipGoal = "Relationship Goal field is required";
  }
  
  // Pictures checks
  if (pictures && !Array.isArray(pictures)) {
    errors.photos = "The pictures variable has to be an array";
  }

    // QuestionAndAnswer checks
  if (!questionAndAnswer || !Array.isArray(questionAndAnswer)) {
    errors.questionAndAnswer = "Question and Answer field is required and must be an array";
  } else {
    questionAndAnswer.forEach((item, index) => {
      if (!item.question || !item.answer) {
        errors.questionAndAnswer = `Question and Answer at index ${index} must have both question and answer`;
      }
    });
  }

  // Interests checks
  if (!interests || !Array.isArray(interests)) {
    errors.interests = "Interests field is required and must be an array";
  }
  
  return {
    errors,
    isValid: isEmpty(errors),
  };
}


export function validateEmailInput(email) {
  let errors = {};
  email = !isEmpty(email) ? email : "";

  if (isEmpty(email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export function validatePhoneInput(phoneNumber) {
  let errors = {};

  if (isEmpty(phoneNumber)) {
    errors.phoneNumber = "Phone number field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}


export function validateUidInput(uid){
  let errors = {};

  if(isEmpty(uid)){
    errors.uid = "Uid field is required"
  }
  return { 
    errors,
    isValid: isEmpty(errors)
  }
}