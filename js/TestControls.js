var Stimulus = document.getElementsByClassName('Stimulus');

var Style = {
	x		:	0,
	y		:	0,
	getStyle	:	function() {
		x = 0;
		y = 0;
		if (Stimulus[Settings.lastTouch].style.left) {
			this.x = parseInt(Stimulus[Settings.lastTouch].style.left);
		}
		if (Stimulus[Settings.lastTouch].style.top) {
			this.y = parseInt(Stimulus[Settings.lastTouch].style.top);
		}
	}
};
var CursorPos = {
	x		:	0,
	y		:	0,
	getPos	:	function(e) {
		if (e.touches) {
			this.x = e.touches[0].clientX;
			this.y = e.touches[0].clientY;
		}
		else {
			this.x = e.pageX;
			this.y = e.pageY;	
		}
	}
};
var StimOffset = {
	x		:	0,
	y		:	0,
	getPos	:	function() {
		this.x = Stimulus[Settings.lastTouch].offsetLeft;
		this.y = Stimulus[Settings.lastTouch].offsetTop;
	}
};
var TouchOffset = {
	x		:	0,
	y		:	0,
	getOffset : function(e) {
		CursorPos.getPos(e);
		this.x = CursorPos.x - StimOffset.x;
		this.y = CursorPos.y - StimOffset.y;
	}
};

function endExplo() {
	for (let index = 0; index < Stimulus.length; index++) {
		Stimulus[index].removeEventListener("touchstart",_touchstart,true);
		Stimulus[index].removeEventListener("mousedown",_touchstart,true);
	}
	Stimulus[Settings.currentItem].addEventListener("touchstart",_touchstart,true);
	Stimulus[Settings.currentItem].addEventListener("mousedown",_touchstart,true);

	nextRow();
	Settings.TestState = 1;
}

function giveFeed(input) {
	Stimulus[Settings.lastTouch].classList.remove("Item_wrong");
	Stimulus[Settings.lastTouch].classList.remove("Item_correct");
	if (Settings.switch[Settings.currentPage][Settings.currentItem]=="0" && Settings.pages[Settings.currentPage][Settings.currentItem][0]=="t" && input==-1) {
		if (typeof navigator.notification !== "undefined") {
			navigator.notification.alert(
				FeedbackText.target,  // message
				function() {},         // callback
				'Fehler',            // title
				'Weiter'                  // buttonName
			);
		}else alert(FeedbackText.target);
		snapItem("bottom");
		Stimulus[Settings.lastTouch].classList.add("Item_wrong");
		Participant.mistakes +=1;
	} else if (Settings.switch[Settings.currentPage][Settings.currentItem]=="0" && Settings.pages[Settings.currentPage][Settings.currentItem][0]=="d" && input==1) {
		if (typeof navigator.notification !== "undefined") {
			navigator.notification.alert(
				FeedbackText.distr,  // message
				function() {},         // callback
				'Fehler',            // title
				'Weiter'                  // buttonName
			);
		}else alert(FeedbackText.distr);
		snapItem("top");
		Stimulus[Settings.lastTouch].classList.add("Item_wrong");
		Participant.mistakes +=1;
	} else if (Settings.switch[Settings.currentPage][Settings.currentItem]=="1" && Settings.pages[Settings.currentPage][Settings.currentItem][0]=="t" && input==1) {
		if (typeof navigator.notification !== "undefined") {
			navigator.notification.alert(
				FeedbackText.distrS,  // message
				function() {},         // callback
				'Fehler',            // title
				'Weiter'                  // buttonName
			);
		}else alert(FeedbackText.distrS);
		snapItem("top");
		Stimulus[Settings.lastTouch].classList.add("Item_wrong");
		Participant.mistakes +=1;
	} else if (Settings.switch[Settings.currentPage][Settings.currentItem]=="1" && Settings.pages[Settings.currentPage][Settings.currentItem][0]=="d" && input==-1) {
		if (typeof navigator.notification !== "undefined") {
			navigator.notification.alert(
				FeedbackText.targetS,  // message
				function() {},         // callback
				'Fehler',            // title
				'Weiter'                  // buttonName
			);
		}else alert(FeedbackText.targetS);
		snapItem("bottom");
		Stimulus[Settings.lastTouch].classList.add("Item_wrong");
		Participant.mistakes +=1;
	}
	else if (input == -1) {
		snapItem("bottom");
		Stimulus[Settings.lastTouch].classList.add("Item_correct");
		nextItem();
	} else if (input == 1){
		snapItem("top");
		Stimulus[Settings.lastTouch].classList.add("Item_correct");
		nextItem();		
	}
}

function interpretResponse() {
	var limit = {
		top 		:		Stimulus[Settings.lastTouch].offsetHeight*-1.1, 
		bottom 		: 		Stimulus[Settings.lastTouch].offsetHeight*1.1 
	}
	if (parseInt(Stimulus[Settings.lastTouch].style.top) < limit.top) {
		if (Settings.TestState == 1) {
			giveFeed(1);
			return;
		}
		if (Settings.TestState > 0) {
			saveResponse(1);
		}
		snapItem("top");
		nextItem();
	} else if (parseInt(Stimulus[Settings.lastTouch].style.top) > limit.bottom) {
		if (Settings.TestState == 1) {
			giveFeed(-1);
			return;
		}
		if (Settings.TestState > 0) {
			saveResponse(-1);
		}
		snapItem("bottom");
		nextItem();
	}
	else {
		snapItem("center");
	}
}

function moveContainer(){
	document.getElementById("TestContainer").classList.remove("Animation-out");
	document.getElementById("TestContainer").classList.remove("Animation-in");
	void document.getElementById("TestContainer").offsetWidth; 
	document.getElementById("TestContainer").classList.add("Animation-out");
	for (let i = 0; i < Stimulus.length; i++) {
		Stimulus[i].style.top = "0px";
		
	}
	swapImg();
	document.getElementById("TestContainer").classList.add("Animation-in");
}

function nextItem() {
	Stimulus[Settings.currentItem].removeEventListener("touchstart",_touchstart,true);
	Stimulus[Settings.currentItem].removeEventListener("mousedown",_touchstart,true);
	if (Settings.currentItem>7) {
		Settings.currentItem = 0;
		Stimulus[Settings.currentItem].addEventListener("touchstart",_touchstart,true);
		Stimulus[Settings.currentItem].addEventListener("mousedown",_touchstart,true);
		nextRow();
		// switchRow();
	}
	else{
		Settings.currentItem++;
		Stimulus[Settings.currentItem].addEventListener("touchstart",_touchstart,true);
		Stimulus[Settings.currentItem].addEventListener("mousedown",_touchstart,true);
		switchTask();
	}
	progressBar();
	RT.pre = Date.now();
	
}

function nextRow() {
	if (Settings.TestState == 1) {
		Settings.feedbackPages--;
		if (Settings.mistakesExceeded == 0 && Participant.mistakes > Settings.maxMistakes) {
			Settings.feedbackPages++;
			Settings.mistakesExceeded = 1;
		}
		if (Settings.mistakesExceeded == 1 && Participant.mistakes > Settings.maxMistakes*2) {
			Settings.feedbackPages++;
			Settings.mistakesExceeded = 2;
		}
		if (Settings.feedbackPages < 1) {
			// Settings.TestState = 2;
			Settings.currentPage = 9;
			document.getElementById("TestContainer").classList.toggle("hidden");
			document.getElementById("Manual").classList.toggle("hidden");
			document.getElementById("Frame").classList.add("overflow");
			document.body.removeEventListener('touchmove', preventDefault, { passive: false });
		}
		for (let i = 0; i < Stimulus.length; i++) {
			Stimulus[i].classList.remove("Item_wrong");
			Stimulus[i].classList.remove("Item_correct");
		}
	}

	moveContainer();
	switchRow();

	if (Settings.feedbackPages < 1 && Settings.TestState == 1) {
		Settings.TestState = 2;
		document.getElementById("Frame").classList.remove("switch");
	}

	if (Settings.currentPage%5 == 0) {
		sendResults();		
	}
}

function saveResponse(value) {
	Participant.response += Settings.lastTouch+1 + Stimulus.length*Settings.currentPage + ":" + value + ",";
	RT.post = Date.now();
	Participant.RT += (Settings.lastTouch+1 + Stimulus.length*Settings.currentPage) + ":" + (RT.post - RT.pre) + ",";
}

function snapItem(pos) {
	if(pos == "center"){
		Stimulus[Settings.lastTouch].style.top  = "0px";
	} else if (pos == "top"){
		Stimulus[Settings.lastTouch].style.top  = Stimulus[Settings.lastTouch].offsetHeight*-0.05 - document.getElementById("Frame").offsetHeight + "px";//*-1.1 + "px";
	} else if (pos == "bottom"){
		Stimulus[Settings.lastTouch].style.top  = Stimulus[Settings.lastTouch].offsetHeight*0.05 + document.getElementById("Frame").offsetHeight + "px";//*1.1 + "px";
	}
}

function swapImg() {
	Settings.currentPage++;
	if (Settings.currentPage > 79) {
		endTest();
		return;
	}
	var i = 0;
	for (const element of Stimulus) {
		itemText = Settings.pages[Settings.currentPage][i];
		if (itemText[0]=="t") {
			let pos = parseInt(itemText[1])-1;		
			element.src = "Stimuli/" + Targets[parseInt(itemText[1])-1][parseInt(itemText[2])-1];
		} else {
			element.src = "Stimuli/" + Distractors[parseInt(itemText[1])-1][parseInt(itemText[2])-1];
		}
		i++;
	}
	switchTask();
}

function switchTask() {
	if (Settings.lastTask != +Settings.switch[Settings.currentPage][Settings.currentItem]) {
		Settings.lastTask = +Settings.switch[Settings.currentPage][Settings.currentItem];
		document.getElementById("Frame").classList.toggle("switch");
	}
}

function switchRow() {
	if (Settings.switch[Settings.currentPage][Settings.currentItem] == "1") {
		document.getElementById("Frame").classList.add("switch");
	}
	else{
		document.getElementById("Frame").classList.remove("switch");
	}
}

function _touchstart(event) {
	Settings.lastTouch = parseInt(event.target.id[event.target.id.length-1])-1;
	StimOffset.getPos();
	TouchOffset.getOffset(event);
	Style.getStyle();
	Stimulus[Settings.lastTouch].addEventListener("touchmove",_touchmove,true);
	Stimulus[Settings.lastTouch].addEventListener("touchend",_touchend,true);
	Stimulus[Settings.lastTouch].addEventListener("mousemove",_touchmove,true);
	Stimulus[Settings.lastTouch].addEventListener("mouseup",_touchend,true);
}

function _touchmove(event) {
	CursorPos.getPos(event);
	Stimulus[Settings.lastTouch].style.top = Style.y + CursorPos.y - StimOffset.y - TouchOffset.y + "px";
}

function _touchend() {
	Stimulus[Settings.lastTouch].removeEventListener("touchmove",_touchmove,true);
	Stimulus[Settings.lastTouch].removeEventListener("touchend",_touchend,true);
	Stimulus[Settings.lastTouch].removeEventListener("mousemove",_touchmove,true);
	Stimulus[Settings.lastTouch].removeEventListener("mouseup",_touchend,true);

	interpretResponse();
}


for (let i = 0; i < Stimulus.length; i++) {
	const element = Stimulus[i];
	element.ondragstart = function(event) {event.preventDefault();};
	
}