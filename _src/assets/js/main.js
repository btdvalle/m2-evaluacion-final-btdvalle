"use strict";

const btn = document.querySelector(".js-btn");
const series = [];
const favorites = [];

//FASE 1
const searchInServer = function(ev) {
  ev.preventDefault();
  const searcherInput = document.querySelector(".js-input");
  const searcherInputValue = searcherInput.value;
  const url = `http://api.tvmaze.com/search/shows?q=${searcherInputValue}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      formatAndSafeDataInSeries(data);
      printSeries();
      listenClickAtList();
    });
};

const formatAndSafeDataInSeries = function(data) {
  console.log(data);
  for (const serie of data) {
    series.push({
      name: serie.show.name,
      img: hasImage(serie)
    });
  }
  console.log(series);
};

const hasImage = function(serie) {
  if (serie.show.image === null) {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${serie.show.name}`;
  } else {
    return serie.show.image.medium;
  }
};

const printSeries = function() {
  const ulSeries = document.querySelector(".js-ul-series");
  let htmlcode = "";
  for (let indexLi = 0; indexLi < series.length; indexLi++) {
    htmlcode += `<li class= "list-item ${getFavoriteClass(indexLi)}" data-index="${indexLi}">`;
    htmlcode += `<div class="img-container" data-index="${indexLi}">`;
    htmlcode += `<img class="img" src="${series[indexLi].img}" />`;
    htmlcode += "</div>";
    htmlcode += `<h2 class="title">${series[indexLi].name}</h2>`;
    htmlcode += "</li>";
  }
  ulSeries.innerHTML = htmlcode;
};
//FASE 2
//se puede poner más arriba?

const listenClickAtList = function() {
  const listItems = document.querySelectorAll(".list-item");
  for (const item of listItems) {
    item.addEventListener("click", whenClick);
  }
};

const clickAtList = function(ev) {
  const currentTarget = ev.currentTarget;
  const serieIndex = currentTarget.dataset.index;
  return parseInt(serieIndex);
};

const whenClick = function(ev) {
  const serieIndex = clickAtList(ev);
  if (isInFavorites(serieIndex)) {
    removeFromFavorites(serieIndex);
  } else {
    addToFavorites(serieIndex);
    printFavorites(serieIndex);
  }
  printSeries();
  listenClickAtList();
};

const isInFavorites = function(serieIndex) {
  const foundInFavs = favorites.indexOf(serieIndex);
  if (foundInFavs < 0) {
    return false;
  } else {
    return true;
  }
};

const addToFavorites = function(serieIndex) {
  console.log(favorites);
  favorites.push(serieIndex);
  console.log(favorites);
};

const removeFromFavorites = function(serieIndex) {
  const foundInFavs = favorites.indexOf(serieIndex);
  console.log(favorites);
  favorites.splice(foundInFavs, 1);
  console.log(favorites);
};

const getFavoriteClass = function(serieIndex) {
  if (isInFavorites(serieIndex)) {
    return "favorite";
  } else {
    return "";
  }
};

const printFavorites = function(serieIndex) {
  const ulAside = document.querySelector(".js-ul-aside");
  let htmlcode = "";
  htmlcode += `<li class= "list-item ${getFavoriteClass(serieIndex)}" data-index="${serieIndex}">`;
  htmlcode += `<div class="img-container" data-index="${serieIndex}">`;
  htmlcode += `<img class="img" src="${series[serieIndex].img}" />`;
  htmlcode += "</div>";
  htmlcode += `<h2 class="title">${series[serieIndex].name}</h2>`;
  htmlcode += "</li>";
  ulAside.innerHTML += htmlcode;
};

const unprintFavorites = function(serieIndex) {
  const ulAside = document.querySelector(".js-ul-aside");
  let htmlcode = "";
  htmlcode -= `<li class= "list-item ${getFavoriteClass(serieIndex)}" data-index="${serieIndex}">`;
  htmlcode -= `<div class="img-container" data-index="${serieIndex}">`;
  htmlcode -= `<img class="img" src="${series[serieIndex].img}" />`;
  htmlcode -= "</div>";
  htmlcode -= `<h2 class="title">${series[serieIndex].name}</h2>`;
  htmlcode -= "</li>";
  ulAside.innerHTML += htmlcode;
};

//ejecutar funciones
btn.addEventListener("click", searchInServer);
