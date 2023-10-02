//add canvas ctx
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const pixelsPerMeter = 150;
const camOffset = {x:60*500/canvas.height,y:450*500/canvas.height};


let mousePositionMeters = {x:0,y:0};
let degreesToRadians = Math.PI/180;

const rect = canvas.getBoundingClientRect();


let stageOneAngle = 0;
let stageTwoAngle = Math.PI;

function onFrame(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //draw a crosshair on the origin
    drawCrosshair("red",0,0);

    //draw crosshair on last click
    drawCrosshair("blue",mousePositionMeters.x,mousePositionMeters.y);

    //draw crosshair on calculated end effector position
    drawCrosshair("green",calculateEFPosition(stageOneAngle,stageTwoAngle).x,calculateEFPosition(stageOneAngle,stageTwoAngle).y);

    let desiredAngles = calculateArmAngles(mousePositionMeters.x,mousePositionMeters.y);
    if(!isNaN(desiredAngles.stageOne) && !isNaN(desiredAngles.stageTwo)){
        stageOneAngle = stageOneAngle + (desiredAngles.stageOne - stageOneAngle)* 0.05;
        stageTwoAngle = stageTwoAngle + (desiredAngles.stageTwo - stageTwoAngle)* 0.05;
    }


    //line from ef to last click
    drawArms();

    requestAnimationFrame(onFrame);
}
requestAnimationFrame(onFrame);


function drawArms(){
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(metersToPixels(0,0).x,metersToPixels(0,0).y);
    let firstStageEndMeters = {x:stageOneLength*Math.cos(stageOneAngle),y:stageOneLength*Math.sin(stageOneAngle)};
    let firstStageEndPixels = metersToPixels(firstStageEndMeters.x,firstStageEndMeters.y);
    ctx.lineTo(firstStageEndPixels.x,firstStageEndPixels.y);

    let secondStageEndMeters = {x:firstStageEndMeters.x+stageTwoLength*Math.cos(stageOneAngle+stageTwoAngle-Math.PI),y:firstStageEndMeters.y+stageTwoLength*Math.sin(stageOneAngle+stageTwoAngle-Math.PI)};
    let secondStageEndPixels = metersToPixels(secondStageEndMeters.x,secondStageEndMeters.y);
    ctx.lineTo(secondStageEndPixels.x,secondStageEndPixels.y);

    ctx.stroke();

    //draw text at top of screen with angles
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText("Stage One Angle: " + (stageOneAngle/degreesToRadians).toFixed(2) + "*", 10, 20);
    ctx.fillText("Stage Two Angle: " + (stageTwoAngle/degreesToRadians).toFixed(2) + "*", 10, 32);
    ctx.fillText("Real End Effector Position: (" + secondStageEndMeters.x.toFixed(2) + ", " + secondStageEndMeters.y.toFixed(2) + ")", 10, 44);

    //calculated end effector position
    let efPosition = calculateEFPosition(stageOneAngle,stageTwoAngle);
    ctx.fillText("Your End Effector Position: (" + efPosition.x.toFixed(2) + ", " + efPosition.y.toFixed(2) + ")", 240, 20);
    //calculated angles for end effector position
    let calculatedAngles = calculateArmAngles(mousePositionMeters.x,mousePositionMeters.y);
    ctx.fillText("Your Stage One Angle: " + (calculatedAngles.stageOne/degreesToRadians).toFixed(2) + "*", 240, 32);
    ctx.fillText("Your Stage Two Angle: " + (calculatedAngles.stageTwo/degreesToRadians).toFixed(2) + "*", 240, 44);

}


//mousemove event
canvas.addEventListener("mousedown",function(e){
    mousePositionMeters = pixelsToMeters(e.clientX - rect.x,e.clientY - rect.y);
});

function pixelsToMeters(x, y){
    return {
        x: (x - camOffset.x) / pixelsPerMeter,
        y: (camOffset.y - y) / pixelsPerMeter};
}

function metersToPixels(x, y){
    return {
        x: x * pixelsPerMeter + camOffset.x,
        y: camOffset.y - y * pixelsPerMeter
    };
}


function drawCrosshair(style, xMeters, yMeters){
    ctx.beginPath();
    ctx.strokeStyle = style;
    ctx.moveTo(metersToPixels(xMeters-0.05,yMeters).x,metersToPixels(xMeters-0.05,yMeters).y);
    ctx.lineTo(metersToPixels(xMeters+0.05,yMeters).x,metersToPixels(xMeters+0.05,yMeters).y);
    ctx.moveTo(metersToPixels(xMeters,yMeters-0.05).x,metersToPixels(xMeters,yMeters-0.05).y);
    ctx.lineTo(metersToPixels(xMeters,yMeters+0.05).x,metersToPixels(xMeters,yMeters+0.05).y);
    ctx.stroke();
}

