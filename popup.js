// Popup logic
// Add focus to the first button initially
function yesButtonSelected(event){
    popup.classList.add("disable");
    loadAds(event)
};

function noButtonSelected(event){
    window.location.href = "https://html.spec.whatwg.org/#the-cross-origin-opener-policy-header";
};

function resetButtonSelected(event){
    resetPopup.classList.add("disable")
    resetPopup.classList.remove("able");
    gameContainer.classList.add("disable")
    gameContainer.classList.remove("able");
    controls.classList.add("disable")
    controls.classList.remove("able");
    
    loadAds(event);
};
