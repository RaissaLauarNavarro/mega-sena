var state = {board: [], currentGame: [], savedGames: []}

function start(){
    createBoard();
    newGame();
    // renderSavedGames();
    readLocalStorage();
}




function readLocalStorage(){
    if(!window.localStorage){ //se não houver a função de salvar no local storage
        return;
    }
    
    var saveFromLocalStorage = window.localStorage.getItem('saved-games');  //obtem os dados do local storage a partir dessa chave
    if(saveFromLocalStorage){
        state.savedGames = JSON.parse(saveFromLocalStorage); //transformas os dados em arquivo js
    }
}


function writeToLocalStorage(){
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}


function createBoard(){
    state.board = [];
    for (var i = 1; i <= 60; i++){
        state.board.push(i);
    }
}


function newGame(){
    resetGame();
    render();
}


function render(){
    renderBoard();
    renderButtons();
    renderSavedGames();
}


function renderBoard(){
    var divBoard = document.querySelector('#megasena-board');
    divBoard.innerHTML = '';

    var ulNumbers = document.createElement('ul'); //cria uma lista não-ordenada dentro da div divBoard
    ulNumbers.classList.add('numbers');

    for(var i = 0; i < state.board.length; i++){
        var number = state.board[i];
        
        var liNumber = document.createElement('li'); //cria os elementos da lista
        liNumber.textContent = number;               //define o texto dos elementos da lista como os números de 1 a 60
        liNumber.classList.add('number');
        
        liNumber.addEventListener('click', handleNumberClick); //adicionou um evento de click

        if(isNumberInGame(number)){
            liNumber.classList.add('selected-number');
        }

        ulNumbers.appendChild(liNumber);
    }

    divBoard.appendChild(ulNumbers);
}


function renderButtons(){
    var divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';

    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame); //insere o elemento html button
    divButtons.appendChild(buttonRandomGame); 
    divButtons.appendChild(buttonSaveGame); 

}


function createNewGameButton(){
    var button = document.createElement('button');
    button.textContent = 'novo jogo';

    button.addEventListener('click', newGame);

    return button;
}


function createRandomGameButton(){
    var button = document.createElement('button');
    button.textContent = 'jogo aleatório';

    button.addEventListener('click', randomGame);

    return button;
}


function createSaveGameButton(){
    var button = document.createElement('button');
    button.textContent = 'salvar jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame);

    return button;
}


function renderSavedGames(){
    var divSaveGames = document.querySelector('#megasena-seved-games');
    divSaveGames.innerHTML = '';

    if (state.savedGames.length === 0){
        divSaveGames.innerHTML = '<p>Nenhum jogo salvo</p>';
    }else {
        var ulSavedgames = document.createElement('ul');
        for(var i = 0; i < state.savedGames.length; i++){
            var currentGameToList = state.savedGames[i];

            var liGame = document.createElement('li');
            liGame.textContent = currentGameToList.join(', '); //o join coloca um espaço entre os elementos da lista 

            ulSavedgames.appendChild(liGame);
        }
        
        divSaveGames.appendChild(ulSavedgames);
    }
}


function handleNumberClick(event){
    var value = Number(event.currentTarget.textContent); //obteve o numero que foi clicado

    if(isNumberInGame(value)){
        removeNumberFromGame(value);
    }else {
        addNumber(value);
    }

    render();
}


function addNumber(numberToAdd) {
    if (numberToAdd < 1 || numberToAdd > 68){
        console.error('Número inválido', numberToAdd);
        return;
    }

    if (state.currentGame.length >= 6){
        console.error('O jogo já está completo');
        return;
    }

    if (isNumberInGame(numberToAdd)){
        console.error('Esse número já está no jogo', numberToAdd);
        return; 
    }

    state.currentGame.push(numberToAdd); //adiciona o elemento no final da lista
}


function removeNumberFromGame(numberToRemove) {
    var newGame = [];

    if (numberToRemove < 1 || numberToRemove > 68){
        console.error('Número inválido', numberToRemove);
        return;
    }

    for (var i = 0; i < state.currentGame.length; i++) {
        var currentNumber = state.currentGame[i];

        if (currentNumber === numberToRemove){
            continue;   
        }

        newGame.push(currentNumber); 
    }

    state.currentGame = newGame;
}


function isNumberInGame(numberToCheck){
    // if (state.currentGame.includes(numberToCheck)){
    //     return true;
    // }

    // return false;

    return state.currentGame.includes(numberToCheck);   
}


function saveGame(){
    if (!isGameComplete()){
        console.error('O jogo não está completo');
        return;
    }

    state.savedGames.push(state.currentGame);
    writeToLocalStorage();
    newGame();
}


function isGameComplete(){
    return state.currentGame.length === 6;
}


function resetGame(){
    state.currentGame = [];
}


function randomGame(){
    resetGame();

    while(!isGameComplete()){
        var randomNumber = Math.ceil(Math.random() * 60);
        addNumber(randomNumber);
    }

    render();
}


start();