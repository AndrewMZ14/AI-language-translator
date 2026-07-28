import {marked} from 'marked'
import OpenAI from 'openai'
import DOMPurify from 'dompurify'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'


const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
    apiKey:process.env.AI_KEY,
    baseURL:process.env.AI_URL
})


app.post('/api/data', async (req, res) => {

    const messages = [{
    role:"system",
    content:`You are a strict, direct translator. Your only job is to translate the user's input into the requested language.
        
        CRUCIAL RULES:
        1. Only return the final translated text. 
        2. Do not include any conversational filler, introductory remarks, or conclusions (e.g., do NOT say "The translation is: " or "Here you go").
        3. Single English words, greetings (like 'hello', 'hi', 'good morning'), and complete sentences are all completely valid inputs. Translate them directly.
        4. If the input is absolute gibberish, a mashup of random letters (like 'asdfghjkl'), or entirely numbers with no translatable text, only then return the exact string: "not a valid phrase".`
}]
    const prompt = {
        role:"user",
        content:`Translate this english sentence ${req.body.selectedLanguage} to ${req.body.userInput}`
    }
    messages.push(prompt)
    try{
        const response = await openai.chat.completions.create({
            model:process.env.AI_MODEL,
            messages: messages
        })
        const output = response.choices[0].message.content

        console.log(output)

        res.status(200)
        res.json({translatedText: output})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            message: error.message 
        });
    }
})

app.listen(3000)
