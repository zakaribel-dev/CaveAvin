window.addEventListener('load', () => {
  const table = document.getElementById('table_id');
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById('msg');
  const limit = 15;

  function getCountries(urlApiCouleur) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiCouleur, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.COULEUR.records.forEach(function (record) {
          let tr = document.createElement("tr");

          let actionsTd = document.createElement("td");
          actionsTd.innerHTML = `
            <button class="modif btn btn-info btn-sm fas fa-pencil-alt fa-sm"></button>
            <button class="delete btn btn-danger btn-sm fas fa-trash-alt fa-sm"></button>
            <button class="view btn btn-success btn-sm fas fa-eye fa-sm"></button>
          `;

          record.forEach(function (value) {
            let td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
          });

          tr.appendChild(actionsTd);
          table.appendChild(tr);

          let count =  0;

          for (let i = 0; i < table.rows.length; i++) {  // je check le nombre de lignes générées en fonction de ce qu'il y a dans l'API
            if (table.rows[i].nodeName === "TR") {
              count++;
            }
          }

          if (count > limit) {  // si le nombre de tr dépasse la limite alors j'affiche le bouton qui me permet de scroll tout en bas
            scrollTopButton.style.visibility = "visible";
            scrollDownButton.style.visibility = "visible";
          } else {
            scrollTopButton.style.visibility = "hidden";
            scrollDownButton.style.visibility = "hidden";
          }
          
        });

                  /////////// ADD //////////////

        document.getElementById('new_color').addEventListener('click', () => {
          $('.modal-addColor').html("Ajouter une couleur");

          $('#addModal').modal('show');

          document.getElementById('saveChangesBtnAdd').addEventListener('click', () => {
            const AddColorInput = document.getElementById('addColor');
           

            if (AddColorInput.value.length === 0 ) {
              Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');
            } else {
              newDataToAdd = {
                NOMCOULEUR: AddColorInput.value ,
              };

              let requestOptionsAdd = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newDataToAdd)
              };

              fetch(urlApiCouleur, requestOptionsAdd)
                .then((response) => response.json())
                .then(function (data) {
                  $('#addModal').modal('hide');
                  displayMsg(false,false,true,data) 
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
            }
          });
        });
              /////////// DELETE //////////////

        let btnDelete = document.getElementsByClassName('delete');
        for (let i = 0; i < btnDelete.length; i++) {
          btnDelete[i].addEventListener('click', function () {
            let row = this.parentNode.parentNode;
            let codePays = row.childNodes[0].textContent;

            table.removeChild(row);

            let requestOptions = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              }
            };

            fetch(urlApiCouleur + "/" + codePays, requestOptions)
              .then((response) => response.json())
              .then(function () {
                displayMsg(true,false,false,codePays)
              })
              .catch(function (error) {
                alert("Ajax error: " + error);
              });
          });
        }
              /////////// MODIF //////////////

        let btnModif = document.getElementsByClassName('modif');
        for (let i = 0; i < btnModif.length; i++) {
          btnModif[i].addEventListener('click', function () {
            const row = this.parentNode.parentNode;

            $('.modal-CouleurEdit').html("Editer Couleur");

            $('#editModal').modal('show');

            const ColorInput = document.getElementById('editCouleur');
     
            ColorInput.value = row.cells[1].textContent;
          

            const code = row.cells[0].textContent;

            document.getElementById('saveChangesBtn').addEventListener('click', () => {

              const newData = {
                NOMCOULEUR: ColorInput.value,
              };

              let requestOptions = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
              };

              fetch(urlApiCouleur + "/" + code, requestOptions)
                .then((response) => response.json())
                .then(function () {
                 displayMsg(false,true,false,code)
                  row.cells[1].textContent =  ColorInput.value.toUpperCase();
                  $('#editModal').modal('hide');
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
            });
          });
        }

        let btnVue = document.getElementsByClassName('view');
        for (let i = 0; i < btnVue.length; i++) {
          btnVue[i].addEventListener('click', function () {
            let row = this.parentNode.parentNode;
            $('#viewModal').modal('show');
            $('.modal-title').html("Code couleur : " + row.cells[0].textContent +
              "<br>Couleur : " + row.cells[1].textContent);
          });
        }
      })
      .catch(function (error) {
        alert('Ajax error: ' + error);
      });
  }


  function displayMsg(deleteRow, editRow,addedRow, row) {
    msg.style.visibility = "visible";
  
    if (deleteRow) {
      msg.style = "font-size:40px"
      msg.innerHTML =
        "<div class='alert alert-danger' role='alert' style=font-weight:bolder;>Appellation numéro "+row+" supprimée &#128532;</div>";
    } else if (editRow) {
      msg.style = "font-size:40px"
      msg.innerHTML =
        "<div class='alert alert-primary' role='alert'style=font-weight:bolder;>Appellation numéro "+row+" modifiée &#129488;</div>";
    }else if(addedRow){
      msg.style = "font-size:40px"
      msg.innerHTML =
        "<div class='alert alert-primary' role='alert'style=font-weight:bolder;>Appellation numéro "+row+" ajoutée &#128077;</div>";
    }


    setTimeout(function () {
      msg.classList.add("fade-out");
    }, 1000);
  
    setTimeout(function () {
      msg.style.visibility = "hidden";
      msg.classList.remove("fade-out");
      location.reload();
    }, 2400);
  }




          /////////// SEARCH //////////////

          function searchColors(code) {
            if (code) {
              btnReload.style.visibility = "visible";
              btnReload.addEventListener("click", () => {
                location.reload();
              });
          
              const rows = table.getElementsByTagName("tr");
              for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rowCode = row.cells[0].textContent;
          
                if (rowCode !== code) {
                  row.style.display = "none";
                } else {
                  row.style.display = "";
                }
              }
            } else {
              Swal.fire('Hey &#128545; !', "<b>Merci d'entrer un code...</b>", 'error');
            }
          }

  const form = document.getElementById('form_id');
  const codeInput = document.getElementById('code');
  const btnReload = document.getElementById('reload');
  const scrollDownButton = document.getElementById('scrollButton');
  const scrollTopButton = document.getElementById('scrollTopButton');
  btnReload.style.visibility = "hidden";

 

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const code = codeInput.value;
    searchColors(code);
  });

  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }); 

  getCountries(urlApiCouleur);
});