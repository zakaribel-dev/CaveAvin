window.addEventListener('load', () => {
  const table = document.getElementById('table_id');
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById('msg');
  const limit = 10;

  function getCountries(urlApiPays) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiPays, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.PAYS.records.forEach(function (record) {
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

        document.getElementById('new_country').addEventListener('click', () => {
          $('.modal-addNomPays').html("Ajouter un pays");

          $('#addModal').modal('show');

          document.getElementById('saveChangesBtnAdd').addEventListener('click', () => {
            const AddNomPaysInput = document.getElementById('addNomPays');
           

            if (AddNomPaysInput.value.length === 0 ) {

              Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');

            } else {
              newDataToAdd = {
                NOMPAYS: AddNomPaysInput.value.toUpperCase() ,
              };

              let requestOptionsAdd = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newDataToAdd)
              };

              fetch(urlApiPays, requestOptionsAdd)
                .then((response) => response.json())
                .then(function (data) {

                  
                  $('#addModal').modal('hide');
                 displayMsg(false,false,true,data);
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

            fetch(urlApiPays + "/" + codePays, requestOptions)
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

            $('.modal-NomPays').html("Editer Nom du pays");

            $('#editModal').modal('show');

            const NomPaysInput = document.getElementById('editNomPays');
     
            NomPaysInput.value = row.cells[1].textContent;
          

            const code = row.cells[0].textContent;

            document.getElementById('saveChangesBtn').addEventListener('click', () => {

              const newData = {
                NOMPAYS: NomPaysInput.value.toUpperCase(),
              };

              let requestOptions = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
              };

              fetch(urlApiPays + "/" + code, requestOptions)
                .then((response) => response.json())
                .then(function () {
                 displayMsg(false,true,false,code)
                  row.cells[1].textContent = NomPaysInput.value.toUpperCase();
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
            $('.modal-title').html("Code du pays : " + row.cells[0].textContent +
              "<br>Nom du pays : " + row.cells[1].textContent);
          });
        }
      })
      .catch(function (error) {
        alert('Ajax error: ' + error);
      });
  }


  function displayMsg(deleteRow, editRow,addedRow, row) {  
    if (deleteRow) {

      Swal.fire('Hey &#128532; !', "<b>Pays numéro " +row+ " supprimé</b>", 'warning').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });

    } else if (editRow) {

      Swal.fire('Hey &#129488; !', "<b>Pays numéro " +row+ " modifié</b>", 'info').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }else if(addedRow){
      Swal.fire('Hey &#128077; !', "<b>Pays numéro " +row+ " ajouté</b>", 'success').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  }



          /////////// SEARCH //////////////

  function searchCountries(code) {
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
  
    scrollDownButton.style.visibility = "hidden";
    scrollTopButton.style.visibility = "hidden";
    const code = codeInput.value;
    searchCountries(code);
  });

  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  getCountries(urlApiPays);
});