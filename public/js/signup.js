function myfun() {
  if (document.getElementById("checkme").checked == true) {
    document.getElementById("buttonme").disabled = false;
  } else {
    document.getElementById("buttonme").disabled = true;
  }
}
