function sisterParse(dropID) {

    let sisterDrop = "";


    if (dropID === "addingCourse") { sisterDrop = "AddCourse" };
    if (dropID === "Mon8:00" || dropID === "Mon8:30") { sisterDrop = "Thu8:30" };
    if (dropID === "Mon9:30" || dropID === "Mon10:00") { sisterDrop = "Thu10:00" };
    if (dropID === "Mon11:00" || dropID === "Mon11:30") { sisterDrop = "Thu11:30" };
    if (dropID === "Mon12:30" || dropID === "Mon1:00") { sisterDrop = "Thu1:00" };
    if (dropID === "Mon2:30" || dropID === "Mon2:00") { sisterDrop = "Thu2:30" };
    if (dropID === "Mon3:30" || dropID === "Mon4:00") { sisterDrop = "Thu4:00" };
    if (dropID === "Mon5:30") { sisterDrop = "Wed5:30" };
    if (dropID === "Mon7:00") { sisterDrop = "Wed7:00" };

    if (dropID === "Tue8:00" || dropID === "Tue8:30") { sisterDrop = "Fri8:30" };
    if (dropID === "Tue9:30" || dropID === "Tue10:00") { sisterDrop = "Fri10:00" };
    if (dropID === "Tue11:00" || dropID === "Tue11:30") { sisterDrop = "Fri11:30" };
    if (dropID === "Tue12:30" || dropID === "Tue1:00") { sisterDrop = "Fri1:00" };
    if (dropID === "Tue2:30" || dropID === "Tue2:00") { sisterDrop = "Fri2:30" };
    if (dropID === "Tue3:30" || dropID === "Tue4:00") { sisterDrop = "Fri4:00" };
    if (dropID === "Tue5:30") { sisterDrop = "Thu5:30" };
    if (dropID === "Tue7:00") { sisterDrop = "Thu7:00" };

    if (dropID === "Wed9:00" || dropID === "Wed8:30") { sisterDrop = "Wed10:30" };
    if (dropID === "Wed11:30" || dropID === "Wed12:15") { sisterDrop = "Wed1:45" };

    /*
        if (dropID === "Mon5:00" || dropID === "Mon5:30") { sisterDrop = "Mon7:00" };
        if (dropID === "Tue5:00" || dropID === "Tue5:30") { sisterDrop = "Tue7:00" };
        if (dropID === "Wed5:30") { sisterDrop = "Wed7:00" };
        if (dropID === "Thu5:30") { sisterDrop = "Thu7:00" };

        //if (dropID === "Wed8:30") { sisterDrop = "Wed10:00" };
        //if (dropID === "Wed11:30") { sisterDrop = "Wed1:00" };
    */


    return sisterDrop;
};

function translateNewTimes(currTime) {

    let newTime = "";

    if (currTime === "Mon8:00" || currTime === "Mon8:30") { newTime = "Mon8:30" };
    if (currTime === "Mon9:30" || currTime === "Mon10:00") { newTime = "Mon10:00" };
    if (currTime === "Mon11:00" || currTime === "Mon11:30") { newTime = "Mon11:30" };
    if (currTime === "Mon12:30" || currTime === "Mon1:00") { newTime = "Mon1:00" };
    if (currTime === "Mon2:30" || currTime === "Mon2:00") { newTime = "Mon2:30" };
    if (currTime === "Mon3:30" || currTime === "Mon4:00") { newTime = "Mon4:00" };
    if (currTime === "Mon5:00" || currTime === "Mon5:30") { newTime = "Mon5:30" };
    if (currTime === "Mon6:30" || currTime === "Mon7:00") { newTime = "Mon7:00" };

    if (currTime === "Tue8:00" || currTime === "Tue8:30") { newTime = "Tue8:30" };
    if (currTime === "Tue9:30" || currTime === "Tue10:00") { newTime = "Tue10:00" };
    if (currTime === "Tue11:00" || currTime === "Tue11:30") { newTime = "Tue11:30" };
    if (currTime === "Tue12:30" || currTime === "Tue1:00") { newTime = "Tue1:00" };
    if (currTime === "Tue2:30" || currTime === "Tue2:00") { newTime = "Tue2:30" };
    if (currTime === "Tue3:30" || currTime === "Tue4:00") { newTime = "Tue4:00" };
    if (currTime === "Tue5:00" || currTime === "Tue5:30") { newTime = "Tue5:30" };
    if (currTime === "Tue6:30" || currTime === "Tue7:00") { newTime = "Tue7:00" };

    ////ADDITION TO PARSE NEW WEDNESDAY TIMES: FEB 2022
    if (currTime === "Wed9:00" || currTime === "Wed8:30") { newTime = "Wed9:00" };
    if (currTime === "Wed10:00" || currTime === "Wed10:30") { newTime = "Wed10:30" };
    if (currTime === "Wed12:15" || currTime === "Wed11:30") { newTime = "Wed12:15" };
    if (currTime === "Wed1:45") { newTime = "Wed1:45" };
    if (currTime === "Wed5:00" || currTime === "Wed5:30") { newTime = "Wed5:30" };
    if (currTime === "Wed6:30" || currTime === "Wed7:00") { newTime = "Wed7:00" };

    if (currTime === "Thu8:00" || currTime === "Thu8:30") { newTime = "Thu8:30" };
    if (currTime === "Thu9:30" || currTime === "Thu10:00") { newTime = "Thu10:00" };
    if (currTime === "Thu11:00" || currTime === "Thu11:30") { newTime = "Thu11:30" };
    if (currTime === "Thu12:30" || currTime === "Thu1:00") { newTime = "Thu1:00" };
    if (currTime === "Thu2:30" || currTime === "Thu2:00") { newTime = "Thu2:30" };
    if (currTime === "Thu3:30" || currTime === "Thu4:00") { newTime = "Thu4:00" };
    if (currTime === "Thu5:00" || currTime === "Thu5:30") { newTime = "Thu5:30" };
    if (currTime === "Thu6:30" || currTime === "Thu7:00") { newTime = "Thu7:00" };


    if (currTime === "Fri8:00" || currTime === "Fri8:30") { newTime = "Fri8:30" };
    if (currTime === "Fri9:30" || currTime === "Fri10:00") { newTime = "Fri10:00" };
    if (currTime === "Fri11:00" || currTime === "Fri11:30") { newTime = "Fri11:30" };
    if (currTime === "Fri12:30" || currTime === "Fri1:00") { newTime = "Fri1:00" };
    if (currTime === "Fri2:30" || currTime === "Fri2:00") { newTime = "Fri2:30" };
    if (currTime === "Fri3:30" || currTime === "Fri4:00") { newTime = "Fri4:00" };


    return newTime;
}

function doubleClassParse(dropID) {

    //console.log("doubleClassParse: ", dropID);

    switch (dropID) {

        case "Mon8:30":
            dcDrop = "Mon10:00";
            break;

        case 'Mon10:00':
            dcDrop = "Mon11:30";
            break;

        case 'Mon11:30':
            dcDrop = "Mon1:00";
            break;

        case 'Mon1:00':
            dcDrop = 'Mon2:30';
            break;

        case 'Mon2:30':
            dcDrop = "Mon4:00";
            break;

        case 'Mon4:00':
            dcDrop = "Mon5:30";
            break;

        case 'Mon5:30':
            dcDrop = "Mon7:00";
            break;

        case 'Mon7:00':
            dcDrop = "Cannot Drop";
            break;


        case "Tue8:30":
            dcDrop = "Tue10:00";
            break;

        case 'Tue10:00':
            dcDrop = "Tue11:30";
            break;

        case 'Tue11:30':
            dcDrop = "Tue1:00";
            break;

        case 'Tue1:00':
            dcDrop = 'Tue2:30';
            break;

        case 'Tue2:30':
            dcDrop = "Tue4:00";
            break;

        case 'Tue4:00':
            dcDrop = "Tue5:30";
            break;

        case 'Tue5:30':
            dcDrop = "Tue7:00";
            break;

        case 'Tue7:00':
            dcDrop = "Cannot Drop";
            break;



        case 'Wed9:00':
            dcDrop = "Wed10:30";
            break;

        case 'Wed12:15':
            dcDrop = "Wed1:45";
            break;

        case 'Wed5:30':
            dcDrop = "Wed7:00";
            break;

        case 'Wed7:00':
            dcDrop = "Cannot Drop";
            break;


        case "Thu8:30":
            dcDrop = "Thu10:00";
            break;

        case 'Thu10:00':
            dcDrop = "Thu11:30";
            break;

        case 'Thu11:30':
            dcDrop = "Thu1:00";
            break;

        case 'Thu1:00':
            dcDrop = 'Thu2:30';
            break;

        case 'Thu2:30':
            dcDrop = "Thu4:00";
            break;

        case 'Thu4:00':
            dcDrop = "Thu5:30";
            break;

        case 'Thu5:30':
            dcDrop = "Thu7:00";
            break;

        case 'Thu7:00':
            dcDrop = "Cannot Drop";
            break;


        case "Fri8:30":
            dcDrop = "Fri10:00";
            break;

        case 'Fri10:00':
            dcDrop = "Fri11:30";
            break;

        case 'Fri11:30':
            dcDrop = "Fri1:00";
            break;

        case 'Fri1:00':
            dcDrop = 'Fri2:30';
            break;

        case 'Fri2:30':
            dcDrop = "Fri4:00";
            break;

        case 'Fri4:00':
            dcDrop = "Cannot Drop";
            break;


        default:
            dcDrop = "Invalid time";

    };
    return dcDrop;
};


function chopAMPM(timeStr) {

    timeStr = timeStr.slice(0, -3);
    return timeStr;
}