window.addEventListener('load', () => {
  const table = document.getElementById('table_id');
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById('msg');
  const limit = 10;

  function getAppellations(urlApiAppellation) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiAppellation, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.APPELLATION.records.forEach(function (record) {
          let tr = document.createElement("tr");
          tr.setAttribute('class','data');

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
                displayMsg(true,false,false,codeAppellation)
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
                    displayMsg(false,true,false,code)
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


  function displayMsg(deleteRow, editRow,addedRow, row) {
    msg.style.visibility = "visible";
  
    if (deleteRow) {

      Swal.fire('Hey &#128532; !', "<b>Couleur numéro " +row+ " supprimée</b>", 'warning').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });

    } else if (editRow) {

      Swal.fire('Hey &#129488; !', "<b>Couleur numéro " +row+ " modifiée</b>", 'info').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }else if(addedRow){
      Swal.fire('Hey &#128077; !', "<b>Couleur numéro " +row+ " ajoutée</b>", 'success').then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    }
  }



          /////////// SEARCH //////////////

          function searchAppellations() {
            const searchBarValue = $("#search").val();
            const rows = table.getElementsByClassName("data");
            let matchesFound = false; // flag
          
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              let rowMatches = false; // flag
          
              for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                const cellValue = cell.textContent.toLowerCase(); // je met toLowerCase pour faire en sorte que ce soit pas sensible à la casse
          
                if (cellValue.includes(searchBarValue.toLowerCase())) { // ici, si un l'input match avec les l'une des cellules de toute les row 
                  //alors j'active le flag pour dire qu'il ya un match
                  rowMatches = true;
                  break;
                }
              }
          
              if (rowMatches) {
                row.style.display = "";
                matchesFound = true;
              } else {
                row.style.display = "none";
              }
            }
          
            if (!matchesFound) {
              Swal.fire('Désolé &#128532;', '<b>Aucune correspondance pour la vin numéro ' + searchBarValue + ' ...</b>', 'error');
            }
          }

          const Input = document.getElementById("search");
          const scrollDownButton = document.getElementById('scrollButton');
          const scrollTopButton = document.getElementById('scrollTopButton');
        
          Input.addEventListener("input", (event) => {
            event.preventDefault();
  
            const input = Input.value;
            searchAppellations(input);
          });

  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  getAppellations(urlApiAppellation);
});