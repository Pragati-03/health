let bookingStep = 0;  // Tracks the current step in booking
let appointmentDetails = {};  // Stores the appointment details

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    const chatMessages = document.getElementById("chat-messages");

    if (userInput !== "") {
        // Display user's message
        chatMessages.innerHTML += `<div class='user-message'>${sanitize(userInput)}</div>`;

        if (bookingStep > 0) {
            handleBookingFlow(userInput);
        } else {
            // Bot response to general messages or commands
            setTimeout(() => {
                const botReply = generateReply(userInput);
                chatMessages.innerHTML += `<div class='bot-message'>${botReply}</div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }

        // Clear the input field
        document.getElementById("user-input").value = "";
    }
}

function handleOption(option) {
    const chatMessages = document.getElementById("chat-messages");

    // Display the user's choice
    chatMessages.innerHTML += `<div class='user-message'>${sanitize(formatOption(option))}</div>`;

    if (option === 'book') {
        bookingStep = 1;  // Start booking process
        setTimeout(() => {
            const botReply = "Sure! Let's book an appointment. What's your name?";
            chatMessages.innerHTML += `<div class='bot-message'>${botReply}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    } else {
        // Handle other options
        setTimeout(() => {
            const botReply = generateReply(option);
            chatMessages.innerHTML += `<div class='bot-message'>${botReply}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

function handleBookingFlow(input) {
    const chatMessages = document.getElementById("chat-messages");

    switch (bookingStep) {
        case 1:
            // Collect Name
            appointmentDetails.name = input;
            chatMessages.innerHTML += `<div class='bot-message'>Great, ${sanitize(appointmentDetails.name)}! What's your preferred appointment date? (e.g., 2024-09-10)</div>`;
            bookingStep++;
            break;
        case 2:
            // Collect Date
            if (isValidDate(input)) {
                appointmentDetails.date = input;
                chatMessages.innerHTML += `<div class='bot-message'>Thanks! What time works best for you? (e.g., 10:00 AM)</div>`;
                bookingStep++;
            } else {
                chatMessages.innerHTML += `<div class='bot-message'>Please enter a valid date in the format YYYY-MM-DD.</div>`;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            break;
        case 3:
            // Collect Time
            if (isValidTime(input)) {
                appointmentDetails.time = input;
                chatMessages.innerHTML += `<div class='bot-message'>Thank you, ${sanitize(appointmentDetails.name)}! Your appointment is booked for ${sanitize(appointmentDetails.date)} at ${sanitize(appointmentDetails.time)}. We will send you a confirmation shortly.</div>`;
                
                // Optionally, send details to backend
                sendAppointmentToBackend();

                bookingStep = 0;  // Reset booking flow
            } else {
                chatMessages.innerHTML += `<div class='bot-message'>Please enter a valid time (e.g., 10:00 AM).</div>`;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            break;
        default:
            bookingStep = 0;
            chatMessages.innerHTML += `<div class='bot-message'>Something went wrong. Let's start over. Type 'Book an Appointment' to try again.</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            break;
    }
}

function generateReply(input) {
    input = input.toLowerCase();
    if (input === "hi" || input === "hello") {
        return "Hello! How can I assist you today?";
    } else if (input.includes("book") || input === 'book') {
        return "To book an appointment, please provide your name and preferred date.";
    } else if (input.includes("consult") || input === 'consult') {
        return "To consult a doctor, please choose your symptoms from the following options: <br>1. Fever<br>2. Cough<br>3. Headache<br>4. Body Ache<br>5. Nausea<br>6. Others <br>Type the number or name of the symptom.";
    } else if (input.includes("contact") || input === 'contact') {
        return "You can contact us via email at support@healthcare.com or call us at +91 700XX.";
    } else if (input.includes("about") || input === 'about') {
        return "We are dedicated to providing quality healthcare services. Visit our website for more info!";
    } else if (input === '1' || input.includes('fever')) {
        return "You selected Fever. Based on this, a general physician will contact you soon.";
    } else if (input === '2' || input.includes('cough')) {
        return "You selected Cough. A respiratory specialist will reach out to you.";
    } else if (input === '3' || input.includes('headache')) {
        return "You selected Headache. A neurologist will assist you.";
    } else if (input === '4' || input.includes('body ache')) {
        return "You selected Body Ache. Please rest, and a specialist will contact you soon.";
    } else if (input === '5' || input.includes('nausea')) {
        return "You selected Nausea. A gastroenterologist will be in touch.";
    } else if(input==='6'||input.includes('others')){
        return "Specialist will contact you soon";
    } else if(input === "bye" || input === "thank you") {
        return "Goodbye! Have a great day";
    } else {
        return "I'm not sure what you're asking. Please choose an option or type 'Book', 'Consult', 'Contact', or 'About'.";
    }
}

function formatOption(option) {
    switch(option) {
        case 'hi':
            return "Hello! How can I assist you today?";
        case 'book':
            return "Book an Appointment";
        case 'consult':
            return "Consult Doctor";
        case 'contact':
            return "Contact Us";
        case 'about':
            return "About Us";
        case 'bye':
            return "Goodbye! Have a great day";
        default:
            return "";
    }
}

function sendAppointmentToBackend() {
    // Example: Sending appointment details to a backend server
    fetch('https://your-backend-api.com/api/book-appointment', {  // Replace with your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentDetails)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Appointment booked:', data);
        // Optionally, inform the user about the successful booking
    })
    .catch(error => {
        console.error('Error booking appointment:', error);
        // Optionally, inform the user about the error
    });
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

function isValidTime(timeString) {
    // Simple regex for HH:MM AM/PM format
    const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return regex.test(timeString);
}

function sanitize(input) {
    // to prevent HTML injection
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

function clearChat() {
    document.getElementById("chat-messages").innerHTML = "";
    document.getElementById("user-input").value = "";
    bookingStep = 0;  
}
