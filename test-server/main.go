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
    <title>Landing Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .container {
            text-align: center;
            max-width: 800px;
            padding: 20px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        iframe {
            margin-top: 20px;
            width: 100%;
            height: 400px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    </style>


<iframe src="https://array-supplied-keys-actors.trycloudflare.com" frameborder="0" style="position: fixed; bottom: 0; right: 0; width: 320px; height: 480px; border: none; z-index: 9999;"></iframe>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Landing Page</h1>
        <p>Explore more by interacting with the embedded content below.</p>
        <iframe src="https://pl-nickel-closer-proposals.trycloudflare.com/chat" title="Embedded Content"></iframe>
    </div>
</body>
</html>
	`
	w.Header().Set("Content-Type", "text/html")
	fmt.Fprint(w, htmlContent)
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("Server starting on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
