import { marked } from './node_modules/marked/lib/marked.esm.js';
import DOMPurify from './node_modules/dompurify/dist/purify.es.mjs';
const form = document.getElementById('main-form')
const textOne = document.getElementById('text-one')
const languageSelection = document.getElementById('lanuguage-selection')
const englishTextArea = document.getElementById('english-text')
const main = document.querySelector('main')
let language = ''
let phrase = ''
let output = ''


main.addEventListener('click', function(e){
    if(e.target.id === 'restart'){
        restart()
    }
})
//form event listener
form.addEventListener('submit', async function(e){
    e.preventDefault()
    const formData = new FormData(form)
    phrase = formData.get('english-text')

    if(!language){
        alert('please select a language')
        return
    }

    //Adding loading message while async code is running
    languageSelection.innerHTML = `<div class="spinner"></div>
                                    <p class="loading-message">Translating Text</p>`

    try{
        const serverData = await serverRequest(language, phrase)

        const parsedData = marked.parse(serverData.translatedText)

        const sanitizedData = DOMPurify.sanitize(parsedData, {RETURN_DOM: true})

        const sanitizedText = sanitizedData.textContent

        console.log(sanitizedText)
        textOne.textContent = "Original Text 👇"

        englishTextArea.readOnly = true

        languageSelection.innerHTML = `<p class="main-paragraph">Your translation 👇</p>
                                        <textarea name="english-text" id="translated-text" readonly>${sanitizedText}</textarea>
                                        <button type="button" id="restart">Start Over</button>`
    }
    catch(error){
        console.log(error)
        languageSelection.innerHTML = `<p class="warning">Something went wrong :<</p>`
    }
})

//Adding event listeners to all radio buttons
let radioBtns = document.querySelectorAll(`input[type='radio']`)
    radioBtns.forEach(function(btn){
        btn.addEventListener('change', findSelected)
    })

//Find selected radio button value
function findSelected(){
    let selected = document.querySelector(`input[name='languageBtn']:checked`)
    if(selected){
        language = selected.value
    }
}


//Function to send selcted language and user input to backend
async function serverRequest(language, phrase){
    try{
        const response = await fetch('http://localhost:3000/api/data', {method:"POST",
                                      headers:{"Content-Type":"application/json"},
                                      body: JSON.stringify({
                                        selectedLanguage: language,
                                        userInput: phrase
                                      })
    })

    if(!response.ok){
            throw Error("Server error")
        }
    const data = await response.json()
    return data
    }
    catch(error){
        console.log(error)
        throw Error("Something went wrong")
    }

    
}

//Logic for the start over button
function restart(){
    console.log("Hello")
    window.location.reload()
}