// Crawl top 100 songs from api zingmp3
const crawlTop100 = () => {
  // Api
  const top100Zingmp3API =
    "https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1";
  // Get id of 100 songs from api
  const getIdList = (contentApi) => {
    const idList = contentApi.data.song.map((element) => {
      return element.code;
    });
    return idList;
  };
  // Get 100 songs contain format object 
  const getSongs = (idList)=> {
    // Using promise.all() to convert list promise to values list 
    return Promise.all(
      idList.map((element) => {
        let songUrl = `https://mp3.zing.vn/xhr/media/get-source?type=audio&key=${element}`;
        return fetch(songUrl)
          .then((response) => {
            return response.json();
          })
          .then((songObj) => {
            let songE = {
              name: songObj.data.name,
              singer: songObj.data.performer,
              path: songObj.data.source["128"],
              image: songObj.data.album.thumbnail,
            };
            return songE;
          })
          .catch((err)=>{
            console.log(err)
          })
      })
    );
  }
  // Use fetch to call api
  return fetch(top100Zingmp3API)
    .then((response) => {
      return response.json();
    })
    // return id of 100 songs
    .then((contentApi) => {
      return getIdList(contentApi);
    })
    // return songs of list
    .then((idList) => {
      return getSongs(idList);
    })
    .catch((err) => {
      console.log(err);
    })
};
export default crawlTop100;
