const URL = "https://api.soundcloud.com/tracks/";
const QUERY = "?q=";
const APIKEY = "client_id=8538a1744a7fdaa59981232897501e04";
var button = document.querySelector(".searchBtn");
var searchInput = document.querySelector(".searchBar");
var submitBtn = document.querySelector(".searchBtn");
var searchResultsContainer = document.querySelector(".searchResults");
var currentUserImg;
var currentArtist;
var currentSong;
var finalResults = [];
var trackContainers = [];

submitBtn.addEventListener("click", function() {
  clearResults();
  moveTitleUp();
  var userInput = searchInput.value.replace(/\s+/g, "-").toLowerCase();
  axios
    .get(URL + QUERY + userInput + "&" + APIKEY)
    .then(function(response) {
      finalResults = response.data;
      console.log(finalResults);
      for (let i = 0; i < finalResults.length; i++) {
        createTracks(finalResults[i]);
        for (let j = i; j < trackContainers.length; j++) {
          trackContainers[j].addEventListener("click", function() {
            var pickedSong = finalResults[i].stream_url + "?" + APIKEY;
            currentUserImg = finalResults[i].artwork_url;
            showElement("#audioController");
            playClickedSong(pickedSong);
            updateNowPlaying(
              (currentArtist = finalResults[i].user.username),
              (currentSong = finalResults[i].title)
            );
          });
        }
      }
    })
    .catch(function() {
      console.log("Nothing Here");
    });
  saveFavorite();
});

function createTracks(data) {
  function makeTrackWrapper() {
    var createTrackWrapper = document.createElement("div");
    createTrackWrapper.classList.add("trackWrapper");
    searchResultsContainer.appendChild(createTrackWrapper);
    trackContainers.push(createTrackWrapper);

    var createFavoriteDiv = document.createElement("div");
    createFavoriteDiv.classList.add("favoriteDiv");
    searchResultsContainer.appendChild(createFavoriteDiv);

    var createArtistImage = document.createElement("img");
    createArtistImage.classList.add("userImg");
    createTrackWrapper.appendChild(createArtistImage);
    if (!data.artwork_url) {
      createArtistImage.src =
        "http://waterfrontpropertiesofmaine.com/wp-content/themes/wfpm/images/user-icon.png";
    } else {
      createArtistImage.src = data.artwork_url;
    }

    var createSongTitle = document.createElement("p");
    createSongTitle.classList.add("songTitle");
    createTrackWrapper.appendChild(createSongTitle);
    createSongTitle.innerHTML = data.title;

    var createUserName = document.createElement("p");
    createUserName.classList.add("userName");
    createTrackWrapper.appendChild(createUserName);
    createUserName.innerHTML = data.user.username;
  }
  makeTrackWrapper();
  showElement(".resultsTitle");
}

function playClickedSong(song) {
  var audioSource = document.querySelector("#audioSource");
  audioSource.src = song;
  var audioController = document.querySelector("#audioController");
  audioController.load();
  showElement("#favorite");
  showElement(".favTitle");
}

function updateNowPlaying(currentArtist, currentSong) {
  document.querySelector("#artistPlaying").innerHTML =
    "Now Playing: " + currentArtist + " ";
  document.querySelector("#songPlayingNow").innerHTML = currentSong;
}

function clearResults() {
  searchResultsContainer.innerHTML = "";
}

function showElement(el) {
  var element = document.querySelector(el);
  element.classList.remove("hidden");
}

function moveTitleUp() {
  var title = document.querySelector(".title");
}

function showPlayButton() {
  var playBtn = document.querySelectorAll(".playButton");
  var titleImg = document.querySelectorAll(".userImg");
  console.log("Processing...");
  for (let i = 0; i < titleImg.length; i++) {
    titleImg[i].addEventListener("mouseenter", function() {
      alert("You entered a track");
    });
  }
}

function saveFavorite() {
  var favoriteButton = document.querySelector("#favorite");
  favoriteButton.addEventListener("click", function() {
    console.log("Source:", audioSource);
    console.log("Artist:", currentArtist);
    console.log("Song:", currentSong);
    console.log("Photo:", currentUserImg);
    axios
      .post("/favorites", {
        audioFile: audioSource.src,
        artist: currentArtist,
        song: currentSong,
        image: currentUserImg
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}
(function rotateFavorite() {
  var favLink = document.querySelector("#favorite");
  favLink.addEventListener("click", function() {
    console.log("you clicked the star");
    favLink.classList.add("rotate");
    setTimeout(function() {
      favLink.classList.remove("rotate");
      confirm("Added " + currentSong + " to your Jams");
    }, 1000);
  });
})();

(function playFavoriteSong() {
  var favorites = document.querySelectorAll(".trackWrapperFav");
  for (let i = 0; i < favorites.length; i++) {
    favorites[i].addEventListener("click", function() {
      var clickedSong = favorites[i].querySelector("#audioSourceFile")
        .innerHTML;
      var audioSource = document.querySelector("#audioSourceFav");
      audioSource.src = clickedSong;
      var nowPlaying = document.querySelector("");
      var audioController = document.querySelector("#audioControllerFav");
      audioController.load();
    });
  }
})();
