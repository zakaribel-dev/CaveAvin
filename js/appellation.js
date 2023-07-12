window.addEventListener('load', () => {
  const table = document.getElementById('table_id');
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById('msg');

  function getCountries(urlApiAppellation) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiAppellation, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.APPELLATION.records.forEach(function (record) {
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
        });

                  /////////// ADD //////////////

        document.getElementById('new_appellation').addEventListener('click', () => {
          $('.modal-addAppellation').html("Ajouter une appellation");

          $('#addModal').modal('show');

          document.getElementById('saveChangesBtnAdd').addEventListener('click', () => {
            const AddAppellationInput = document.getElementById('addAppellation');
           

            if (AddAppellationInput.value.length === 0 ) {
              Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');

            } else {
              newDataToAdd = {
                NOMAPPELLATION: AddAppellationInput.value
              };

              let requestOptionsAdd = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newDataToAdd)
              };

              fetch(urlApiAppellation, requestOptionsAdd)
                .then((response) => response.json())
                .then(function (data) {
                  $('#addModal').modal('hide');
                  msg.style = "font-size:25px"
                  msg.innerHTML =
                  "<div class='alert alert-success' role='alert' style=font-weight:bolder;>Nouvelle appellation ajoutée, elle aura le code : " +
                  data +
                  "&#128079; <br> <button id='reloadAppellation' class='btn-primary'>Rechargez la liste des appellations en cliquant ici !</button></div>";  
        
                  const btnReloadWines = document.getElementById('reloadAppellation');
        
                  btnReloadWines.addEventListener('click',()=>{
                    location.reload();
                  });                                    
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
            let codeAppellation = row.childNodes[0].textContent;

            table.removeChild(row);

            let requestOptions = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              }
            };

            fetch(urlApiAppellation + "/" + codeAppellation, requestOptions)
              .then((response) => response.json())
              .then(function () {
                displayMsg(true,false,codeAppellation)
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

            $('.modal-AppellationModif').html("Editer Appellation");

            $('#editModal').modal('show');

            const NomAppellationInput = document.getElementById('editAppellation');
     
            NomAppellationInput.value = row.cells[1].textContent;
          

            const code = row.cells[0].textContent;

            document.getElementById('saveChangesBtnModifAppellation').addEventListener('click', () => {

              const newData = {
                NOMAPPELLATION: NomAppellationInput.value
              };

              let requestOptions = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
              };

              fetch(urlApiAppellation + "/" + code, requestOptions)
                .then((response) => response.json())
                .then(function () {
                 displayMsg(false,true,code)
                  row.cells[1].textContent =NomAppellationInput.value;
                    $('#editModal').modal('hide');
                    displayMsg(false,true,code)
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
            $('.modal-title').html("Code de l'appellation : " + row.cells[0].textContent +
              "<br>Appellation : " + row.cells[1].textContent);
          });
        }
      })
      .catch(function (error) {
        alert('Ajax error: ' + error);
      });
  }


  function displayMsg(deleteRow, editRow, row) {
    msg.style.visibility = "visible";
  
    if (deleteRow) {
      msg.style = "font-size:40px"
      msg.innerHTML =
        "<div class='alert alert-danger' role='alert' style=font-weight:bolder;>Appellation numéro "+row+" supprimée &#128532;</div>";
    } else if (editRow) {
      msg.style = "font-size:40px"
      msg.innerHTML =
        "<div class='alert alert-primary' role='alert'style=font-weight:bolder;>Appellation numéro "+row+" modifiée &#129488;</div>";
    }


    setTimeout(function () {
      msg.classList.add("fade-out");
    }, 1000);
  
    setTimeout(function () {
      msg.style.visibility = "hidden";
      msg.classList.remove("fade-out");
    }, 2400);
  }





          /////////// SEARCH //////////////

          function searchAppellations(code) {
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
    searchAppellations(code);
  });


  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  getCountries(urlApiAppellation);
});