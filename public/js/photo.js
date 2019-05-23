function startCam() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let video = document.getElementById('video');
    let img;
    let videoflag = 0;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    // function chooseimg(){
    //     let choose = document.querySelectorAll(".items");

    //     choose.forEach(function(element){
    //         element.addEventListener("click",function(){
    //         img = element;
    //         if (img && videoflag === 1){
    //             if (img.src === "../img/1.png"){
    //                 context.drawImage(img, 75, 25, 250, 250);
    //             }
    //             else if (img.src === "/img/2.png"){
    //                 context.drawImage(img, 60, 100, 100, 100);
    //             }
    //             else if (img.src === "/img/3.png"){
    //                 context.drawImage(img, 250, 125, 100, 100);
    //             }
    //             else if (img.src === "/img/4.png"){
    //                 context.drawImage(img, 0, 0, 400, 300);
    //             }
    //             else if (img.src === "/img/5.png"){
    //                 context.drawImage(img, 65, 114, 250, 250);
    //             }
    //             let dataURL = canvas.toDataURL('image/png');
    //             document.getElementById("imgsrc").value = dataURL;
    //         }
    //     });
    // });}

    // chooseimg();

    document.getElementById("snap").addEventListener("click", () => {
        context.drawImage(video, 0, 0, 600, 450);
        // videoflag = 1;
        // let dataURL = canvas.toDataURL('image/png');
        // document.getElementById("imgsrc").value = dataURL;
    });
};