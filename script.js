function encodeMessage() {
    const imageInput = document.getElementById('imageInput').files[0];
    const message = document.getElementById('message').value;
    if (!imageInput || !message) {
        alert("Please upload an image and enter a message!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imgData.data;
            let binaryMessage = message.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('') + '00000000';
            
            for (let i = 0; i < binaryMessage.length; i++) {
                data[i * 4] = (data[i * 4] & 254) | parseInt(binaryMessage[i]);  // Modify red channel
            }

            ctx.putImageData(imgData, 0, 0);
            const encodedImage = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.href = encodedImage;
            a.download = "encoded_image.png";
            a.click();
        };
    };
    reader.readAsDataURL(imageInput);
}

function decodeMessage() {
    const decodeInput = document.getElementById('decodeInput').files[0];
    if (!decodeInput) {
        alert("Please upload an encoded image!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imgData.data;
            let binaryMessage = "";

            for (let i = 0; i < data.length; i += 4) {
                binaryMessage += (data[i] & 1);
            }

            let message = "";
            for (let i = 0; i < binaryMessage.length; i += 8) {
                const byte = binaryMessage.slice(i, i + 8);
                if (byte === "00000000") break;
                message += String.fromCharCode(parseInt(byte, 2));
            }

            document.getElementById('outputMessage').innerText = "Decoded Message: " + message;
        };
    };
    reader.readAsDataURL(decodeInput);
}
