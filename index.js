import { Configuration, OpenAIApi } from 'openai';
import { customProcess } from './env.js';


// OpenAI API configuration and instantiation
const configuration = new Configuration({
    apiKey: customProcess.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Initial system message to guide the chatbot behavior
const conversationArr = [
    { 
        role: 'system',
        content: 'You are a useful assistant.'
    }
];

const chatbotConversation = document.getElementById('chatbot-conversation');

// Define templates to generate prompts for OpenAI based on user choice and input
const templates = {
    "normal-chat": "",
    "json-file": "Create a JSON file with JSON template based on: ",
    "programming-assistant": "You are a programming assistant. Help with code questions: ",
    "debugger": "You are a debugging assistant. Help identify and resolve issues in: ",
    "optimizer": "You are a code optimization assistant. Suggest efficient ways for: ",
    "reviewer": "Act as a code reviewer. Review this for best practices: ",
    "learner": "You are a learning assistant. Explain this concept: "
};

const templateSelection = document.getElementById('template-selection');
const userInputElem = document.getElementById('user-input');

// Prefill the input field with the selected template
templateSelection.addEventListener('change', () => {
    userInputElem.value = templates[templateSelection.value];
    userInputElem.focus();
});

// Handles form submission, updating UI, and calling OpenAI
document.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-human');

    chatbotConversation.appendChild(newSpeechBubble);
    newSpeechBubble.textContent = userInputElem.value;

    conversationArr.push({ 
        role: 'user',
        content: userInputElem.value
    });

    userInputElem.value = '';
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

    fetchReply(userInputElem.value);
});

// Fetches reply from OpenAI and updates conversation array
async function fetchReply(promptData) {
    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        prompt: promptData,
        max_tokens: 250
    });

    conversationArr.push(response.data.choices[0].message);
    renderTypewriterText(response.data.choices[0].message.content);
}

// Renders chatbot's reply with a typewriter animation
function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor');
    chatbotConversation.appendChild(newSpeechBubble);

    let charIndex = 0;
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.charAt(charIndex++);
        if (charIndex >= text.length) {
            clearInterval(interval);
            newSpeechBubble.classList.remove('blinking-cursor');
        }
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }, 50);
}
