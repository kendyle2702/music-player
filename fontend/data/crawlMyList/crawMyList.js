const myApi = "https://music-player-server-lime.vercel.app";

const idMusics = [
  {
    id: "ZWBIEWBI",
    name: "Đường Tôi Chở Em Về",
  },
  {
    id: "ZW67FWWF",
    name: "Bức Tranh Từ Màu Nước Mắt",
  },
  {
    id: "ZZAIAIAZ",
    name: "SAIGON SIMPLE LOVE",
  },
  {
    id: "ZW6DF66B",
    name: "Day Dứt Nỗi Đau",
  },
  {
    id: "ZW7WDBZA",
    name: "Dưới Những Cơn Mưa",
  },
  {
    id: "ZOZA0U99",
    name: "Không Muốn Yêu Lại Càng Say Đắm",
  },
  {
    id: "ZZAAZBZE",
    name: "Có Em",
  },
  {
    id: "Z67CZDWA",
    name: "Không Yêu Xin Đừng Nói",
  },
  
  {
    id: "Z6UBADAF",
    name: "Yêu Người Có Ước Mơ",
  },
  {
    id: "ZOU7OB7I",
    name: "Bao Tiền Một Mớ Bình Yên?",
  },
  {
    id: "ZW9CFDU9",
    name: "Suýt Nữa Thì (Chuyến Đi Của Thanh Xuân OST)",
  },
  {
    id: "ZW8I76Z8",
    name: "1 Phút",
  },
  {
    id: "ZZB8UW0E",
    name: "Như Anh Đã Thấy Em",
  },
  {
    id: "ZWAIDIEC",
    name: "Mình Dành Cho Nhau Nỗi Buồn",
  },
  {
    id: "ZWDZCE80",
    name: "Bông Hoa Đẹp Nhất",
  },

  {
    id: "ZZEF769O",
    name: "Ngày Mai Em Đi Mất",
  },
  {
    id: "ZZDB9868",
    name: "Chạy Khỏi Thế Giới Này",
  },
  {
    id: "ZW8WOA0A",
    name: "Về Phía Mưa",
  },
  {
    id: "ZW7F90DU",
    name: "Cafe, Thuốc Lá & Những Ngày Vui",
  },
  {
    id: "Z6DIE700",
    name: "Tệ Thật, Anh Nhớ Em",
  },
 {
    id: "ZZADU0BU",
    name: "ÁNH CHIỀU TÀN",
  },
        {
    id: "ZZDUOIA6",
    name: "vaicaunoicokhiennguoithaydoi",
  },
        {
    id: "ZZ9I7EZ7",
    name: "Chuyện Đôi Ta",
  },
       {
    id: "Z6UFF9Z6",
    name: "để tôi ôm em bằng giai điệu này",
  },
  {
    id: "ZW8IC98I",
    name: "Ta Còn Yêu Nhau",
  },
];

const crawMyList = () => {
  const getSourceSong = () => {
    return Promise.all(
      idMusics.map((e) => {
        let sourceSongApi = `${myApi}/api/v1/song?id=${e.id}`;
        return fetch(sourceSongApi)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return {
              path: data.data && data.data["128"]?data.data["128"] : "None",
            };
          })
          .catch(() => ({ path: "None" })); 
      })
    );
  };

  const getInfoSong = () => {
    return Promise.all(
      idMusics.map((e) => {
        let detailSongApi = `${myApi}/api/v1/infosong?id=${e.id}`;
        return fetch(detailSongApi)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return {
              name: data.data.title,
              singer: data.data.artistsNames,
              image: data.data.thumbnailM,
            };
          });
      })
    );
  };

  return Promise.all([getInfoSong(), getSourceSong()]);
};

export default crawMyList;
