(function () {
    function formatErrorMessage(error) {
        if (typeof error === "string") {
            return `<strong>Error:</strong> ${error}`;
        }
        
        let message = error.message || "Unknown error occurred.";
        let stack = error.stack ? error.stack.replace(/\n/g, '<br>') : "No stack trace available";
        return `<strong>Error:</strong> ${message}<br><strong>Stack:</strong> ${stack}`;
    }

    function createErrorUI(errorMessage) {
        let errorBox = document.createElement("div");
        errorBox.innerHTML = `<div style="
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 300px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index: 9999;
        ">
            <div style="text-align: right; cursor: pointer; font-weight: bold;" onclick="this.parentElement.style.display='none'">✖</div>
            ${errorMessage}
        </div>`;
        document.body.appendChild(errorBox);
    }

    window.addEventListener("error", function (event) {
        let formattedMessage = formatErrorMessage(event.error || event.message);
        createErrorUI(formattedMessage);
        return false;
    });

    window.addEventListener("unhandledrejection", function (event) {
        let error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        let formattedMessage = formatErrorMessage(error);
        createErrorUI(formattedMessage);
    });

    const originalConsoleError = console.error;
    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        let formattedMessage = args.map(arg => formatErrorMessage(arg)).join("<br>");
        createErrorUI(formattedMessage);
    };
})();