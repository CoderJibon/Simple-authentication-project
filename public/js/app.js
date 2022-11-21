if (document.querySelector("#profilePic")) {
  document.querySelector("#profilePic").onchange = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    document.querySelector("#profilePicDisplay").setAttribute("src", url);
  };
}

if (document.querySelector("#galleryPic")) {
  document.querySelector("#galleryPic").onchange = (e) => {
    let image = "";
    for (let i = 0; i < e.target.files.length; i++) {
      const galleyBox = URL.createObjectURL(e.target.files[i]);
      image += `<img src="${galleyBox}" alt="" />`;
    }
    document.querySelector("#gallBox").innerHTML = image;
  };
}
