window.addEventListener("load", () => {
    const table = document.getElementById("table_id");
    table.className = "table table-dark table-hover container mt-5 text-center";
    const msg = document.getElementById("msg");
  
    function getRegions(urlApiVins) {
        let requestOptions = {
            method: "GET",
            redirect: "follow",
          };
        
          fetch(urlApiVins + "?include=COULEUR,REGION,APPELLATION&transform=1", requestOptions)
            .then((response) => response.json())
            .then(function (data) {
              data.VIN.map(function (vinElement) {
                let tr = document.createElement("tr");
    
                let codeVinTd = document.createElement("td");
                codeVinTd.textContent = vinElement.CODEVIN;
        
                let nomVinTd = document.createElement("td");
                nomVinTd.textContent = vinElement.NOM_CUVEE;
        
                let appellationTd = document.createElement("td");
                appellationTd.textContent = vinElement.CODEAPPELLATION;
        
                let regionTd = document.createElement("td");
                let couleurTd = document.createElement("td");
                let cultureTd = document.createElement("td");
                let commentairesTd = document.createElement("td");
                let actionsTd = document.createElement("td");
                actionsTd.style.width = "150px";
                
// ici je cherche à savoir si le code couleur de l'api COULEUR (color.CODECOULEUR) 
//match bien avec le code couleur de l'api VIN (vinElement.CODECOULEUR)
                let colorObj = vinElement.COULEUR.find((color) => color.CODECOULEUR === vinElement.CODECOULEUR);

                if (colorObj) {
                  couleurTd.textContent = colorObj.NOMCOULEUR;
                } else {
                  couleurTd.textContent = "Couleur non trouvée, désolé !";
                }

                // à la recherche de THE region :)
                let regionObj = vinElement.REGION.find((region) => region.CODEREGION === vinElement.CODEREGION);
                if (regionObj) {
                    regionTd.textContent = regionObj.NOMREGION;
                  } else {
                    regionTd.textContent = "Region non trouvée sorry!";
                  }
                
                  // à la recherche de THE appellation :)
                  let appellationObj = vinElement.APPELLATION.find((appellation) => appellation.CODEAPPELLATION === vinElement.CODEAPPELLATION);
                  if (appellationObj) {
                      appellationTd.textContent = appellationObj.NOMAPPELLATION;
                    } else {
                      appellationTd.textContent = "appellation non trouvée sorry!!";
                    }

                cultureTd.textContent = vinElement.TYPE_DE_CULTURE;
                commentairesTd.textContent = vinElement.COMMENTAIRES;
        
                actionsTd.innerHTML = `
                  <button class="modif btn btn-info btn-sm fas fa-pencil-alt fa-sm"></button>
                  <button class="delete btn btn-danger btn-sm fas fa-trash-alt fa-sm"></button>
                  <button class="view btn btn-success btn-sm fas fa-eye fa-sm"></button>
                `;
        
                tr.appendChild(codeVinTd);
                tr.appendChild(nomVinTd);
                tr.appendChild(appellationTd);
                tr.appendChild(regionTd);
                tr.appendChild(couleurTd);
                tr.appendChild(cultureTd);
                tr.appendChild(commentairesTd);
                tr.appendChild(actionsTd);
        
                table.appendChild(tr);
              });
        
              deleteRegion();
              editRegion();
              viewRegion();
            })
            .catch(function (error) {
              console.log("Une erreur s'est produite lors de la récupération des données :", error);
            });
  
      /////////// ADD ///////////
  
      fetch(urlApiVins, requestOptions)
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
              const msgModal = document.getElementById("msgModal");
              msgModal.innerHTML =
                "Merci de bien vouloir remplire les champs demandés.";
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
  
              fetch(urlApiVins, requestOptionsAdd)
                .then((response) => response.json())
                .then(function (data) {
                  $("#addModal").modal("hide");
                  msg.innerHTML =
                    "<div class='alert alert-success' role='alert' style=font-weight:bolder;>Nouvelle région ajoutée, elle aura le code : " +
                    data +
                    " :) <br> Rafraichissez la page !</div>";
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
    
            fetch(urlApiVins + "/" + codeRegion, requestOptions)
              .then((response) => response.json())
              .then(function () {
                msg.innerHTML =
                  "<div class='alert alert-danger' role='alert' style=font-weight:bolder;>Pays numéro " +
                  codeRegion +
                  " supprimé</div>";
              })
              .catch(function (error) {
                alert("Ajax error: " + error);
              });
          });
        }
      }
      
  
      function editRegion(){
  
        fetch(urlApiVins, requestOptions)
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
    
                fetch(urlApiVins + "/" + code, requestOptions)
                  .then((response) => response.json())
                  .then(function () {
                    msg.innerHTML =
                      "<div class='alert alert-primary' role='alert' style=font-weight:bolder;>Pays " +
                      code +
                      " modifié.</div>";
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
            
            // Sélectionner les éléments de la modal "View"
            let modalTitle = document.querySelector('#viewModal .modal-title');
            
            // Mettre à jour le contenu de la modal avec les informations du pays
            modalTitle.innerHTML = "Code de la région : " + codeRegion + "<br>Pays : " + nomPays + "<br>Région : " + nomRegion;
            
            // Afficher la modal "View"
            $('#viewModal').modal('show');
          });
        }
      }
  
  }
  
    function searchRegions(code) {
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
    }
  
    const form = document.getElementById("form_id");
    const codeInput = document.getElementById("code");
    const btnReload = document.getElementById("reload");
    btnReload.style.visibility = "hidden";
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      btnReload.style.visibility = "visible";
      btnReload.addEventListener("click", () => {
        location.reload();
      });
      const code = codeInput.value;
      searchRegions(code);
    });
  
    getRegions(urlApiVins)
  });
  