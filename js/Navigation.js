var TargetDesc = {
    shape : ["Viereck","Kreis"],
    amount : ["zwei","zwei"],
    shapep : ["Kreis","Viereck"],
    amountp : ["drei","drei"]
};

var Instructions = [
    'Bitte dreh dein Tablet jetzt quer.',
    'leer',
    'leer',
    'Bitte dreh Dein Tablet und lass es für die gesamte Aufgabe in dieser Position',
    'In dieser Aufgabe geht es darum, möglichst schnell Blumen zu sortieren. Dafür musst Du Dich gut konzentrieren.',
    'Die Blumen in dieser Aufgabe können unterschiedlich aussehen. Sie haben unterschiedlich viele rote Blütenblätter <img src="img/Bluetenblatt.png" class="small-element"> und in der Mitte entweder einen blauen Kreis <img src="img/Kreis.png" class="small-element"> oder ein blaues Viereck <img src="img/Viereck.png" class="small-element">. Wenn Du auf "Weiter" klickst, erklären wir Dir die Regeln.',
    'Blumen mit diesen Kombinationen sollst Du nach OBEN schieben:',
    'Wenn der Kasten hier dunkel wird, drehen sich die Regeln aber um.',
    'Bevor es richtig losgeht, üben wir ein bisschen. Du siehst gleich eine ganze Reihe mit Blumen. Schiebe bitte alle Blumen, die Du Dir gerade gemerkt hast nach oben. Bitte fang ganz links an. Wenn Du eine Blume richtig sortiert hast, bekommt sie einen grünen Rahmen. Wenn Du falsch sortiert hast, wird der Rahmen rot und du musst die Blume korrigieren.',
    'Nun kann es richtig losgehen. Wenn Du auf ‚WEITER‘ klickst, beginnt die Aufgabe und sagt Dir nicht mehr, ob Du richtig oder falsch sortiert hast. Du hast dann 3 Minuten Zeit, so viele Blumen wie möglich zu sortieren. Bitte beginne immer mit der ersten Blume ganz links und arbeite so schnell wie möglich.<br> Wenn Du die Erklärung nochmal lesen willst, klicke bitte auf "Zurück".',
    'Vielen Dank, dass Du bei dieser Aufgabe mitgemacht hast :)'
];


var FeedbackText = {
    target  : "Falsch, Blumen mit einem " + TargetDesc.shape[Settings.version] + " in der Mitte und " + TargetDesc.amount[Settings.version] + " roten Blütenblättern oder mit einem " + TargetDesc.shapep[Settings.version] + " in der Mitte und " + TargetDesc.amountp[Settings.version] + " roten Blütenblättern müssen nach oben geschoben werden. Bitte schiebe die Blume nach oben.",
    distr   : "Falsch, nur Blumen mit einem " + TargetDesc.shape[Settings.version] + " in der Mitte und " + TargetDesc.amount[Settings.version] + " roten Blütenblättern oder Blumen mit einem " + TargetDesc.shapep[Settings.version] + " in der Mitte und " + TargetDesc.amountp[Settings.version] + " roten Blütenblättern dürfen nach oben geschoben werden. Bitte schiebe die Blume nach unten.",
    targetS : "Fast richtig! Der Kasten ist jetzt dunkel. Nur Blumen mit einem " + TargetDesc.shape[Settings.version] + " in der Mitte und " + TargetDesc.amount[Settings.version] + " roten Blütenblättern oder Blumen mit einem " + TargetDesc.shapep[Settings.version] + " in der Mitte und " + TargetDesc.amountp[Settings.version] + " roten Blütenblättern dürfen nach unten geschoben werden. Bitte schiebe die Blume nach oben.",
    distrS  : "Fast richtig! Der Kasten ist jetzt dunkel. Blumen mit einem " + TargetDesc.shape[Settings.version] + " in der Mitte und " + TargetDesc.amount[Settings.version] + " roten Blütenblättern oder mit einem " + TargetDesc.shapep[Settings.version] + " in der Mitte und " + TargetDesc.amountp[Settings.version] + " roten Blütenblättern müssen nach unten geschoben werden. Bitte schiebe die Blume nach unten."
};

function nextInstruction() {
switch (Settings.currentInst) {
    case 2:
        Participant.birth = document.getElementById("txtBirth").value;
        Participant.sex = parseInt($('input[name="sex"]:checked').val());
        Participant.color = parseInt($('input[name="color"]:checked').val());
        document.getElementById("divDemo").classList.toggle("hidden");
        sendResults();
        Participant.phpCode = phpCodes.Feedback;
        
        if (jQuery(window).height() < jQuery(window).width()) {
            Settings.currentInst++;
        }

        break;
    case 3:  
        document.getElementById("contInst").innerHTML = "Weiter";
        if (jQuery(window).height() > jQuery(window).width()) {
            Settings.currentInst--;
            alert("Dein Gerät ist noch im Hochkant-Format. Bitte halte es für die Testung quer.");
        }
        break;
    case 4:
        for (let i = 0; i < document.getElementsByClassName("Stimulus-ex").length; i++) {
            let element = document.getElementsByClassName("Stimulus-ex")[i];
            element.classList.toggle("hidden");
        }
        break;
    case 5:
        for (let i = 0; i < document.getElementsByClassName("Stimulus-ex").length; i++) {
            let element = document.getElementsByClassName("Stimulus-ex")[i];
            element.classList.toggle("hidden");
        }
        document.getElementById("divExamples").classList.toggle("hidden");
        break;
    case 6:
        document.getElementById("Frame").classList.add("switch");
        document.getElementById("divExamples").classList.toggle("hidden");
        break;
    case 7: 
        document.getElementById("Frame").classList.remove("switch");
        Settings.currentPage--;
        break;
    case 8: 
        document.getElementById("Manual").classList.toggle("hidden");
        document.getElementById("TestContainer").classList.toggle("hidden");
        document.getElementById("Frame").classList.remove("overflow");
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        endExplo();
        document.getElementById("backInst").classList.toggle("hidden");
        break;
    case 9:
        sendResults();
        document.getElementById("Frame").classList.remove("overflow");
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        document.getElementById("Manual").classList.toggle("hidden");
        document.getElementById("TestContainer").classList.toggle("hidden");
        document.getElementById("progress").classList.toggle("hidden");
        document.getElementById("backInst").classList.toggle("hidden");
        switchRow();
        Participant.phpCode = phpCodes.Update;
        RT.pre = Date.now();
        document.getElementById("contInst").classList.toggle("hidden");
        progressInterval = setInterval(progressBar,33);
        break;
    default:
        break;
}
    
    Settings.currentInst++;
    document.getElementById("instText").innerHTML = Instructions[Settings.currentInst];
    
}

function resetInstruction() {
    document.getElementById("backInst").classList.add("hidden");
    Settings.currentInst = 5;
    Settings.currentPage = 5;
    Settings.feedbackPages = 0;
    Participant.InstRep++;
    nextInstruction();
    for (let i = 0; i < document.getElementsByClassName("Stimulus-ex").length; i++) {
        let element = document.getElementsByClassName("Stimulus-ex")[i];
        element.classList.add("hidden");
    }
}
function preventDefault(e){
    e.preventDefault();
}

document.getElementById("contInst").addEventListener("click",nextInstruction,true);
document.getElementById("backInst").addEventListener("click",resetInstruction,true);
document.getElementById("lock-btn").addEventListener("click",openLock,false);
initTest();

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

if (window.location.href.split("?")[1]==="download") {
    download("download.csv",jtc2(getLocal()));
}

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);