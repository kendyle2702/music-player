import crawlTop100 from "../data/crawlTop100/crawlTop100.js";
import crawMyList from "../data/crawlMyList/crawMyList.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loading = $(".loading");
const playLists = $$(".playlist");
const playListMyList = $(".playlist-mylist");
const playListTop100 = $(".playlist-top100");
const cdThumb = $(".cd-thumb");
const nameTitle = $(".header-center .name");
const audio = $("#audio");
const togglePlay = $(".btn-toggle-play");
const iconPlay = $(".icon-play");
const iconPause = $(".icon-pause");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const tabsElement = $$(".tab-item");
const lineOfTabs = $(".line");
let songMyListElements, songTop100Elements;
const timePastElement = $(".time-past");
const timeRemainingElement = $(".time-remaining");
const timeSeekingElement = $(".time-seeking");

const cdWitdh = cdThumb.offsetWidth;
const cdHeight = cdThumb.offsetHeight;

const app = {
  currentIndex: 0,
  currentTabElement: playListMyList,
  currentSongs: [],
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isSeeking: false,
  myListSongs: [
    {
      name: "id 072019",
      singer: "W/n ft 267",
      path: "https://a128-zmp3.zmdcdn.me/90083d6a4f1c62d2b7b5f3e76fed2986?authen=exp=1694008835~acl=/90083d6a4f1c62d2b7b5f3e76fed2986/*~hmac=9f92ae790616537d04eb5e9840089385&fs=MTY5MzgzNjAzNTA2NHx3ZWJWNHwxMjUdUngMjM1LjIzNy4xODU",
      image: "./img/3107id072019.jpg",
    },
  ],
  top100Songs: [],
  getCurrentSong: function () {
    return this.currentSongs[this.currentIndex];
  },
  renderMyListTab: function () {
    const htmls = this.myListSongs.map((element, index) => {
      return `<div class="song-element song-${index}">
            <div class="song-img">
              <img src="${element.image}" alt="${element.name}"/>
            </div>
            <div class="song-content">
              <h3 class="song-name">${element.name}</h3>
              <p class="song-author">${element.singer}</p>
            </div>
            <div class="song-more">
              <i class="fa fa-ellipsis-h"></i>
            </div> 
        </div>`;
    });
    playListMyList.innerHTML = htmls.join("");
    // Get song elements after render in MyList tab
    songMyListElements = playListMyList.querySelectorAll(".song-element");
  },
  renderTop100Tab: function () {
    const htmls = this.top100Songs.map((element, index) => {
      return `<div class="song-element song-${index} song-top100">
            <div class="rank top-${++index}">${index}</div>
            <div class="song-img">
              <img src="${element.image}" alt="${element.name}"/>
            </div>
            <div class="song-content">
              <h3 class="song-name">${element.name}</h3>
              <p class="song-author">${element.singer}</p>
            </div>
            <div class="song-more">
              <i class="fa fa-ellipsis-h"></i>
            </div> 
        </div>`;
    });
    playListTop100.innerHTML = htmls.join("");
    // Get song elements after render in Top 100 tab
    songTop100Elements = playListTop100.querySelectorAll(".song-element");
  },
  handleCommonEvents: function () {
    const _this = this;
    // Excecute rotate cd
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        autoplay: false,
        duration: 60000, // 60s
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    // Check event scroll to hidden cd element
    document.addEventListener("scroll", () => {
      // Get value when scroll screen
      const currentScoll = window.scrollY || document.documentElement.scrollTop;
      // Calculate new height and width of cd element
      const newCdWidth = cdWitdh - currentScoll;
      const newCdHeight = cdHeight - currentScoll;

      // Set width and height when scroll screen
      cdThumb.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cdThumb.style.height = newCdHeight > 0 ? newCdWidth + "px" : 0;
      // Set opacity when hidden
      cdThumb.style.opacity = newCdHeight / cdHeight;
    });
    // Check event click to play button
    togglePlay.addEventListener("click", () => {
      if (_this.isPlaying === true) {
        audio.pause();
      } else {
        audio.play();
      }
    });
    // Check status play of audio
    audio.addEventListener("play", () => {
      _this.isPlaying = true;
      iconPlay.style.display = "none";
      iconPause.style.display = "block";
      cdThumbAnimate.play();
    });
    // Check event status pause of audio
    audio.addEventListener("pause", () => {
      _this.isPlaying = false;
      iconPlay.style.display = "block";
      iconPause.style.display = "none";
      cdThumbAnimate.pause();
    });
    // Check event time past of song
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        _this.runTimeOfSong();
        // Seeking not update progres color
        if (!_this.isSeeking) {
          progress.value = Math.floor(
            (audio.currentTime / audio.duration) * 10000
          );
          _this.updateProgressColor();
        }
      }
    });
    // Check event when audio ended
    audio.addEventListener("ended", () => {
      if (_this.isRepeat) {
        // If have enable repeat button
        // not doing and step to audio.play()
      } else if (_this.isRandom) {
        _this.clearActiveOtherTab();
        // If have enable random button
        // Update current index
        _this.randomIndex();
      } else {
        _this.clearActiveOtherTab();
        // not
        // Update current index
        _this.nextSong();
      }
      // Delay 500ms
      setTimeout(() => {
        _this.loadCurrentSong();
        audio.play();
      }, 500);
    });
    //Check event change progress bar
    progress.addEventListener("change", (e) => {
      audio.currentTime = (e.target.value * audio.duration) / 10000;
      _this.updateProgressColor();

      // Not seeking when change value progress
      _this.isSeeking = false;
    });
    // Check event when move the progress button
    progress.addEventListener("input", () => {
      // Update color of progress bar
      _this.updateProgressColor();

      // Seeking
      _this.isSeeking = true;
    });
    //Check event when click next button
    nextBtn.addEventListener("click", () => {
      // Clear active tag in other Tab or in currentTab
      _this.clearActiveOtherTab();

      // If have enable random button
      if (_this.isRandom) {
        // Update current index
        _this.randomIndex();
      } else {
        // Not
        // Update current index
        _this.nextSong();
      }
      // Change status of button
      nextBtn.classList.add("active");
      // Delay 500ms
      setTimeout(() => {
        _this.loadCurrentSong();
        audio.play();
        nextBtn.classList.remove("active");
      }, 500);
    });
    //Check event when click previous button
    prevBtn.addEventListener("click", () => {
      // Clear active tag in other Tab or in currentTab
      _this.clearActiveOtherTab();

      // If have enable random button
      if (_this.isRandom) {
        // Update current index
        _this.randomIndex();
      } else {
        // Update current index
        _this.prevSong();
      }
      // Change status of button
      prevBtn.classList.add("active");
      // Delay 500ms
      setTimeout(() => {
        _this.loadCurrentSong();
        audio.play();
        prevBtn.classList.remove("active");
      }, 500);
    });
    //Check event when click random button
    randomBtn.addEventListener("click", () => {
      if (!_this.isRandom) {
        _this.isRandom = true;
        randomBtn.classList.add("active");
      } else {
        _this.isRandom = false;
        randomBtn.classList.remove("active");
      }
    });
    //Check event when click repeat button
    repeatBtn.addEventListener("click", () => {
      if (!_this.isRepeat) {
        _this.isRepeat = true;
        repeatBtn.classList.add("active");
      } else {
        _this.isRepeat = false;
        repeatBtn.classList.remove("active");
      }
    });
    //Check event when click title tab to change tab
    tabsElement.forEach((element, index) => {
      element.addEventListener("click", () => {
        // Remove active color for old tab
        $(".tab-item.active").classList.remove("active");
        // Add active for new tab
        tabsElement[index].classList.add("active");
        // Update line under title tab
        lineOfTabs.style.width = element.offsetWidth + "px";
        lineOfTabs.style.left = element.offsetLeft + "px";

        // Change Tab
        if (index === 0) {
          playLists[0].style.display = "block";
          playLists[1].style.display = "none";
          // Update current
          _this.currentSongs = _this.myListSongs;
          _this.currentTabElement = playListMyList;
        } else if (index === 1) {
          playLists[1].style.display = "block";
          playLists[0].style.display = "none";
          // Update current
          _this.currentSongs = _this.top100Songs;
          _this.currentTabElement = playListTop100;
        }
      });
    });
  },
  handleMyListTabEvent() {
    let _this = this;
    // Check event when click song element of My List Tab
    songMyListElements.forEach((songElement) => {
      songElement.addEventListener("click", (e) => {
        // If click different more button
        if (!(e.target.classList[0] === "fa")) {
          // Clear active tag in other Tab or in currentTab
          _this.clearActiveOtherTab();

          // last class of song element
          const lastClass = songElement.classList[1];
          // Set currentIndex = id of song
          const regexCheckIndex = /[0-9]+/g;
          _this.currentIndex = Number(lastClass.match(regexCheckIndex));

          // Delay 200ms and loadCurrentsong, audio
          setTimeout(() => {
            _this.loadCurrentSong();
            audio.play();
          }, 200);
        }
      });
    });
  },
  handleTop100ListTabEvent() {
    let _this = this;
    // Check event when click song element of Top 100 Tab
    songTop100Elements.forEach((songElement) => {
      songElement.addEventListener("click", (e) => {
        // If click different more button
        if (!(e.target.classList[0] === "fa")) {
          // Clear active tag in other Tab or in currentTab
          _this.clearActiveOtherTab();

          // get last class of song element
          const lastClass = songElement.classList[1];
          // Set currentIndex = id of song
          const regexCheckIndex = /[0-9]+/g;
          _this.currentIndex = Number(lastClass.match(regexCheckIndex));

          // Delay 200ms and loadCurrentsong, audio
          setTimeout(() => {
            _this.loadCurrentSong();
            audio.play();
          }, 200);
        }
      });
    });
  },
  loadCurrentSong: function () {
    // Render dashboard content
    nameTitle.innerText = this.getCurrentSong().name;
    cdThumb.src = this.getCurrentSong().image;
    audio.src = this.getCurrentSong().path;

    // Active color current song elemnt
    let currentSongElement = this.currentTabElement.querySelector(
      `.song-${this.currentIndex}`
    );
    currentSongElement.classList.add("activeSong");

    // Scroll active song to middle screen
    this.scrollToActiveSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.currentSongs.length) {
      this.currentIndex = 0;
    }
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex >= this.currentSongs.length) {
      this.currentIndex = this.currentSongs.length - 1;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.currentSongs.length - 1;
    }
  },
  randomIndex: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.currentSongs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
  },
  clearPrevSongElement: function () {
    // Get current Song Element and remove activeSong class in current Tab
    let currentSongElement = this.currentTabElement.querySelector(
      `.song-${this.currentIndex}`
    );
    if (currentSongElement) {
      currentSongElement.classList.remove("activeSong");
    }
  },
  scrollToActiveSong: function () {
    // After 0.5s will croll tag active Song into middle screen
    setTimeout(() => {
      $(".activeSong").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 500);
  },
  runTimeOfSong: function () {
    // Calculate time-remaining
    let timeRemainingSeconds = Math.floor(audio.duration);
    let timeRemainingMinutes = Math.floor(timeRemainingSeconds / 60);
    let timeRemainingExtraSeconds = Math.floor(timeRemainingSeconds % 60);
    // Render time
    timeRemainingElement.innerText = `0${timeRemainingMinutes}:${
      timeRemainingExtraSeconds < 10
        ? "0" + timeRemainingExtraSeconds
        : timeRemainingExtraSeconds
    }`;

    // Calculatetime-past
    let timePastSeconds = Math.floor(audio.currentTime);
    let timePastMinutes = Math.floor(timePastSeconds / 60);
    let timePastExtraSeconds = Math.floor(timePastSeconds % 60);
    // Render time
    timePastElement.innerText = `0${timePastMinutes}:${
      timePastExtraSeconds < 10
        ? "0" + timePastExtraSeconds
        : timePastExtraSeconds
    }`;
  },
  updateProgressColor: function () {
    // Calculate progress past width
    let progressPastWidth = (progress.value / 10000) * progress.clientWidth;
    // console.log(progressPastWidth)
    // timeSeekingElement.style.left = progressPastWidth - timeSeekingElement.offsetWidth/2 + 'px'
    // Update color linear gradient
    progress.style.background = `linear-gradient(to right, #2a55e0 0%, #9c6ff0 ${Math.floor(
      progressPastWidth
    )}px, rgb(0, 0, 0,0.2) ${Math.floor(
      progressPastWidth
    )}px, rgba(0, 0, 0,0.2) 100%)`;
  },
  clearActiveOtherTab: function () {
    playLists.forEach((playList) => {
      if (playList !== this.currentTabElement) {
        // Remove active class when click song tag in other Tab
        if (playList.querySelector(".activeSong")) {
          playList.querySelector(".activeSong").classList.remove("activeSong");
          // Reset index song when click Button in other Tab to start index 0 other last index
          this.currentIndex = -1;
        } else {
          // Only clearPrevSong when click in same Tab
          this.clearPrevSongElement();
        }
      }
    });
  },
  start: function () {
    // Add common listener events (DOM event)
    this.handleCommonEvents();

    // Load My List Tab
    this.loadMyListTab();

    // Load Top 100 Tab
    this.loadTop100Tab();
  },
  loadMyListTab: function () {
    // Get myListSongs from module
    crawMyList()
      .then((list) => {
        this.myListSongs = list[0].map((e, i) => {
          return { ...e, ...list[1][i] };
        });

        this.myListSongs = this.myListSongs.filter(song => song.path !== "None");
        
        // Set current songs = My List Songs in My List Tab
        this.currentSongs = this.myListSongs;

        // Render songs in My List
        this.renderMyListTab();

        // Handle event in My List Tab
        this.handleMyListTabEvent();
        // Load current Song
        this.loadCurrentSong();
      })
      .then(() => {
        // Hiden loading
        loading.classList.add("hidden");
      });
  },
  loadTop100Tab: function () {
    // Get data from module
    crawlTop100()
      .then((top100Songs) => {
        // Get top 100 songs
        this.top100Songs = top100Songs;
      })
      .then(() => {
        // Render Top 100 List Song
        this.renderTop100Tab();

        // Handle event of My List tab
        this.handleTop100ListTabEvent();

        // Hidden Top 100 Tab when start
        playListTop100.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

app.start();
