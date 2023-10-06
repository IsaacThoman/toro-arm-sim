const stageOneLength= 0.7303
const stageTwoLength =  0.7303;
const kP = 0.1;

function calculateEFPosition(ang1,ang2){

    let stageOneEndX = stageOneLength * Math.cos(ang1);
    let stageOneEndY = stageOneLength * Math.sin(ang1);

    let stageTwoEndX = stageOneEndX + stageTwoLength * -Math.cos(ang1+ang2);
    let stageTwoEndY = stageOneEndY + stageTwoLength * -Math.sin(ang1+ang2);

    return {x:stageTwoEndX,y:stageTwoEndY};
}

function calculateArmAngles(x, y){
    let stageOneRad = NetworkTables.getValue("/arm-sim/stageOneReference",1);
    let stageTwoRad = NetworkTables.getValue("/arm-sim/stageTwoReference",1);

    if(isNaN(stageOneRad) || isNaN(stageTwoRad)){
        return {stageOne:0,stageTwo:0};
    }
    return{stageOne:stageOneRad,stageTwo:stageTwoRad};
}


function calculateArmAnglesOld(x, y){

    let hypot = Math.hypot(x,y);
    let stageTwoAngle = Math.acos((Math.pow(stageTwoLength,2) + Math.pow(stageOneLength,2) - Math.pow(hypot,2)) / (2*stageOneLength * stageTwoLength) );
    let stageOneAngle = Math.acos((Math.pow(stageOneLength,2) + Math.pow(hypot,2) - Math.pow(stageTwoLength,2)) / (2*stageOneLength * hypot));

    stageOneAngle+=Math.atan2(y,x);
    return {stageOne:stageOneAngle, stageTwo:stageTwoAngle}
}

