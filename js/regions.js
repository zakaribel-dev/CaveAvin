window.addEventListener("load", () => {
  const table = document.getElementById("table_id");
  table.className = "table table-danger table-hover container mt-5 text-center";
  const msg = document.getElementById("msg");
  const limit = 10;

  function manageRegions(urlApiRegion) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiRegion + "?include=PAYS&transform=1", requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.REGION.map(function (regionElement) {
          let tr = document.createElement("tr");
          tr.setAttribute('class','data'); // je met une classe data à toute mes lignes dans le but de pouvoir en afficher certaines et d'en cachet d'autres tout en évitant de filtrer la tr contenant mes th
          let codeRegionTd = document.createElement("td");
          codeRegionTd.textContent = regionElement.CODEREGION;

          let paysTd = document.createElement("td");
          if (regionElement.PAYS.length <= 0) {
            paysTd.textContent = "aucun pays trouvé......"; 
          } else {
            paysTd.textContent = regionElement.PAYS[0].NOMPAYS;
          }
          // je fais PAYS[0] parce que chaque élément de région contient un "PAYS" qui lui meme contient
          // un seul tableau donc je vise ce seul et unique tableau à l'index donc 0 pour ensuite recuperer la value de NOMPAYS

          let regionTd = document.createElement("td");
          regionTd.textContent = regionElement.NOMREGION;
          let actionsTd = document.createElement("td");
          actionsTd.innerHTML = `
            <button class="modif btn btn-info btn-sm fas fa-pencil-alt fa-sm"></button>
            <button class="delete btn btn-danger btn-sm fas fa-trash-alt fa-sm"></button>
            <button class="view btn btn-success btn-sm fas fa-eye fa-sm" ></button>

          `;

          tr.appendChild(codeRegionTd);
          tr.appendChild(paysTd);
          tr.appendChild(regionTd);
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

        deleteRegion();
        editRegion();
        viewRegion();
      })
      .catch(function (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération des données :",
          error
        );
      });

    /////////// ADD ///////////

    fetch(urlApiPays, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        const code_select_generated = document.createElement("select");
        code_select_generated.setAttribute("id", "id_select");
        const combo = document.getElementById("comboRegion");

        for (let i = 0; i < data.PAYS.records.length; i++) {

          let code_option_generated = document.createElement("option");
          code_option_generated.value = data.PAYS.records[i][0]; // tout les code pays (donc l'index 0 par rapport à la structure de l'api pays)
          code_option_generated.innerText = data.PAYS.records[i][1]; //tout les noms de pays (donc l'index 1 par rapport à la structure de l'api pays)
          code_select_generated.appendChild(code_option_generated);
        }
        combo.appendChild(code_select_generated);
      });

    document.getElementById("new_region").addEventListener("click", () => {
      $(".modal-addNomPays").html("Ajouter un pays");
      $(".modal-addNomRegion").html("Ajouter une région");

      $("#addModal").modal("show");

      document.getElementById("saveChangesBtnAdd").addEventListener("click", () => {
          const AddNomRegionInput =document.getElementById("addNomRegion").value;
          const select = document.getElementById("id_select").value;
          if (AddNomRegionInput.length === 0) {
            
            Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');

          } else {
            let requestOptionsAdd = {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },

              body: JSON.stringify({
                CODEPAYS: select,
                NOMREGION: AddNomRegionInput,
              }),
            };

            fetch(urlApiRegion, requestOptionsAdd)
              .then((response) => response.json())
              .then(function (data) {
                $("#addModal").modal("hide");
               displayMsg(false,false,true,data);
              })
              .catch(function (error) {
                alert("Ajax error: " + error);
              });
          }
        });
    });


    // DELETE  
    function deleteRegion(){


      let btnDelete = document.getElementsByClassName("delete");

      for (let i = 0; i < btnDelete.length; i++) {
           
        btnDelete[i].addEventListener("click", function () {
          let row = this.parentNode.parentNode;
          let codeRegion = row.childNodes[0].textContent;

          Swal.fire({
            title: '&#128552;',
            html: "<b>Vous êtes sûr de vouloir supprimer la région numéro " + codeRegion + " ?</b>",
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
                  "Content-Type": "application/json",
                },
              };
      
              fetch(urlApiRegion + "/" + codeRegion, requestOptions)
                .then((response) => response.json())
                .then(function () {
                  displayMsg(true,false,false,codeRegion)
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });



            } 
          });
         
        });
      }
    }
    

    function editRegion(){

      fetch(urlApiPays, requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        const code_select_generated = document.createElement("select");
        code_select_generated.setAttribute("id", "id_selectModif");
        const combo = document.getElementById("comboModifPays");

        for (let i = 0; i < data.PAYS.records.length; i++) {

          let code_option_generated = document.createElement("option");
          code_option_generated.value = data.PAYS.records[i][0];
          code_option_generated.innerText = data.PAYS.records[i][1];
          code_select_generated.appendChild(code_option_generated);
        }
        combo.appendChild(code_select_generated);
      });


      let btnModif = document.getElementsByClassName("modif");
      for (let i = 0; i < btnModif.length; i++) {
        btnModif[i].addEventListener("click", function () {
          const row = this.parentNode.parentNode;
          const code = row.cells[0].textContent;

          $(".modal-NomPays").html("Editer Nom du pays");
          $(".modal-NomRegion").html("Editer Nom de la région");

          $("#editModal").modal("show");
  
          const NomRegionInput = document.getElementById("modifRegion");
          NomRegionInput.value = row.cells[2].textContent;
  
  
          document .getElementById("saveChangesBtnModifRegion").addEventListener("click", () => {

            Swal.fire({
              html: "<b>Vous êtes sûr de vouloir modifier la région " + code + " ?</b>",
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Oui',
              cancelButtonText: 'Non'
            }).then((result) => {
              if (result.isConfirmed) {  

                const select = document.getElementById("id_selectModif").value;
                const EditNomRegionInput = document.getElementById("modifRegion").value;
  
                const newData = {
                  CODEPAYS: select,
                  NOMREGION : EditNomRegionInput
                };
    
                let requestOptions = {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newData),
                };
    
                fetch(urlApiRegion + "/" + code, requestOptions)
                  .then((response) => response.json())
                  .then(function () {
                    row.cells[2].textContent = NomRegionInput.value;

                    displayMsg(false,true,false,code,row)
                    $("#editModal").modal("hide");
                  })
                  .catch(function (error) {
                    alert("Ajax error: " + error);
                  });
                
              } });
            });
        });
      }
    }

    function viewRegion() {
      let btnVue = document.getElementsByClassName('view');
      for (let i = 0; i < btnVue.length; i++) {
        btnVue[i].addEventListener('click', function () {
          let row = this.parentNode.parentNode;
          let codeRegion = row.cells[0].textContent;
          let nomPays = row.cells[1].textContent;
          let nomRegion = row.cells[2].textContent;
          
          let modalTitle = document.querySelector('#viewModal .modal-title');
          
          modalTitle.innerHTML = "Code de la région : " + codeRegion + "<br>Pays : " + nomPays + "<br>Région : " + nomRegion;
          
          $('#viewModal').modal('show');
        });
      }
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
          location.reload()
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

function searchRegions() {
  const searchBarValue = $("#search").val();
  const rows = table.getElementsByClassName("data");
  let matchesFound = false; // flag
  msg.innerHTML ="";
  table.style.visibility = "visible";
  scrollDownButton.style.visibility = "visible";
  scrollTopButton.style.visibility = "visible";

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

    table.style.visibility = "hidden";
    scrollDownButton.style.visibility = "hidden";
    scrollTopButton.style.visibility = "hidden";
    msg.innerHTML = "<b>Aucune correspondance pour : " +searchBarValue+ " &#128532</b>";
  } 

}

const Input = document.getElementById("search");

const scrollDownButton = document.getElementById('scrollButton');
const scrollTopButton = document.getElementById('scrollTopButton');

Input.addEventListener("input", (event) => {
  event.preventDefault();
  searchRegions();
});

  
  scrollDownButton.addEventListener('click', function() {
    const full_page = document.documentElement; // document.documentElement represente toute ma page 
    full_page.scrollIntoView({ behavior: 'smooth', block: 'end' }); // j'utilise la fonction scrollIntoView qui me permet d'aller en bas de la page de manière 'smooth'
  });

  scrollTopButton.addEventListener('click', function() {
    const topElement = document.body; // ici document.body represente l'élément le plus haut de la page alors je demande simplement à ma foncttion scrollintoview d"y scroller 

    topElement.scrollIntoView({ behavior: 'smooth' });  
  }); 

  manageRegions(urlApiRegion);
});
