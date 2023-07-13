window.addEventListener("load", () => {
  const table = document.getElementById("table_id");
  table.className = "table table-dark table-hover container mt-5 text-center";
  const msg = document.getElementById("msg");
  const limit = 10;

  function getRegions(urlApiRegion) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(urlApiRegion + "?include=PAYS&transform=1", requestOptions)
      .then((response) => response.json())
      .then(function (data) {
        data.REGION.map(function (regionElement) {
          let tr = document.createElement("tr");

          let codeRegionTd = document.createElement("td");
          codeRegionTd.textContent = regionElement.CODEREGION;

          let paysTd = document.createElement("td");
          if (regionElement.PAYS.length <= 0) {
            paysTd.textContent = "France";
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
          code_option_generated.value = data.PAYS.records[i][0];
          code_option_generated.innerText = data.PAYS.records[i][1];
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
                msg.style = "font-size:25px"
                msg.innerHTML =
                "<div class='alert alert-success' role='alert' style=font-weight:bolder;>Nouvelle région ajoutée, elle aura le code : " +
                data +
                "&#128079; <br> <button id='reloadWine' class='btn-primary'>Rechargez la liste des région en cliquant ici !</button></div>";  
      
                const btnReloadWines = document.getElementById('reloadWine');
      
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


    // DELETE

    function deleteRegion(){
      let btnDelete = document.getElementsByClassName("delete");
    
      for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", function () {
          let row = this.parentNode.parentNode;
          let codeRegion = row.childNodes[0].textContent;
          console.log(codeRegion)
  
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
              displayMsg(true,false,codeRegion)
            })
            .catch(function (error) {
              alert("Ajax error: " + error);
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
  
          $(".modal-NomPays").html("Editer Nom du pays");
          $(".modal-NomRegion").html("Editer Nom de la région");

  
          $("#editModal").modal("show");
  
          const NomRegionInput = document.getElementById("modifRegion");
          NomRegionInput.value = row.cells[2].textContent;
  
          const code = row.cells[0].textContent;
  
          document .getElementById("saveChangesBtnModifRegion").addEventListener("click", () => {
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
                  displayMsg(false,true,code)
                  row.cells[2].textContent = NomRegionInput.value;
                  $("#editModal").modal("hide");
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
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

function searchRegions(code) {
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

  const form = document.getElementById("form_id");
  const codeInput = document.getElementById("code");
  const btnReload = document.getElementById("reload");
  const scrollDownButton = document.getElementById('scrollButton');
  const scrollTopButton = document.getElementById('scrollTopButton');
  btnReload.style.visibility = "hidden";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    scrollDownButton.style.visibility = "hidden";
    scrollTopButton.style.visibility = "hidden";
    const code = codeInput.value;
    searchRegions(code);
  });

  
  scrollDownButton.addEventListener('click', function() {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }); 

  getRegions(urlApiRegion);
});
