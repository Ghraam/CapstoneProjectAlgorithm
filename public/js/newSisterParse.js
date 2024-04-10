function sisterParse(dropID) {
    let sisterDrop = "";

    switch (dropID) {
        case "Monday1":
        case "Monday2":
        case "Monday3":
        case "Monday4":
        case "Monday5":
        case "Monday6":
        case "Monday7":
        case "Monday8":
            sisterDrop = "Thursday" + dropID.slice(6);
            break;
        case "Tuesday1":
        case "Tuesday2":
        case "Tuesday3":
        case "Tuesday4":
        case "Tuesday5":
        case "Tuesday6":
        case "Tuesday7":
        case "Tuesday8":
            sisterDrop = "Friday" + dropID.slice(7);
            break;
        case "Thursday1":
        case "Thursday2":
        case "Thursday3":
        case "Thursday4":
        case "Thursday5":
        case "Thursday6":
        case "Thursday7":
        case "Thursday8":
            sisterDrop = "Monday" + dropID.slice(8);
            break;
        case "Friday1":
        case "Friday2":
        case "Friday3":
        case "Friday4":
        case "Friday5":
        case "Friday6":
            sisterDrop = "Tuesday" + dropID.slice(6);
            break;
        case "WednesdayA1":
            sisterDrop = "WednesdayB1";
            break;
        case "WednesdayB1":
            sisterDrop = "WednesdayA1";
            break;
        default:
            console.error('Invalid dropID:', dropID);
            break;
    }

    return sisterDrop;
}

function translateNewTimes(currTime) {
    let newTime = "";

    switch (currTime) {
        case "Monday1":
        case "Monday2":
        case "Monday3":
        case "Monday4":
        case "Monday5":
        case "Monday6":
        case "Monday7":
        case "Monday8":
            newTime = "Monday" + currTime.slice(7);
            break;
        case "Tuesday1":
        case "Tuesday2":
        case "Tuesday3":
        case "Tuesday4":
        case "Tuesday5":
        case "Tuesday6":
        case "Tuesday7":
        case "Tuesday8":
            newTime = "Tuesday" + currTime.slice(8);
            break;
        case "WednesdayA1":
        case "WednesdayB1":
            newTime = "Wednesday" + currTime.slice(9);
            break;
        case "Thursday1":
        case "Thursday2":
        case "Thursday3":
        case "Thursday4":
        case "Thursday5":
        case "Thursday6":
        case "Thursday7":
        case "Thursday8":
            newTime = "Thursday" + currTime.slice(9);
            break;
        case "Friday1":
        case "Friday2":
        case "Friday3":
        case "Friday4":
        case "Friday5":
        case "Friday6":
            newTime = "Friday" + currTime.slice(7);
            break;
        default:
            console.error('Invalid currTime:', currTime);
            break;
    }

    return newTime;
}

function doubleClassParse(dropID) {
    let dcDrop = "";

    switch (dropID) {
        case "Monday1":
            dcDrop = "Monday2";
            break;
        case "Monday2":
            dcDrop = "Monday3";
            break;
        case "Monday3":
            dcDrop = "Monday4";
            break;
        case "Monday4":
            dcDrop = "Monday5";
            break;
        case "Monday5":
            dcDrop = "Monday6";
            break;
        case "Monday6":
            dcDrop = "Monday7";
            break;
        case "Monday7":
            dcDrop = "Monday8";
            break;
        case "Tuesday1":
            dcDrop = "Tuesday2";
            break;
        case "Tuesday2":
            dcDrop = "Tuesday3";
            break;
        case "Tuesday3":
            dcDrop = "Tuesday4";
            break;
        case "Tuesday4":
            dcDrop = "Tuesday5";
            break;
        case "Tuesday5":
            dcDrop = "Tuesday6";
            break;
        case "Tuesday6":
            dcDrop = "Tuesday7";
            break;
        case "Tuesday7":
            dcDrop = "Tuesday8";
            break;
        case "WednesdayA1":
            dcDrop = "WednesdayA1";
            break;
        case "WednesdayB1":
            dcDrop = "WednesdayB1";
            break;
        case "Wednesday7":
            dcDrop = "Wednesday8";
            break;
        case "Thursday1":
            dcDrop = "Thursday2";
            break;
        case "Thursday2":
            dcDrop = "Thursday3";
            break;
        case "Thursday3":
            dcDrop = "Thursday4";
            break;
        case "Thursday4":
            dcDrop = "Thursday5";
            break;
        case "Thursday5":
            dcDrop = "Thursday6";
            break;
        case "Thursday6":
            dcDrop = "Thursday7";
            break;
        case "Thursday7":
            dcDrop = "Thursday8";
            break;
        case "Friday1":
            dcDrop = "Friday2";
            break;
        case "Friday2":
            dcDrop = "Friday3";
            break;
        case "Friday3":
            dcDrop = "Friday4";
            break;
        case "Friday4":
            dcDrop = "Friday5";
            break;
        case "Friday5":
            dcDrop = "Friday6";
            break;
        case "Friday6":
            dcDrop = "Friday7";
            break;
        default:
            console.error('Invalid dropID:', dropID);
            break;
    }

    return dcDrop;
}
