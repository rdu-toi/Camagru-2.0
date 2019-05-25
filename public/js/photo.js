function startCam() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let video = document.getElementById('video');
    let choose = document.querySelectorAll(".items");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    document.getElementById("snap").addEventListener("click", () => {
        context.drawImage(video, 0, 0, 600, 450);
        let dataURL = canvas.toDataURL('image/png');
        document.getElementById("imgsrc").value = dataURL;
        choose.forEach(element => {
            element.addEventListener("click", () => {
                console.log(element);
                if (element) {
                    if (element.id === "sticker1") {
                        console.log('First sticker');
                        context.drawImage(element, 90, 10, 420, 420);
                    }
                    else if (element.id === "sticker2") {
                        context.drawImage(element, 40, 130, 150, 150);
                    }
                    else if (element.id === "sticker3") {
                        context.drawImage(element, 400, 140, 150, 150);
                    }
                    else if (element.id === "sticker4") {
                        context.drawImage(element, 0, 0, 600, 450);
                    }
                    else if (element.id === "sticker5") {
                        context.drawImage(element, 140, 228, 300, 300);
                    }
                    let dataURL = canvas.toDataURL('image/png');
                    document.getElementById("imgsrc").value = dataURL;
                }
            });
        });
    });
};