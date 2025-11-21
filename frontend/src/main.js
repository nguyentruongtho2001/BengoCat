const catImage = document.getElementById("cat-image");
let lastPose = "right"; // bắt đầu từ right để lần đầu chuyển sang left

document.addEventListener("keydown", () => {
  // ✅ Xen kẽ giữa left và right
  if (lastPose === "right") {
    catImage.src = "/assets/left.png";
    lastPose = "left";
  } else {
    catImage.src = "/assets/right.png";
    lastPose = "right";
  }

  // ✅ Trở về none sau 1 giây
  setTimeout(() => {
    catImage.src = "/assets/none.png";
  }, 1000);
});