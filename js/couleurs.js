window.addEventListener('load', () => {
  const table = document.getElementById('table_id');
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById('msg');
  const limit = 10;

  function getColors(urlApiCouleur) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiCouleur, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.COULEUR.records.forEach(function (record) {
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
            let codeCouleur = row.childNodes[0].textContent;

            Swal.fire({
              title :"&#128552;",
              html: "<b>Vous êtes sûr de vouloir modifier la couleur numéro " + codeCouleur + " ?</b>",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Oui',
              cancelButtonText: 'Non'
            }).then((result) => {
              if (result.isConfirmed) { 
                table.removeChild(row);

                let requestOptions = {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json"
                  }
                };
    
                fetch(urlApiCouleur + "/" + codeCouleur, requestOptions)
                  .then((response) => response.json())
                  .then(function () {
                    displayMsg(true,false,false,codeCouleur)
                  })
                  .catch(function (error) {
                    alert("Ajax error: " + error);
                  });
               } })
          });
        }
              /////////// MODIF //////////////

        let btnModif = document.getElementsByClassName('modif');
        for (let i = 0; i < btnModif.length; i++) {
          btnModif[i].addEventListener('click', function () {
            const row = this.parentNode.parentNode;
            const code = row.cells[0].textContent;

            $('.modal-CouleurEdit').html("Editer Couleur");

            $('#editModal').modal('show');

            const ColorInput = document.getElementById('editCouleur');
            ColorInput.value = row.cells[1].textContent;
        
            document.getElementById('saveChangesBtn').addEventListener('click', () => {

              Swal.fire({
                title :"&#128552;",
                html: "<b>Vous êtes sûr de vouloir modifier l'appellation numéro " + code + " ?</b>",
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
              }).then((result) => {
                if (result.isConfirmed) { 

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
                     row.cells[1].textContent =  ColorInput.value.toUpperCase();
                     displayMsg(false,true,false,code,row)
                      $('#editModal').modal('hide');
                    })
                    .catch(function (error) {
                      alert("Ajax error: " + error);
                    });
                 } });          
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

  function displayMsg(deleteRow, editRow,addedRow, row, rowObj = null) {
      
    if (deleteRow) {
  
      Swal.fire('&#128532;', "<b>Appellation numéro " +row+ " supprimée</b>", 'success');
  
    } else if (editRow) {
      Swal.fire('Hey &#129488; !', "<b>Appellation numéro " + row + " modifiée</b>", 'info').then((result) => {
        if (result.isConfirmed && rowObj) {
          const rowElement = rowObj.closest('tr');
          rowElement.classList.add('flash-animation');
          setTimeout(() => {
            rowElement.classList.remove('flash-animation');
            location.reload()
          }, 2000);
        }
      });
    }else if(addedRow){
      Swal.fire('&#128077;', "<b>Appellation numéro " +row+ " ajoutée. Cliquez sur la flèche bleue pour aller en bas.</b>", 'success').then((result) =>{
        if(result.isConfirmed){
          location.reload();
        }
      });
    }
  }

          /////////// SEARCH //////////////

          function searchColors() {
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
            searchColors(input);
          });

  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }); 

  getColors(urlApiCouleur);
});