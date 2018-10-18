import { API_BASE_URL } from "../config";
import { normalizeResponseErrors } from "./utils";

export const USER_GUESS_SUCCESS = "USER_GUESS_SUCCESS";
export const userGuessSuccess = (message, correctCount) => ({
  type: USER_GUESS_SUCCESS,
  message,
  correctCount
});

export const USER_GUESS_FAIL = "USER_GUESS_FAIL";
export const userGuessFail = (message, answer) => ({
  type: USER_GUESS_FAIL,
  message,
  answer
});

export const SET_NEXT_QUESTION = "SET_NEXT_QUESTION";
export const setNextQuestion = head => ({
  type: SET_NEXT_QUESTION,
  head
});

export const userGuess = guess => (dispatch, getState) => {
  const user = getState().auth.currentUser;
  const currentHead = user.head;
  let correctCount = getState().auth.correctCount;
  let wordList = getState().protectedData.data.wordList;
  const answer = wordList[currentHead].english;
  //    save the question just answered = object at index 0
  let nodeJustAnswered = wordList[currentHead];
  //    find the location the above question will move to based on mValue = index 2
  let mValue = nodeJustAnswered.mVal;
  //    change currentUser.head = object at index 0's next value = 1
  if (guess === answer) {
    mValue *= 2;
    nodeJustAnswered.mVal = mValue;
    correctCount++;
    let message = "Well Done! Bien Hecho!";
    dispatch(userGuessSuccess(message, correctCount));
  } else {
    mValue = 1;
    nodeJustAnswered.mVal = mValue;
    let message = "Incorrect! Incorrecto!";
    dispatch(userGuessFail(message, answer));
  }
};

export const nextQuestion = () => (dispatch, getState) => {
  const authToken = getState().auth.authToken;
  const user = getState().auth.currentUser;
  const userId = user.id;
  //  save the value of currentUser.head = 0
  const currentHead = user.head;
  let wordList = getState().protectedData.data.wordList;
  console.log(wordList);
  //    save the question just answered = object at index 0
  let nodeJustAnswered = wordList[currentHead];
  //    find the location the above question will move to based on mValue = index 2
  let mValue = nodeJustAnswered.mVal;
  //    change currentUser.head = object at index 0's next value = 1
  let newHead = nodeJustAnswered.next;
  //    find question at index 2

  let swappedQuestion = wordList[mValue];
  //    insert object at index 0 to index 2 by changing the next value
  nodeJustAnswered.next = swappedQuestion.next;
  swappedQuestion.next = currentHead;

  let updatedList = {
    head: newHead,
    wordList
  };
  console.log(updatedList);
  return fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(updatedList)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(() => {
      return fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then(dispatch(setNextQuestion(newHead)));
    });
};