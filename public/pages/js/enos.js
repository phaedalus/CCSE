(function (global) {
    class ENOSDebugger {
        constructor(options = {}) {
            this.options = Object.assign({
                position: 'bottom-right',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                textColor: 'white',
                fontSize: '14px',
                maxErrors: 5
            }, options);

            this.errorContainer = this.createErrorContainer();
        }

        createErrorContainer() {
            let container = document.createElement("div");
            container.style.position = "fixed";
            container.style.zIndex = "9999";
            container.style.maxWidth = "300px";
            container.style[this.getVerticalPosition()] = "10px";
            container.style[this.getHorizontalPosition()] = "10px";
            document.body.appendChild(container);
            return container;
        }

        getVerticalPosition() {
            return this.options.position.includes('top') ? 'top' : 'bottom';
        }

        getHorizontalPosition() {
            return this.options.position.includes('left') ? 'left' : 'right';
        }

        formatErrorMessage(error) {
            if (typeof error == "string") return `<strong>Error:</strong> ${error}`;

            let message = error.message || "Unknown error occurred.";
            let stack = error.stack ? error.stack.replace(/\n/g, '<br>') : "No stack trace available";
            return `<strong>Error:</strong> ${message}<br><strong>Stack:</strong> ${stack}`;
        }

        showError(errorMessage) {
            if (this.errorContainer.children.length >= this.options.maxErrors) {
                this.errorContainer.removeChild(this.errorContainer.firstChild);
            }

            let errorBox = document.createElement("div");
            errorBox.innerHTML = `
                <div style="
                    background: ${this.options.backgroundColor};
                    color: ${this.options.textColor};
                    padding: 10px;
                    border-radius: 5px;
                    font-family: Arial, sans-serif;
                    font-size: ${this.options.fontSize};
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                    margin-bottom: 5px;
                    position: relative;
                ">
                    <div style="text-align: right; cursor: pointer; font-weight: bold; position: absolute; top: 5px; right: 10px;" onclick="this.parentElement.remove()">✖</div>
                    ${errorMessage}
                </div>
            `;
            this.errorContainer.appendChild(errorBox);
        }
    }

    const enos = new ENOSDebugger();

    global.ENOS = enos;

    window.addEventListener("error", function (event) {
        enos.showError(enos.formatErrorMessage(event.error || error.message));
    });

    window.addEventListener("unhandledrejection", function (event) {
        let error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
        enos.showError(enos.formatErrorMessage(error));
    });

    const originalConsoleError = console.error;
    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        enos.showError(args.map(arg => enos.formatErrorMessage(arg)).join("<br>"));
    };
})(window || globalThis);