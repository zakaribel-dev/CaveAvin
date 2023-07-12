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
// match bien avec le code couleur de l'api VIN (vinElement.CODECOULEUR)
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
  
      fetch(urlApiVins + "?include=COULEUR,REGION,APPELLATION&transform=1", requestOptions)
        .then((response) => response.json())
        .then(function (data) {
          const code_select_generated_Appellation = document.createElement("select");
          code_select_generated_Appellation.setAttribute("id", "id_selectAppellation");
          const code_select_generated_color = document.createElement("select");
          code_select_generated_color.setAttribute("id", "id_selectColor");
          const code_select_generated_region = document.createElement("select");
          code_select_generated_region.setAttribute("id", "id_selectRegion");

          const comboAppellation = document.getElementById("comboVin"); 
          const comboColor = document.getElementById("comboColor");  
          const comboRegion = document.getElementById("comboRegion");    
   
          for (let i = 0; i < data.VIN.length; i++) {
            // Combo box des appellations
            let code_option_generated_Appellation = document.createElement("option");
            code_option_generated_Appellation.value = data.VIN[i].APPELLATION[0].CODEAPPELLATION;
            code_option_generated_Appellation.innerText = data.VIN[i].APPELLATION[0].NOMAPPELLATION;
            code_select_generated_Appellation.appendChild(code_option_generated_Appellation);
            comboAppellation.appendChild(code_select_generated_Appellation);
          
            // Combo box des couleurs
            let code_option_generated_color = document.createElement("option");
            code_option_generated_color.value = data.VIN[i].COULEUR[0].CODECOULEUR;
            code_option_generated_color.innerText = data.VIN[i].COULEUR[0].NOMCOULEUR;
            code_select_generated_color.appendChild(code_option_generated_color);
            comboColor.appendChild(code_select_generated_color);
          
            // Combo box des régions
            let code_option_generated_region = document.createElement("option");
            code_option_generated_region.value = data.VIN[i].REGION[0].CODEREGION;
            code_option_generated_region.innerText = data.VIN[i].REGION[0].NOMREGION;
            code_select_generated_region.appendChild(code_option_generated_region);
            comboRegion.appendChild(code_select_generated_region);
          }
        });
  

       
      document.getElementById("new_wine").addEventListener("click", () => {
        $(".modal-addNomVin").html("Nom du vin");
        $(".modal-addNomCouleur").html("Couleur");
        $(".modal-addNomRegion").html("Région");
        $(".modal-addNomVin").html("Nom du vin");
        $(".modal-addCulture").html("Culture");
        $(".modal-addCommentaire").html("Commentaires");

  
        $("#addModal").modal("show");
  
        document.getElementById("saveChangesBtnAdd").addEventListener("click", () => {
            const AddNomVin =document.getElementById("nomVin").value;
            const AddCulture =document.getElementById("culture").value;
            const AddCommentaire =document.getElementById("commentaire").value;

            const selectAppellation = document.getElementById("id_selectAppellation").value;
            const selectColor = document.getElementById("id_selectColor").value;
            const selectRegion = document.getElementById("id_selectRegion").value;

            console.log(selectAppellation);

            if (AddNomVin.length === 0 || AddCulture.length === 0 || AddCommentaire.length === 0) {
             
                Swal.fire('Hey &#128545; !', '<b>Merci de remplir tous les champs demandés...</b>', 'error');

            } else {
              let requestOptionsAdd = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
  
                body: JSON.stringify({
                  CODEAPPELLATION: selectAppellation,
                  CODECOULEUR : selectColor,
                  CODEREGION : selectRegion,
                  NOM_CUVEE: AddNomVin,
                  COMMENTAIRES : AddCommentaire,
                  TYPE_DE_CULTURE : AddCulture
                }),
              };
  
              fetch(urlApiVins, requestOptionsAdd)
                .then((response) => response.json())
                .then(function (data) {
                  $("#addModal").modal("hide");
                  msg.style = "font-size:25px"
                  msg.innerHTML =
                  "<div class='alert alert-success' role='alert' style=font-weight:bolder;>Nouveau vin ajouté, il aura le code : " +
                  data +
                  "&#128079; <br> <button id='reloadWine' class='btn-primary'>Rechargez la liste des vins en cliquant ici !</button></div>";  
        
                  const btnReloadWines = document.getElementById('reloadWine');
        
                  btnReloadWines.addEventListener('click',()=>{
                    location.reload();
                  })                    
                })
                .catch(function (error) {
                  alert("Ajax error: " + error);
                });
            }
          });
      });
  


      // DELETE //

      function deleteRegion(){
        let btnDelete = document.getElementsByClassName("delete");
      
        for (let i = 0; i < btnDelete.length; i++) {
          btnDelete[i].addEventListener("click", function () {
            let row = this.parentNode.parentNode;
            let codeVin = row.childNodes[0].textContent;
    
            table.removeChild(row);
    
            let requestOptions = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            };
    
            fetch(urlApiVins + "/" + codeVin, requestOptions)
              .then((response) => response.json())
              .then(function () {

                  displayMsg(true,false,codeVin);
              })
              .catch(function (error) {
                alert("Ajax error: " + error);
              });
          });
        }
      }
      

             // EDIT //
  
      function editRegion(){
  
        fetch(urlApiVins + "?include=COULEUR,REGION,APPELLATION&transform=1", requestOptions)
        .then((response) => response.json())
        .then(function (data) {
          const code_select_generated_Appellation = document.createElement("select");
          code_select_generated_Appellation.setAttribute("id", "id_selectEditAppellation");
          const code_select_generated_color = document.createElement("select");
          code_select_generated_color.setAttribute("id", "id_selectEditColor");
          const code_select_generated_region = document.createElement("select");
          code_select_generated_region.setAttribute("id", "id_selectEditRegion");

          const comboAppellation = document.getElementById("comboModifAppellation"); 
          const comboColor = document.getElementById("comboEditColor");  
          const comboRegion = document.getElementById("comboEditRegion");    
   
          for (let i = 0; i < data.VIN.length; i++) {

            // Combbox des appellations
            let code_option_generated_Appellation = document.createElement("option");
            code_option_generated_Appellation.value = data.VIN[i].APPELLATION[0].CODEAPPELLATION;
            code_option_generated_Appellation.innerText = data.VIN[i].APPELLATION[0].NOMAPPELLATION;
            code_select_generated_Appellation.appendChild(code_option_generated_Appellation);
            comboAppellation.appendChild(code_select_generated_Appellation);
          
            // Combobox des couleurs
            let code_option_generated_color = document.createElement("option");
            code_option_generated_color.value = data.VIN[i].COULEUR[0].CODECOULEUR;
            code_option_generated_color.innerText = data.VIN[i].COULEUR[0].NOMCOULEUR;
            code_select_generated_color.appendChild(code_option_generated_color);
            comboColor.appendChild(code_select_generated_color);
          
            // Combobox des régions
            let code_option_generated_region = document.createElement("option");
            code_option_generated_region.value = data.VIN[i].REGION[0].CODEREGION;
            code_option_generated_region.innerText = data.VIN[i].REGION[0].NOMREGION;
            code_select_generated_region.appendChild(code_option_generated_region);
            comboRegion.appendChild(code_select_generated_region);
          }
        });

       
        let btnModif = document.getElementsByClassName("modif");
        for (let i = 0; i < btnModif.length; i++) {
          btnModif[i].addEventListener("click", function () {
            const row = this.parentNode.parentNode;
            const code = row.cells[0].textContent;

            $(".modal-ModifAppellation").html("Modifier l'Appellation");
            $(".modal-ModifNomCouleur").html("Modifier la Couleur");
            $(".modal-ModifNomRegion").html("Modifier la Région");
            $(".modal-ModifNomVin").html("Modifier le Nom du vin");
            $(".modal-ModifCulture").html("Modifier la Culture");
            $(".modal-ModifCommentaire").html("Modifier le Commentaire");
  
            $("#editModal").modal("show");

      
            const EditNomVin = document.getElementById("EditNomVin");
            const EditCulture = document.getElementById("ModifCulture");
            const EditCommentaire = document.getElementById("ModifCommentaire");
            EditNomVin.value = row.cells[1].textContent;
            EditCulture.value = row.cells[5].textContent
            EditCommentaire.value = row.cells[6].textContent

    
            document .getElementById("saveChangesBtnModif").addEventListener("click", () => {
              const EditNomVin =document.getElementById("EditNomVin").value;
              const EditCulture =document.getElementById("ModifCulture").value;
              const EditCommentaire =document.getElementById("ModifCommentaire").value;
  
              const selectAppellation = document.getElementById("id_selectEditAppellation").value;
              const selectColor = document.getElementById("id_selectEditColor").value;
              const selectRegion = document.getElementById("id_selectEditRegion").value;
  
                
              let requestOptionsEdit = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
  
                body: JSON.stringify({
                  CODEAPPELLATION: selectAppellation,
                  CODECOULEUR : selectColor,
                  CODEREGION : selectRegion,
                  NOM_CUVEE: EditNomVin,
                  COMMENTAIRES : EditCommentaire,
                  TYPE_DE_CULTURE : EditCulture
                }),
              };
    
           
                fetch(urlApiVins + "/" + code, requestOptionsEdit)
                  .then((response) => response.json())
                  .then(function () {
                    msg.innerHTML =
                      "<div class='alert alert-primary' role='alert' style=font-weight:bolder;>Vin " +
                      code +
                      " modifié.</div>";

                      const EditNomVin = document.getElementById("EditNomVin");
                      const EditCulture = document.getElementById("ModifCulture");
                      const EditCommentaire = document.getElementById("ModifCommentaire");
                      row.cells[1].textContent = EditNomVin.value;
                      row.cells[5].textContent = EditCulture.value;
                      row.cells[6].textContent = EditCommentaire.value;

                      displayMsg(false,true,code)

                    $("#editModal").modal("hide");
                  })
                  .catch(function (error) {
                    alert("Ajax error: " + error);
                  });
              });
          });
        }
      }

      function displayMsg(deleteRow, editRow, row) {
        msg.style.visibility = "visible";
      
        if (deleteRow) {
          msg.style = "font-size:40px"
          msg.innerHTML =
            "<div class='alert alert-danger' role='alert' style=font-weight:bolder;>Vin numéro "+row+" supprimé &#128532;</div>";
        } else if (editRow) {
          msg.style = "font-size:40px"
          msg.innerHTML =
            "<div class='alert alert-primary' role='alert'style=font-weight:bolder;>Vin numéro "+row+" modifié &#129488;</div>";
        }
      



        setTimeout(function () {
          msg.classList.add("fade-out");
        }, 1000);
      
        setTimeout(function () {
          msg.style.visibility = "hidden";
          msg.classList.remove("fade-out");
        }, 2400);
      }
      
  
      function viewRegion() {
        let btnVue = document.getElementsByClassName('view');
        for (let i = 0; i < btnVue.length; i++) {
          btnVue[i].addEventListener('click', function () {
            let row = this.parentNode.parentNode;

            let codeVin = row.cells[0].textContent;
            let nomRegion = row.cells[3].textContent;
            let nomVin = row.cells[1].textContent;
            let Appellation = row.cells[2].textContent;
            let Couleur = row.cells[4].textContent;
            let Culture = row.cells[5].textContent;
            let Commentaires = row.cells[6].textContent;
   
            let modalTitle = document.querySelector('#viewModal .modal-title');
            
            modalTitle.innerHTML = 
            "Code vin : " + codeVin + "<br><br>Nom du vin : " + nomVin + "<br><br>Appellation : " 
            + Appellation + "<br><br>Région : " + nomRegion + "<br><br>Couleur : " + Couleur + "<br><br>Culture : " + Culture + 
            "<br><br>Commentaires : " + Commentaires;
          
            $('#viewModal').modal('show');
          });
        }
      }
  
  }
  
  function searchWines(code) {
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
    
      const code = codeInput.value;
      searchWines(code);
    });

    scrollDownButton.addEventListener('click', function() {
      const bottomElement = document.documentElement;
      bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
 
    scrollTopButton.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    getRegions(urlApiVins)
  });
  