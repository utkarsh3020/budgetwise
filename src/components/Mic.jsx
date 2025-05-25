import React, { useRef } from 'react'
import { FaMicrophone } from "react-icons/fa";

const Mic = () => {
    const recognitionRef = useRef(null);

    const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      parseVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const parseVoiceCommand = (command) => {
    const amountMatch = command.match(/\d+/);
    const typeMatch = command.includes("expense") ? "expense" : command.includes("income") ? "income" : "";
    const categoryMatch = command.match(/for (.*?) (on|today|yesterday)?$/i);
    const date = new Date().toISOString().split("T")[0];

    if (amountMatch && typeMatch && categoryMatch) {
    //   setForm({
    //     amount: amountMatch[0],
    //     type: typeMatch,
    //     category: categoryMatch[1],
    //     date,
    //   });
    } else {
      alert("Could not parse the command. Please try again clearly.");
    }
  };
  return (
    <div>
        <button onClick={handleVoiceInput} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1 cursor-pointer">Speak <FaMicrophone /></button>
    </div>
  )
}

export default Mic