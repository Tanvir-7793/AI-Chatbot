let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDV6-qOyHvYLM-fogPGnrVQWxwA4jAO4n4"

let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
 
async function generateResponse(aiChatBox) {

let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{text:user.message},(user.file.data?[{inline_data:user.file}]:[])

                ]
            }]
        })
    }
    try{
        let response= await fetch(Api_Url,RequestOption)
        let data=await response.json()
       let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       text.innerHTML=apiResponse    
    }
    catch(error){
        console.log(error);
        
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}
    }
}



function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="human2.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

setTimeout(()=>{
let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <img src="loading1.gif" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)

}


prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)

    }
})

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})
// new
// document.addEventListener("DOMContentLoaded", function () {
//     const chatbox = document.getElementById("chatbox");

//     // Check if Speech Recognition is supported
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//         alert("Speech Recognition is not supported in your browser. Use Google Chrome.");
//         return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = false;
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognition.onresult = async function (event) {
//         const userText = event.results[0][0].transcript;
//         chatbox.innerHTML += <p><strong>You:</strong> ${userText}</p>;

//         try {
//             const botReply = await fetchBotResponse(userText);
//             chatbox.innerHTML += <p><strong>Bot:</strong> ${botReply}</p>;
//             speak(botReply);
//         } catch (error) {
//             console.error("Error fetching bot response:", error);
//             chatbox.innerHTML += <p><strong>Bot:</strong> Sorry, I couldn't process that.</p>;
//         }
//     };
//     recognition.onerror = function (event) {
//         console.error("Speech Recognition Error:", event.error);
//         chatbox.innerHTML += <p><strong>Bot:</strong> Error in voice recognition.</p>;
//     };

//     window.startListening = function () {
//         recognition.start();
//     };

//     window.stopListening = function () {
//         recognition.stop();
//     };

//     async function fetchBotResponse(userText) {
//         try {
//             const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDV6-qOyHvYLM-fogPGnrVQWxwA4jAO4n4", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": "Bearer https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDV6-qOyHvYLM-fogPGnrVQWxwA4jAO4n4"
//                 },
//                 body: JSON.stringify({
//                     model: "gpt-3.5-turbo",
//                     messages: [{ role: "user", content: userText }]
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error('API error: ${response.statusText}');
//             }

//             const data = await response.json();
//             return data.choices[0]?.message?.content || "I couldn't understand.";
//         } catch (error) {
//             console.error("API Error:", error);
//             return "I couldn't process your request.";
//         }
//     }

//     function speak(text) {
//         if ('speechSynthesis' in window) {
//             const synth = window.speechSynthesis;
//             const utterance = new SpeechSynthesisUtterance(text);
//             utterance.lang = "en-US";
//             synth.speak(utterance);
//         } else {
//             console.error("Text-to-Speech not supported in this browser.");
//    }}
// });
// document.addEventListener("DOMContentLoaded", function () {
//     const chatbox = document.getElementById("chatbox");
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.continuous = false;
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     // 🎤 Start Speech Recognition
//     window.startListening = function () {
//         recognition.start();
//     };

//     // 🛑 Stop Speech Recognition
//     window.stopListening = function () {
//         recognition.stop();
//     };

//     // 🎙 Handle Speech Input
//     recognition.onresult = async function (event) {
//         const userText = event.results[0][0].transcript;
//         chatbox.innerHTML += <p><strong>You:</strong> ${userText}</p>;
//         getGeminiResponse(userText);
//     };

//     recognition.onerror = function (event) {
//         console.error("Speech Recognition Error:", event.error);
//         chatbox.innerHTML += <p><strong>Bot:</strong> Error in voice recognition.</p>;
//     };

