window.addEventListener("load", () => {
  const table = document.getElementById("table_id");
  table.className = "table table-danger table-hover container mt-5 text-center";
  let loading = document.getElementById('loading-bar-spinner');
  loading.style.visibility = "visible";
  const msg = document.getElementById("msg");
  const limit = 10;
  let countries = [];




  function manageCountries(urlApiPays) {

    let requestOptionsGet = {
      method: "GET",
      redirect: "follow",
    };
    
    fetch(urlApiPays, requestOptionsGet)
      .then((response) => response.json())
      .then(function (data) {
        countries = data;
        loading.style.visibility = "hidden";

        display();
        addCountries();
        editCountries();
        deleteCountries();
        viewCountries();
        searchCountries();
      })
      .catch(function (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération des données :",
          error
        );
      });

    }
    /////////// ADD //////////////
    function addCountries() {
      document.getElementById("new_country").addEventListener("click", () => {
        $(".modal-addNomPays").html("Ajouter un pays");

        $("#addModal").modal("show");

        document
          .getElementById("saveChangesBtnAdd")
          .addEventListener("click", () => {
            const AddNomPaysInput = document.getElementById("addNomPays");

            if (AddNomPaysInput.value.length === 0) {
              Swal.fire(
                "Hey &#128545; !",
                "<b>Merci de remplir tous les champs demandés...</b>",
                "error"
              );
            } else {
              newDataToAdd = {
                NOMPAYS: AddNomPaysInput.value.toUpperCase(),
              };

              let requestOptionsPost = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newDataToAdd),
              };

              fetch(urlApiPays, requestOptionsPost)
                .then((response) => response.json())
                .then(function (data) {
                  $("#addModal").modal("hide");
                  displayMsg(false, false, true, data);
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
            }
          });
      });
    }

    function display() {
      countries.PAYS.records.forEach(function (record) {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "data");
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

        let count = 0;

        for (let i = 0; i < table.rows.length; i++) {
          // je check le nombre de lignes générées en fonction de ce qu'il y a dans l'API
          if (table.rows[i].nodeName === "TR") {
            count++;
          }
        }

        if (count > limit) {
          // si le nombre de tr dépasse la limite alors j'affiche le bouton qui me permet de scroll tout en bas
          scrollTopButton.style.visibility = "visible";
          scrollDownButton.style.visibility = "visible";
        } else {
          scrollTopButton.style.visibility = "hidden";
          scrollDownButton.style.visibility = "hidden";
        }
      });
    }

    /////////// DELETE //////////////
    function deleteCountries() {
      let btnDelete = document.getElementsByClassName("delete");
      for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
          let row = this.parentNode.parentNode;
          let codePays = row.childNodes[0].textContent;

          Swal.fire({
            title: "&#128552;",
            html:
              "<b>Vous êtes sûr de vouloir supprimer le pays numéro " +
              codePays +
              " ?</b>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
          }).then((result) => {
            if (result.isConfirmed) {
              table.removeChild(row);

              let requestOptionsDelete = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              };

              fetch(urlApiPays + "/" + codePays, requestOptionsDelete)
                .then((response) => response.json())
                .then(function () {
                  displayMsg(true, false, false, codePays);
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
            }
          });
        });
      }
    }

    /////////// MODIF //////////////
    function editCountries() {
      let btnModif = document.getElementsByClassName("modif");
      for (let i = 0; i < btnModif.length; i++) {
        btnModif[i].addEventListener("click", function () {
          const row = this.parentNode.parentNode;
          const code = row.cells[0].textContent;

          $(".modal-NomPays").html("Editer Nom du pays");

          $("#editModal").modal("show");

          const NomPaysInput = document.getElementById("editNomPays");

          NomPaysInput.value = row.cells[1].textContent;

          document.getElementById("saveChangesBtn").addEventListener("click", () => {
              Swal.fire({
                html:"<b>Vous êtes sûr de vouloir modifier le pays " + code +" ?</b>",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Non",
              }).then((result) => {
                if (result.isConfirmed) {
                  const newData = {
                    NOMPAYS: NomPaysInput.value.toUpperCase(),
                  };

                  let requestOptionsPut = {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                  };

                  fetch(urlApiPays + "/" + code, requestOptionsPut)
                    .then((response) => response.json())
                    .then(function () {
                      row.cells[1].textContent =
                        NomPaysInput.value.toUpperCase();
                      displayMsg(false, true, false, code, row);
                      $("#editModal").modal("hide");
                    })
                    .catch(function (error) {
                      alert("Ajax error: " + error);
                    });
                }
              });
            });
        });
      }
    }

    function viewCountries() {
      let btnVue = document.getElementsByClassName('view');
      for (let i = 0; i < btnVue.length; i++) {
        btnVue[i].addEventListener('click', function () {
          let row = this.parentNode.parentNode;
          $('#viewModal').modal('show');
          $('.modal-title').html("Code du pays : " + row.cells[0].textContent +
            "<br>Nom du pays : " + row.cells[1].textContent);
        });
      }
  }
 


    function displayMsg(deleteRow, editRow,addedRow, row, rowObj = null) {

          if (deleteRow) {
      
            Swal.fire('&#128532;', "<b>Région numéro " +row+ " supprimée</b>", 'success');
      
          } else if (editRow) {
            Swal.fire('Hey &#129488; !', "<b>Région numéro " + row + " modifiée</b>", 'info').then((result) => {
              if (result.isConfirmed && rowObj) {
                const rowElement = rowObj.closest('tr');
                rowElement.classList.add('flash-animation');
                setTimeout(() => {
                  rowElement.classList.remove('flash-animation');
                }, 2000);
              }
            });
          }else if(addedRow){
            Swal.fire('&#128077;', "<b>Région numéro " +row+ " ajoutée. Cliquez sur la flèche pour aller en bas.</b>", 'success').then((result) =>{
              if(result.isConfirmed){
                location.reload();
              }
            });
          }
        }


  /////////// SEARCH //////////////
  function searchCountries() {
    const searchBarValue = document.getElementById('search').value;
    const rows = table.getElementsByClassName("data");
    let matchesFound = false; // flag
    msg.innerHTML = "";
    table.style.visibility = "visible";
    scrollDownButton.style.visibility = "visible";
    scrollTopButton.style.visibility = "visible";

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let rowMatches = false; // flag

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        const cellValue = cell.textContent.toLowerCase(); // je met toLowerCase pour faire en sorte que ce soit pas sensible à la casse

        if (cellValue.includes(searchBarValue.toLowerCase())) {
          // ici, si un l'input match avec les l'une des cellules de toute les row
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
      table.style.visibility = "hidden";
      scrollDownButton.style.visibility = "hidden";
      scrollTopButton.style.visibility = "hidden";
      msg.innerHTML =
        "<b>Aucune correspondance pour : " + searchBarValue + " &#128532</b>";
    }
  }


  const Input = document.getElementById("search");
  const scrollDownButton = document.getElementById("scrollButton");
  const scrollTopButton = document.getElementById("scrollTopButton");

  Input.addEventListener("input", (event) => {
    event.preventDefault();
    const input = Input.value;
    searchCountries(input);
  });

  scrollDownButton.addEventListener("click", function () {
    const full_page = document.documentElement;
    full_page.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  scrollTopButton.addEventListener("click", function () {
    const topElement = document.body;
    topElement.scrollIntoView({ behavior: "smooth" });
  });

  manageCountries(urlApiPays);
});
