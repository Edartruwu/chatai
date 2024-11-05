package main

import (
	"fmt"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	htmlContent := `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla Chat Widget</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            height: 100%;
        }
        #chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        #chat-bubble {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        #chat-bubble:hover {
            transform: scale(1.1);
            background-color: #333;
        }
        #chat-icon {
            width: 30px;
            height: 30px;
            fill: white;
        }
        #chat-window {
            display: none;
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 300px;
            height: 400px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            overflow: hidden;
            transition: all 0.3s ease-in-out;
        }
        #chat-header {
            background-color: #000;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #chat-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        #close-chat {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        #close-chat:hover {
            transform: scale(1.1);
        }
        #chat-content {
            height: calc(100% - 50px);
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        @media (max-width: 480px) {
            #chat-window {
                width: 100%;
                height: 100%;
                right: 0;
                bottom: 0;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div id="chat-widget">
        <div id="chat-bubble" role="button" aria-label="Open chat" tabindex="0">
            <svg id="chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </div>
        <div id="chat-window" role="dialog" aria-labelledby="chat-title">
            <div id="chat-header">
                <h3 id="chat-title">ODP chat</h3>
                <button id="close-chat" aria-label="Close chat">×</button>
            </div>
            <div id="chat-content">
                <iframe src="https://pl-nickel-closer-proposals.trycloudflare.com/chat" title="Chat Support"></iframe>
            </div>
        </div>
    </div>

    <script>
        const chatBubble = document.getElementById('chat-bubble');
        const chatWindow = document.getElementById('chat-window');
        const closeChat = document.getElementById('close-chat');

        function toggleChat() {
            if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
                chatWindow.style.display = 'block';
                chatBubble.style.display = 'none';
                chatWindow.focus();
            } else {
                chatWindow.style.display = 'none';
                chatBubble.style.display = 'flex';
                chatBubble.focus();
            }
        }

        chatBubble.addEventListener('click', toggleChat);
        chatBubble.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                toggleChat();
            }
        });

        closeChat.addEventListener('click', toggleChat);
        closeChat.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                toggleChat();
            }
        });

        // Trap focus within chat window when open
        chatWindow.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = chatWindow.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    </script>
</body>
</html>
	`
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, htmlContent)
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("Server starting on http://localhost:8085")
	http.ListenAndServe(":8085", nil)
}
