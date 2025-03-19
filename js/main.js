'use strict';
// API Key Variables
const key1 = 'sk-proj-7vyDO4PFulA9RzJM_KxUIZtVTUOmdlNR7Oy8D';
const key2 = 'q1a8rQtNWWnRJ3rRtrmGJu808dnJveOjer0dVT3BlbkFJI';
const key3 = 'uqxWfNJ9rai7axHkcNhLUvJVSW1f-pksYl4jIt8Dvq9eeFM';
const key4 = 'vzFw4qYu-CcieFlcaznL-43CIA';
// Global Variables
const currentFlashcardIndex = 0;
// DOM Cache
const $generateBtn = document.getElementById('search-btn');
const $inputField = document.getElementById('user-input');
const $flashcardContainers = document.querySelectorAll('.flashcard');
// Generate Listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript Loaded!');
  $generateBtn?.addEventListener('click', generateFlashcard);
});
// Clicks
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('edit-btn')) handleEdit(target);
  if (target.classList.contains('save-btn')) handleSave(target);
  if (target.classList.contains('add-btn')) handleAddToDeck(target);
});
// Edit Button
function handleEdit(target) {
  console.log('Edit button clicked!');
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) return;
  const $questionElem = $flashcard.querySelector('.flashcard-title');
  const $answerElem = $flashcard.querySelector('.flashcard-content');
  const $editQuestionInput = $flashcard.querySelector('.edit-question');
  const $editAnswerInput = $flashcard.querySelector('.edit-answer');
  const $saveEditBtn = $flashcard.querySelector('.save-btn');
  const $addToDeckBtn = $flashcard.querySelector('.add-btn');
  // Toggle hidden
  $questionElem.classList.add('hidden');
  $answerElem.classList.add('hidden');
  $editQuestionInput.classList.remove('hidden');
  $editAnswerInput.classList.remove('hidden');
  target.classList.add('hidden'); // Hide Edit button
  $saveEditBtn.classList.remove('hidden'); // Show Save button
  $addToDeckBtn.classList.add('hidden'); // Hide Add to Deck button
  // Prefill inputs
  $editQuestionInput.value = $questionElem.innerText;
  $editAnswerInput.value = $answerElem.innerText;
  // Expand Input Boxes
  $editQuestionInput.style.width = '100%';
  $editAnswerInput.style.width = '100%';
  $editAnswerInput.style.height = '80px';
}
// Save Button
function handleSave(target) {
  console.log('Save button clicked!');
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) return;
  const $questionElem = $flashcard.querySelector('.flashcard-title');
  const $answerElem = $flashcard.querySelector('.flashcard-content');
  const $editQuestionInput = $flashcard.querySelector('.edit-question');
  const $editAnswerInput = $flashcard.querySelector('.edit-answer');
  const $editBtn = $flashcard.querySelector('.edit-btn');
  const $addToDeckBtn = $flashcard.querySelector('.add-btn');
  // Save new values
  $questionElem.innerText = $editQuestionInput.value;
  $answerElem.innerText = $editAnswerInput.value;
  // Toggle visibility back
  $questionElem.classList.remove('hidden');
  $answerElem.classList.remove('hidden');
  $editQuestionInput.classList.add('hidden');
  $editAnswerInput.classList.add('hidden');
  target.classList.add('hidden'); // Hide Save button
  $editBtn.classList.remove('hidden'); // Show Edit button
  $addToDeckBtn.classList.remove('hidden'); // Show Add to Deck button
  console.log('Flashcard updated:', {
    question: $editQuestionInput.value,
    answer: $editAnswerInput.value,
  });
}
// Add To Deck Button
function handleAddToDeck(target) {
  console.log('Add to Deck button clicked!');
  const $flashcard = target.closest('.flashcard');
  if (!$flashcard) return;
  const $question = $flashcard.querySelector('.flashcard-title');
  const $answer = $flashcard.querySelector('.flashcard-content');
  if (!$question || !$answer) {
    console.error('Could not find question or answer elements');
    return;
  }
  // Retrieve existing deck or initialize
  const savedDeck = JSON.parse(localStorage.getItem('flashcards') || '[]');
  // Add new card
  savedDeck.push({ question: $question.innerText, answer: $answer.innerText });
  // Save back to localStorage
  localStorage.setItem('flashcards', JSON.stringify(savedDeck));
  console.log('Flashcard added to deck:', {
    question: $question.innerText,
    answer: $answer.innerText,
  });
}
// Fetch, API, Prompt
async function generateFlashcard() {
  const userInput = $inputField.value;
  if (!userInput) {
    console.log('Please enter a topic!');
    return;
  }
  const prompt = `Generate exactly 3 unique flashcards about: "${userInput}".
Each flashcard should cover a different aspect of the topic.
For instance, this will mostly be used for generating flash cards about concepts relating to coding.
Consider things like creating a card for syntax or an example of how it's used.
You're helping students learn, so responses should be useful, varied, and include code examples where relevant.
Please consider the use of flash cards and how a human would hold a paper card with a question on one side, then need to be able to memorize what's on the other side.
Make the answers more robust, but not super technical.

⚠️ IMPORTANT:
 - DO NOT include any explanations, pretext, or extra text.
 - ONLY return a JSON array with this format - you can use your own judgment for
   the questions and answers as long as they're formatted correctly - if applicable you can add a code snippet:

 [
   {
     "question":
     "answer":
   },
   {
     "question":
     "answer":
   },
   {
     "question":
     "answer":
   }
 ]`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${key1}${key2}${key3}${key4}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });
    const data = await response.json();
    console.log('API Response:', data);
    const flashcards = JSON.parse(data.choices[0].message.content);
    console.log('Generated Flashcards:', flashcards);
    flashcards.forEach((flashcard, index) => {
      const $flashcard = document.querySelector(
        `.flashcard[data-index="${index}"]`,
      );
      if ($flashcard) {
        const $questionElem = $flashcard.querySelector('.flashcard-title');
        const $answerElem = $flashcard.querySelector('.flashcard-content');
        $questionElem.innerText = flashcard.question;
        $answerElem.innerText = flashcard.answer;
      }
    });
  } catch (error) {
    console.log('Error Fetching AI Response:', error);
  }
}
