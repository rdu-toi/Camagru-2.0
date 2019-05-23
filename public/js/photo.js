(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    var img;
    var videoflag = 0;

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true 
        }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    function chooseimg(){
        var choose = document.querySelectorAll(".items");
    
        choose.forEach(function(element){
            element.addEventListener("click",function(){
            img = element;
            if (img && videoflag === 1){
                if (img.src === "../../img/1.png"){
                    context.drawImage(img, 75, 25, 250, 250);
                }
                else if (img.src === "http://localhost:3000/Camagru/img/2.png"){
                    context.drawImage(img, 60, 100, 100, 100);
                }
                else if (img.src === "http://localhost:3000/Camagru/img/3.png"){
                    context.drawImage(img, 250, 125, 100, 100);
                }
                else if (img.src === "http://localhost:3000/Camagru/img/4.png"){
                    context.drawImage(img, 0, 0, 400, 300);
                }
                else if (img.src === "http://localhost:3000/Camagru/img/5.png"){
                    context.drawImage(img, 65, 114, 250, 250);
                }
                var dataURL = canvas.toDataURL('image/png');
                document.getElementById("imgsrc").value = dataURL;
            }
        });
    });}
    
    chooseimg();

    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 400, 300);
        videoflag = 1;
    });

})();