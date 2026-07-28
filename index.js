const form = document.getElementById('main-form')
let language = ''
let phrase = ''

//form event listener
form.addEventListener('submit', async function(e){
    e.preventDefault()
    const formData = new FormData(form)
    phrase = formData.get('english-text')

    const serverData = await serverRequest(language, phrase)
    console.log(serverData)
})

//Adding event listeners to all radio buttons
let radioBtns = document.querySelectorAll(`input[type='radio']`)
    radioBtns.forEach(function(btn){
        btn.addEventListener('change', findSelected)
    })

//Find selected radio button value
function findSelected(){
    let selected = document.querySelector(`input[name='languageBtn']:checked`)
    language = selected.value
}


//Function to send selcted language and user input to backend
async function serverRequest(language, phrase){
    const response = await fetch('', {method:"POST",
                                      headers:{"Content-Type":"application/json"},
                                      body: JSON.stringify({
                                        selectedLanguage: language,
                                        userInput: phrase
                                      })
    })
    const data = await response.json()

    return data
}