"use strict";

const btn = document.querySelector(".js-btn");
let series = [];
const favorites = [];

//FASE 2
const searchInServer = function(ev) {
  ev.preventDefault();
  const searcherInput = document.querySelector(".js-input");
  const searcherInputValue = searcherInput.value;
  series = [];
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
//FASE 3
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
  }
  printFavorites();
  setSeriesIntoLocalStorage();
  printSeries();
  listenClickAtList();
  setSeriesIntoLocalStorage();
};

// const isUndefined = function(index) {
//   if (!!index === false) {
//     return 0;
//   } else {
//     return index;
//   }
// };

const isInFavorites = function(serieIndex) {
  if (favorites.length > 0) {
    // const finalSerieIndex = isUndefined(serieIndex);
    const serieName = series[serieIndex].name;
    for (let index = 0; index < favorites.length; index++) {
      if (serieName === favorites[index].name) {
        return true;
      }
    }
  }
  return false;
};

const addToFavorites = function(serieIndex) {
  favorites.push({
    name: series[serieIndex].name,
    img: series[serieIndex].img,
    index: serieIndex
  });
  console.log(favorites);
};

const removeFromFavorites = function(serieIndex) {
  const serieName = series[serieIndex].name;
  for (let index = 0; index < favorites.length; index++) {
    if (serieName === favorites[index].name) {
      favorites.splice(index, 1);
    }
  }
  console.log(favorites);
};

const getFavoriteClass = function(index) {
  if (isInFavorites(index)) {
    return "favorite";
  } else {
    return "";
  }
};

const printFavorites = function() {
  const ulAside = document.querySelector(".js-ul-aside");
  ulAside.innerHTML = "";
  for (let favIndex = 0; favIndex < favorites.length; favIndex++) {
    let htmlcode = "";
    htmlcode += `<li class= "list-item favorite" data-index="${favIndex}">`;
    htmlcode += `<div class="img-container" data-index="${favIndex}">`;
    htmlcode += `<img class="img" src="${favorites[favIndex].img}" />`;
    htmlcode += "</div>";
    htmlcode += `<h2 class="title">${favorites[favIndex].name}</h2>`;
    htmlcode += "</li>";
    ulAside.innerHTML += htmlcode;
  }
};

//FASE 4

const setSeriesIntoLocalStorage = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const getSeriesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("favorites"));
};

const startApp = function() {
  const seriesFromLS = getSeriesFromLocalStorage();
  if (!!seriesFromLS === true) {
    printFavorites();
  }
};
//ejecutar funciones
btn.addEventListener("click", searchInServer);
startApp();
